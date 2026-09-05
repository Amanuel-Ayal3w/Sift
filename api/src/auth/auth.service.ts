import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import type { LoginInput } from './dto/login.input.js';
import type { SignupInput } from './dto/signup.input.js';
import type { JwtPayload } from './types/jwt-payload.type.js';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /** Signing up creates the workspace and its owner together. */
  async signup(input: SignupInput): Promise<{ user: User; token: string }> {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) {
      throw new ConflictException('An account with that email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        role: 'OWNER',
        org: { create: { name: input.companyName } },
      },
    });

    return { user, token: this.signToken(user) };
  }

  async login(input: LoginInput): Promise<{ user: User; token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    // Same error for unknown email and bad password so the endpoint can't be
    // used to enumerate accounts.
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return { user, token: this.signToken(user) };
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Account no longer exists');
    }
    return user;
  }

  private signToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      orgId: user.orgId,
      role: user.role,
    };
    return this.jwt.sign(payload);
  }
}
