import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

// Importar controladores y servicios
import { AuthController } from './clients/auth/auth.controller';
import { AuthClientService } from './clients/auth/auth.service';

import { FaqController } from './clients/faq/faq.controller';
import { FaqClientService } from './clients/faq/faq.service';

import { ChatbotController } from './clients/chatbot/chatbot.controller';
import { ChatbotClientService } from './clients/chatbot/chatbot.service';

import { JwtStrategy } from './clients/auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    PassportModule,
  ],
  controllers: [
    AuthController,
    FaqController,
    ChatbotController,
  ],
  providers: [
    AuthClientService,
    FaqClientService,
    ChatbotClientService,
    JwtStrategy,
  ],
})
export class AppModule {}
