import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LeadStatus, type Lead } from '@prisma/client';
import { replySubject } from '../mail/inbound-mail.js';
import { MailService } from '../mail/mail.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { LeadsPubSub } from './leads.pubsub.js';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly leadsPubSub: LeadsPubSub,
    private readonly mail: MailService,
  ) {}

  findMany(
    orgId: string,
    { status, limit, offset }: { status?: LeadStatus; limit: number; offset: number },
  ): Promise<Lead[]> {
    return this.prisma.lead.findMany({
      where: { orgId, ...(status ? { status } : {}) },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async findOne(orgId: string, id: string): Promise<Lead> {
    // Scoped by orgId so an id from another tenant reads as "not found".
    const lead = await this.prisma.lead.findFirst({ where: { id, orgId } });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }
    return lead;
  }

  async updateStatus(
    orgId: string,
    id: string,
    status: LeadStatus,
  ): Promise<Lead> {
    await this.findOne(orgId, id);
    const lead = await this.prisma.lead.update({
      where: { id },
      data: { status },
    });
    await this.leadsPubSub.publishLead(lead);
    return lead;
  }

  async sendReply(orgId: string, id: string): Promise<Lead> {
    const lead = await this.findOne(orgId, id);
    if (lead.status === LeadStatus.CONTACTED) return lead;

    const text = lead.draftReply?.trim();
    if (!text) {
      throw new BadRequestException('This lead has no reply to send');
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      select: { name: true, gmailUser: true, gmailAppPassword: true },
    });
    const from =
      org?.gmailUser && org.gmailAppPassword
        ? { user: org.gmailUser, appPassword: org.gmailAppPassword }
        : null;
    if (!this.mail.canSend(from)) {
      throw new BadRequestException('Gmail is not connected');
    }
    const subject =
      lead.source === 'Email' ? lead.message.split('\n', 1)[0] : undefined;
    const sent = await this.mail.sendReply({
      to: lead.email,
      subject: replySubject(org?.name ?? 'Sift', subject),
      text,
      from: from ?? undefined,
    });
    if (!sent) {
      throw new BadRequestException('Gmail is not connected');
    }

    const updated = await this.prisma.lead.update({
      where: { id },
      data: { status: LeadStatus.CONTACTED },
    });
    await this.leadsPubSub.publishLead(updated);
    return updated;
  }
}
