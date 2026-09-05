import { Injectable, NotFoundException } from '@nestjs/common';
import type { Lead, LeadStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

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
    return this.prisma.lead.update({ where: { id }, data: { status } });
  }
}
