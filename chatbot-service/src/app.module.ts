import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DialogflowModule } from './dialogflow/dialogflow.module';
import { AiModule } from './ai/ai.module';
import { ChatController } from './chat/chat.controller';
import { AppController } from './app.controller'; // ✅ Incluido
import { AppService } from './app.service';       // ✅ Incluido
import { TicketService } from './ticket/ticket.service';
import { TicketModule } from './ticket/ticket.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { AnalyticsController } from './analytics/analytics.controller';
import { HealthService } from './health/health.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DialogflowModule,
    AiModule,
    TicketModule,
    MailModule,
    PrismaModule,
    WhatsappModule,

  ],
  controllers: [AppController, ChatController, AnalyticsController], // ✅ Ambos controllers
  providers: [AppService, TicketService, MailService, PrismaService, WhatsappService, HealthService],                      // ✅ AppService
})
export class AppModule {}
