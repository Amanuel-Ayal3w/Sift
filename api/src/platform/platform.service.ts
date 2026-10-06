import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Organization, PlatformAdmin as PrismaPlatformAdmin, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { BillingPlan } from '../billing/billing-plan.enum.js';
import { activityByDay, summarizeRevenue, utcDayKeys } from '../billing/plan-metrics.js';
import type { LoginInput } from '../auth/dto/login.input.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { PlatformJwtPayload } from './platform-jwt.js';
import type { PlatformAdmin } from './types/platform-admin.type.js';
import type { PlatformMetrics } from './types/platform-metrics.type.js';
import type { PlatformOverview } from './types/platform-overview.type.js';
import type { PlatformUser } from './types/platform-user.type.js';
import type { PlatformWorkspace } from './types/platform-workspace.type.js';

const BCRYPT_ROUNDS = 10;

type WorkspaceRow = Organization & {
  users: Pick<User, 'email'>[];
  _count: { users: number; leads: number };
};

@Injectable()
export class PlatformService {
  private readonly logger = new Logger(PlatformService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Creates the first operator when both env vars are set and that email
   * does not already exist. An existing row is left alone so a later boot
   * does not reset a rotated password.
   */
  async ensureSeeded(): Promise<void> {
    const email = this.config.get<string>('platformAdminEmail')?.trim().toLowerCase() ?? '';
    const password = this.config.get<string>('platformAdminPassword') ?? '';
    if (!email && !password) {
      return;
    }
    if (!email || !password) {
      throw new Error(
        'Set both PLATFORM_ADMIN_EMAIL and PLATFORM_ADMIN_PASSWORD, or neither',
      );
    }
    if (!email.includes('@') || password.length < 8) {
      throw new Error(
        'PLATFORM_ADMIN_EMAIL must be an email and PLATFORM_ADMIN_PASSWORD must be at least 8 characters',
      );
    }

    const existing = await this.prisma.platformAdmin.findUnique({ where: { email } });
    if (existing) {
      return;
    }

    await this.prisma.platformAdmin.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
      },
    });
    this.logger.log(`Created platform admin account ${email}`);
  }

  async login(input: LoginInput): Promise<{ admin: PlatformAdmin; token: string }> {
    const email = input.email.trim().toLowerCase();
    const admin = await this.prisma.platformAdmin.findUnique({ where: { email } });
    if (!admin || !(await bcrypt.compare(input.password, admin.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return { admin: this.toAdmin(admin), token: this.signToken(admin) };
  }

  async findById(id: string): Promise<PlatformAdmin | null> {
    const admin = await this.prisma.platformAdmin.findUnique({ where: { id } });
    return admin ? this.toAdmin(admin) : null;
  }

  async overview(): Promise<PlatformOverview> {
    const [
      workspaceCount,
      userCount,
      leadCount,
      suspendedWorkspaceCount,
      hotLeads,
      warmLeads,
      coldLeads,
      newLeads,
      reviewedLeads,
      contactedLeads,
      archivedLeads,
    ] = await Promise.all([
      this.prisma.organization.count(),
      this.prisma.user.count(),
      this.prisma.lead.count(),
      this.prisma.organization.count({ where: { suspendedAt: { not: null } } }),
      this.prisma.lead.count({ where: { tier: 'HOT' } }),
      this.prisma.lead.count({ where: { tier: 'WARM' } }),
      this.prisma.lead.count({ where: { tier: 'COLD' } }),
      this.prisma.lead.count({ where: { status: 'NEW' } }),
      this.prisma.lead.count({ where: { status: 'REVIEWED' } }),
      this.prisma.lead.count({ where: { status: 'CONTACTED' } }),
      this.prisma.lead.count({ where: { status: 'ARCHIVED' } }),
    ]);

    return {
      workspaceCount,
      userCount,
      leadCount,
      suspendedWorkspaceCount,
      hotLeads,
      warmLeads,
      coldLeads,
      newLeads,
      reviewedLeads,
      contactedLeads,
      archivedLeads,
    };
  }

  async workspaces(): Promise<PlatformWorkspace[]> {
    const rows = await this.prisma.organization.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { users: true, leads: true } },
        users: {
          where: { role: 'OWNER' },
          select: { email: true },
          take: 1,
        },
      },
    });
    return rows.map((row) => this.toWorkspace(row));
  }

  async metrics(): Promise<PlatformMetrics> {
    const days = utcDayKeys(30, new Date());
    const since = new Date(`${days[0]}T00:00:00.000Z`);
    const [orgs, users, leads, score] = await Promise.all([
      this.prisma.organization.findMany({
        select: {
          createdAt: true,
          plan: true,
          suspendedAt: true,
          gmailUser: true,
          gmailAppPassword: true,
        },
      }),
      this.prisma.user.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      this.prisma.lead.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true, tier: true },
      }),
      this.prisma.lead.aggregate({
        _avg: { score: true },
        where: { score: { not: null } },
      }),
    ]);

    const revenue = summarizeRevenue(
      orgs.map((org) => ({ plan: org.plan, suspended: org.suspendedAt != null })),
    );

    return {
      ...revenue,
      averageScore: Math.round(score._avg.score ?? 0),
      mailboxCount: orgs.filter((org) => org.gmailUser && org.gmailAppPassword).length,
      days: activityByDay(days, leads, orgs, users),
    };
  }

  async users(): Promise<PlatformUser[]> {
    const rows = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { org: { select: { id: true, name: true } } },
    });
    return rows.map((row) => ({
      id: row.id,
      email: row.email,
      role: row.role,
      workspaceId: row.org.id,
      workspaceName: row.org.name,
      createdAt: row.createdAt,
    }));
  }

  async setWorkspaceSuspended(id: string, suspended: boolean): Promise<PlatformWorkspace> {
    const existing = await this.prisma.organization.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Workspace not found');
    }

    await this.prisma.organization.update({
      where: { id },
      data: { suspendedAt: suspended ? new Date() : null },
    });

    return this.loadWorkspace(id);
  }

  async setWorkspacePlan(id: string, plan: BillingPlan): Promise<PlatformWorkspace> {
    const existing = await this.prisma.organization.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Workspace not found');
    }

    await this.prisma.organization.update({
      where: { id },
      data: { plan },
    });

    return this.loadWorkspace(id);
  }

  private async loadWorkspace(id: string): Promise<PlatformWorkspace> {
    const row = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        _count: { select: { users: true, leads: true } },
        users: {
          where: { role: 'OWNER' },
          select: { email: true },
          take: 1,
        },
      },
    });
    if (!row) {
      throw new NotFoundException('Workspace not found');
    }
    return this.toWorkspace(row);
  }

  private signToken(admin: PrismaPlatformAdmin): string {
    const payload: PlatformJwtPayload = {
      sub: admin.id,
      email: admin.email,
      kind: 'platform',
    };
    return this.jwt.sign(payload);
  }

  private toAdmin(admin: PrismaPlatformAdmin): PlatformAdmin {
    return { id: admin.id, email: admin.email, createdAt: admin.createdAt };
  }

  private toWorkspace(row: WorkspaceRow): PlatformWorkspace {
    return {
      id: row.id,
      name: row.name,
      ownerEmail: row.users[0]?.email ?? null,
      userCount: row._count.users,
      leadCount: row._count.leads,
      gmailConnected: Boolean(row.gmailUser && row.gmailAppPassword),
      plan: row.plan,
      suspended: row.suspendedAt != null,
      createdAt: row.createdAt,
    };
  }
}
