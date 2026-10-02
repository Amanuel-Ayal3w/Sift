import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';

export type MailboxCredentials = {
  user: string;
  appPassword: string;
};

export type OutboundReply = {
  to: string;
  subject: string;
  text: string;
  replyToMessageId?: string;
  from?: MailboxCredentials;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transport: Transporter | null;
  private readonly fromAddress: string;

  constructor(config: ConfigService) {
    this.fromAddress = config.get<string>('gmailUser') ?? '';
    const pass = config.get<string>('gmailAppPassword') ?? '';
    if (!this.fromAddress || !pass) {
      this.transport = null;
      return;
    }
    this.transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: this.fromAddress, pass },
    });
  }

  get enabled(): boolean {
    return this.transport !== null;
  }

  get mailboxAddress(): string {
    return this.fromAddress;
  }

  canSend(from?: MailboxCredentials | null): boolean {
    return Boolean(from?.user && from.appPassword) || this.transport !== null;
  }

  async sendReply(reply: OutboundReply): Promise<boolean> {
    const from = reply.from?.user && reply.from.appPassword ? reply.from : null;
    const transport = from
      ? nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: { user: from.user, pass: from.appPassword },
        })
      : this.transport;
    const fromAddress = from?.user || this.fromAddress;
    if (!transport || !fromAddress) return false;

    await transport.sendMail({
      from: fromAddress,
      to: reply.to,
      subject: reply.subject,
      text: reply.text,
      inReplyTo: reply.replyToMessageId,
      references: reply.replyToMessageId,
    });
    this.logger.log(`Sent reply to ${reply.to}`);
    return true;
  }
}
