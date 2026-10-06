import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ConfigService } from '@nestjs/config';
import { PlatformService } from './platform.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';

function serviceWith(prisma: Partial<PrismaService>, configValues: Record<string, string> = {}) {
  const jwt = { sign: vi.fn().mockReturnValue('signed-token') } as unknown as JwtService;
  const config = {
    get: (key: string) => configValues[key] ?? '',
  } as unknown as ConfigService;
  return new PlatformService(prisma as PrismaService, jwt, config);
}

describe('PlatformService', () => {
  const findUnique = vi.fn();
  const create = vi.fn();
  const orgFindUnique = vi.fn();
  const orgUpdate = vi.fn();

  let prisma: Partial<PrismaService>;

  beforeEach(() => {
    findUnique.mockReset();
    create.mockReset();
    orgFindUnique.mockReset();
    orgUpdate.mockReset();
    prisma = {
      platformAdmin: { findUnique, create },
      organization: { findUnique: orgFindUnique, update: orgUpdate },
    } as unknown as Partial<PrismaService>;
  });

  it('rejects an unknown platform admin with the same error as a bad password', async () => {
    findUnique.mockResolvedValue(null);
    const service = serviceWith(prisma);
    await expect(
      service.login({ email: 'missing@sift.test', password: 'whatever1' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('signs in a platform admin and omits the password hash', async () => {
    const passwordHash = await bcrypt.hash('correct-horse', 10);
    findUnique.mockResolvedValue({
      id: 'admin_1',
      email: 'ops@sift.test',
      passwordHash,
      createdAt: new Date('2026-10-01T00:00:00.000Z'),
    });
    const service = serviceWith(prisma);
    const result = await service.login({
      email: '  OPS@sift.test ',
      password: 'correct-horse',
    });
    expect(findUnique).toHaveBeenCalledWith({ where: { email: 'ops@sift.test' } });
    expect(result.token).toBe('signed-token');
    expect(result.admin).toEqual({
      id: 'admin_1',
      email: 'ops@sift.test',
      createdAt: new Date('2026-10-01T00:00:00.000Z'),
    });
    expect(result.admin).not.toHaveProperty('passwordHash');
  });

  it('does not create an admin when the seed env is empty', async () => {
    const service = serviceWith(prisma);
    await service.ensureSeeded();
    expect(create).not.toHaveBeenCalled();
  });

  it('creates the seeded admin only when the email is new', async () => {
    findUnique.mockResolvedValueOnce(null);
    create.mockResolvedValue({});
    const service = serviceWith(prisma, {
      platformAdminEmail: 'Ops@Sift.test',
      platformAdminPassword: 'long-enough',
    });
    await service.ensureSeeded();
    expect(create).toHaveBeenCalledOnce();
    const data = create.mock.calls[0][0].data;
    expect(data.email).toBe('ops@sift.test');
    expect(await bcrypt.compare('long-enough', data.passwordHash)).toBe(true);

    findUnique.mockResolvedValueOnce({ id: 'existing' });
    await service.ensureSeeded();
    expect(create).toHaveBeenCalledOnce();
  });

  it('suspends a workspace and reports it as suspended', async () => {
    orgFindUnique
      .mockResolvedValueOnce({ id: 'org_1' })
      .mockResolvedValueOnce({
        id: 'org_1',
        name: 'Northwind',
        gmailUser: 'inbox@northwind.io',
        gmailAppPassword: 'secret',
        plan: 'GROWTH',
        suspendedAt: new Date('2026-10-06T00:00:00.000Z'),
        createdAt: new Date('2026-09-01T00:00:00.000Z'),
        users: [{ email: 'ada@northwind.io' }],
        _count: { users: 2, leads: 4 },
      });
    orgUpdate.mockResolvedValue({});
    const service = serviceWith(prisma);

    const workspace = await service.setWorkspaceSuspended('org_1', true);

    expect(orgUpdate).toHaveBeenCalledWith({
      where: { id: 'org_1' },
      data: { suspendedAt: expect.any(Date) },
    });
    expect(workspace).toMatchObject({
      id: 'org_1',
      name: 'Northwind',
      ownerEmail: 'ada@northwind.io',
      userCount: 2,
      leadCount: 4,
      gmailConnected: true,
      plan: 'GROWTH',
      suspended: true,
    });
  });

  it('clears suspension without exposing the mailbox password', async () => {
    orgFindUnique
      .mockResolvedValueOnce({ id: 'org_1' })
      .mockResolvedValueOnce({
        id: 'org_1',
        name: 'Northwind',
        gmailUser: null,
        gmailAppPassword: null,
        plan: 'TRIAL',
        suspendedAt: null,
        createdAt: new Date('2026-09-01T00:00:00.000Z'),
        users: [],
        _count: { users: 1, leads: 0 },
      });
    orgUpdate.mockResolvedValue({});
    const service = serviceWith(prisma);

    const workspace = await service.setWorkspaceSuspended('org_1', false);

    expect(orgUpdate).toHaveBeenCalledWith({
      where: { id: 'org_1' },
      data: { suspendedAt: null },
    });
    expect(workspace.suspended).toBe(false);
    expect(workspace.gmailConnected).toBe(false);
    expect(workspace.ownerEmail).toBeNull();
    expect(workspace).not.toHaveProperty('gmailAppPassword');
  });

  it('refuses to suspend a workspace that does not exist', async () => {
    orgFindUnique.mockResolvedValue(null);
    const service = serviceWith(prisma);
    await expect(service.setWorkspaceSuspended('missing', true)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(orgUpdate).not.toHaveBeenCalled();
  });
});
