import { Module, OnModuleInit } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PlatformAuthGuard } from './guards/platform-auth.guard.js';
import { PlatformResolver } from './platform.resolver.js';
import { PlatformService } from './platform.service.js';

@Module({
  imports: [AuthModule],
  providers: [PlatformService, PlatformResolver, PlatformAuthGuard],
})
export class PlatformModule implements OnModuleInit {
  constructor(private readonly platform: PlatformService) {}

  onModuleInit(): Promise<void> {
    return this.platform.ensureSeeded();
  }
}
