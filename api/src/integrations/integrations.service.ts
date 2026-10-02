import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { WorkspaceService } from '../workspace/workspace.service.js';
import type { ConnectGmailInput } from './dto/connect-gmail.input.js';
import type { Channel, IntegrationsPayload } from './types/integrations.type.js';

/**
 * Only the webhook token is real per-workspace state today; the remaining
 * channels have no connect flow yet, so their status is static. Once one of
 * them can actually be connected, this becomes a table.
 */
const CHANNELS: Channel[] = [
  { name: 'Inbound Form', status: 'Connected' },
  { name: 'Webhook', status: 'Connected' },
  { name: 'Chat Handoff', status: 'Available' },
  { name: 'CRM Sync (HubSpot)', status: 'Available' },
  { name: 'Slack Notifications', status: 'Available' },
];

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceService: WorkspaceService,
    private readonly config: ConfigService,
  ) {}

  async findForOrg(orgId: string): Promise<IntegrationsPayload> {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      select: { webhookToken: true, gmailUser: true, gmailAppPassword: true },
    });
    if (!org) {
      throw new NotFoundException('Workspace not found');
    }
    return this.toPayload(org);
  }

  async connectGmail(orgId: string, input: ConnectGmailInput): Promise<IntegrationsPayload> {
    const org = await this.prisma.organization.update({
      where: { id: orgId },
      data: {
        gmailUser: input.email.trim().toLowerCase(),
        gmailAppPassword: input.appPassword.replace(/\s+/g, ''),
      },
      select: { webhookToken: true, gmailUser: true, gmailAppPassword: true },
    });
    return this.toPayload(org);
  }

  private toPayload(org: {
    webhookToken: string;
    gmailUser: string | null;
    gmailAppPassword: string | null;
  }): IntegrationsPayload {
    const saved = Boolean(org.gmailUser && org.gmailAppPassword);
    const envUser = this.config.get<string>('gmailUser')?.trim() || null;
    const envPass = this.config.get<string>('gmailAppPassword')?.trim() ?? '';
    const inboundToken = this.config.get<string>('inboundEmailToken')?.trim() ?? '';
    const envForThisOrg = Boolean(envUser && envPass && inboundToken === org.webhookToken);
    const inboxConnected = saved || envForThisOrg;
    const mailboxAddress = org.gmailUser || (inboxConnected ? envUser : null);
    const gmail: Channel = {
      name: 'Gmail',
      status: inboxConnected ? 'Connected' : 'Not connected',
    };

    return {
      webhookUrl: this.workspaceService.buildWebhookUrl(org.webhookToken),
      channels: [gmail, ...CHANNELS],
      mailboxAddress,
      repliesEnabled: inboxConnected,
      inboxConnected,
    };
  }
}
