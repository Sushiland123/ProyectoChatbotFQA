import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Headers,
} from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // Crear ticket - llamado desde API Gateway
  @Post()
  async createTicket(
    @Body() body: { asunto: string; dui: string },
    @Headers('x-user-id') userId?: string,
  ) {
    const { asunto, dui } = body;
    return await this.ticketService.createTicket(asunto, dui);
  }

  // Obtener todos los tickets - llamado desde API Gateway
  @Get()
  async getTickets(@Headers('x-user-role') userRole?: string) {
    if (userRole !== 'ADMIN') {
      return { error: 'Solo los administradores pueden ver los tickets.' };
    }
    return await this.ticketService.getTickets();
  }

  // Cambiar estado del ticket - llamado desde API Gateway
  @Patch(':id/estado')
  async updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { estado: 'EN_PROCESO' | 'LISTO'; mensajeFinal?: string },
    @Headers('x-user-role') userRole?: string,
  ) {
    if (userRole !== 'ADMIN') {
      return { error: 'No autorizado para cambiar el estado del ticket.' };
    }

    const { estado, mensajeFinal } = body;
    return await this.ticketService.updateEstado(id, estado, mensajeFinal);
  }
}
