import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { WorkspaceService } from '../workspace/workspace.service.js';
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
  ) {}

  async findForOrg(orgId: string): Promise<IntegrationsPayload> {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      select: { webhookToken: true },
    });
    if (!org) {
      throw new NotFoundException('Workspace not found');
    }
    return {
      webhookUrl: this.workspaceService.buildWebhookUrl(org.webhookToken),
      channels: CHANNELS,
    };
  }
}
