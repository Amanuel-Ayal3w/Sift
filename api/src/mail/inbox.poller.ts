import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { PrismaService } from '../prisma/prisma.service.js';
import { LeadIngestService } from '../webhooks/lead-ingest.service.js';
import { leadFromInboundMail } from './inbound-mail.js';

type Mailbox = { user: string; appPassword: string; token: string };

const POLL_MS = 30_000;

@Injectable()
export class InboxPoller implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(InboxPoller.name);
  private timer: NodeJS.Timeout | null = null;
  private running = false;
  private readonly seen = new Set<string>();

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly ingest: LeadIngestService,
  ) {}

  onModuleInit(): void {
    void this.poll();
    this.timer = setInterval(() => void this.poll(), POLL_MS);
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private async poll(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      const mailboxes = await this.mailboxes();
      for (const mailbox of mailboxes) {
        await this.pollMailbox(mailbox);
      }
    } finally {
      this.running = false;
    }
  }

  private async mailboxes(): Promise<Mailbox[]> {
    const orgs = await this.prisma.organization.findMany({
      where: { gmailUser: { not: null }, gmailAppPassword: { not: null } },
      select: { gmailUser: true, gmailAppPassword: true, webhookToken: true },
    });
    const boxes: Mailbox[] = orgs.flatMap((org) =>
      org.gmailUser && org.gmailAppPassword
        ? [{ user: org.gmailUser, appPassword: org.gmailAppPassword, token: org.webhookToken }]
        : [],
    );

    const envUser = this.config.get<string>('gmailUser')?.trim() ?? '';
    const envPass = this.config.get<string>('gmailAppPassword')?.trim() ?? '';
    const envToken = this.config.get<string>('inboundEmailToken')?.trim() ?? '';
    if (envUser && envPass && envToken && !boxes.some((box) => box.token === envToken)) {
      boxes.push({ user: envUser, appPassword: envPass, token: envToken });
    }
    return boxes;
  }

  private async pollMailbox(mailbox: Mailbox): Promise<void> {
    const client = new ImapFlow({
      host: 'imap.gmail.com',
      port: 993,
      secure: true,
      auth: { user: mailbox.user, pass: mailbox.appPassword },
      logger: false,
    });

    try {
      await client.connect();
      const lock = await client.getMailboxLock('INBOX');
      try {
        const uids = await client.search({ seen: false });
        for (const uid of uids || []) {
          await this.ingestUid(client, uid, mailbox.user, mailbox.token);
        }
      } finally {
        lock.release();
      }
      await client.logout();
    } catch (error) {
      this.logger.error(`Gmail inbox poll failed for ${mailbox.user}: ${String(error)}`);
      try {
        await client.logout();
      } catch {
        // The connection is already unusable.
      }
    }
  }

  private async ingestUid(
    client: ImapFlow,
    uid: number,
    mailbox: string,
    token: string,
  ): Promise<void> {
    const message = await client.fetchOne(String(uid), { source: true }, { uid: true });
    if (!message || !message.source) return;

    const parsed = await simpleParser(message.source);
    const from = parsed.from?.value[0];
    const messageId = parsed.messageId ?? '';
    if (messageId && this.seen.has(messageId)) {
      await client.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true });
      return;
    }

    const lead = leadFromInboundMail(
      {
        fromAddress: from?.address,
        fromName: from?.name,
        subject: parsed.subject,
        text: parsed.text,
        messageId: parsed.messageId,
        autoSubmitted: headerValue(parsed.headers.get('auto-submitted')),
      },
      mailbox,
    );
    if (!lead) {
      await client.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true });
      return;
    }

    await this.ingest.ingest(token, lead);
    if (messageId) this.seen.add(messageId);
    await client.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true });
    this.logger.log(`Queued email from ${lead.email}`);
  }
}

function headerValue(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return undefined;
}
