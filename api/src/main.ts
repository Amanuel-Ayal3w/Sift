import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(cookieParser());
  // Cookie auth means the dashboard origin must be named explicitly; a
  // wildcard origin cannot be combined with credentials.
  app.enableCors({
    origin: config.getOrThrow<string>('webAppUrl'),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  await app.listen(config.getOrThrow<number>('port'));
}
await bootstrap();
