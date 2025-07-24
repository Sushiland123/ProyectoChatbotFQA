import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { AuthModule } from '../auth/auth.module'; // 👈 Importa el módulo donde está el JwtAuthGuard y JwtService

@Module({
  imports: [
    PrismaModule,
    MailModule,
    AuthModule, // 👈 Habilita el uso de JwtAuthGuard
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
