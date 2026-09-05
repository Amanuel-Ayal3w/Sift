import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Organization } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { UpdateWorkspaceInput } from './dto/update-workspace.input.js';
import type { Workspace } from './types/workspace.type.js';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async findById(orgId: string): Promise<Workspace> {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) {
      throw new NotFoundException('Workspace not found');
    }
    return this.toWorkspace(org);
  }

  async update(orgId: string, input: UpdateWorkspaceInput): Promise<Workspace> {
    const org = await this.prisma.organization.update({
      where: { id: orgId },
      data: input,
    });
    return this.toWorkspace(org);
  }

  buildWebhookUrl(webhookToken: string): string {
    const base = this.config.getOrThrow<string>('publicApiUrl');
    return `${base.replace(/\/+$/, '')}/webhooks/leads/${webhookToken}`;
  }

  private toWorkspace(org: Organization): Workspace {
    return {
      id: org.id,
      name: org.name,
      qualificationCriteria: org.qualificationCriteria,
      productDescription: org.productDescription,
      replyTone: org.replyTone,
      webhookUrl: this.buildWebhookUrl(org.webhookToken),
      createdAt: org.createdAt,
    };
  }
}
