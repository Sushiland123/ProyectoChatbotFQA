import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketClientService } from './ticket.service';

@Module({
  controllers: [TicketController],
  providers: [TicketClientService],
  exports: [TicketClientService],
})
export class TicketModule {}
