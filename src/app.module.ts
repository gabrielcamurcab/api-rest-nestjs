import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';
import { CreateAccountController } from './controllers/create-account.controller.js';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/index.js';

@Module({
  imports: [ConfigModule.forRoot({
    validate: (env) => envSchema.parse(env),
    isGlobal: true
  })],
  controllers: [
    CreateAccountController
  ],
  providers: [PrismaService],
})
export class AppModule {}
