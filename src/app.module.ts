import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';
import { CreateAccountController } from './controllers/create-account.controller.js';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/index.js';
import { AuthModule } from './auth/auth.module.js';
import { AuthenticateController } from './controllers/authenticate.controller.js';
import { CreatQuestionController } from './controllers/create-question.controller.js';

@Module({
    imports: [
      ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true
    }),
    AuthModule
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreatQuestionController
  ],
  providers: [PrismaService],
})
export class AppModule {}
