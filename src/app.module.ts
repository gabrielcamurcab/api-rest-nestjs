import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';
import { CreateAccountController } from './controllers/create-account.controller.js';

@Module({
  controllers: [
    CreateAccountController
  ],
  providers: [PrismaService],
})
export class AppModule {}
