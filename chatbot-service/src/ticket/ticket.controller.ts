import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { User } from '../auth/user/user.decorator';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // Crear ticket - cualquier cliente puede hacerlo
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTicket(@Body() body: { asunto: string; dui: string }) {
    const { asunto, dui } = body;
    return await this.ticketService.createTicket(asunto, dui);
  }

  // Obtener todos los tickets - solo admin
  @UseGuards(JwtAuthGuard)
  @Get()
  async getTickets(@User('rol') rol: string) {
    if (rol !== 'ADMIN') {
      return { error: 'Solo los administradores pueden ver los tickets.' };
    }
    return await this.ticketService.getTickets();
  }

  // Cambiar estado del ticket - solo admin
  @UseGuards(JwtAuthGuard)
  @Patch(':id/estado')
  async updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { estado: 'EN_PROCESO' | 'LISTO'; mensajeFinal?: string },
    @User('rol') rol: string,
  ) {
    if (rol !== 'ADMIN') {
      return { error: 'No autorizado para cambiar el estado del ticket.' };
    }

    const { estado, mensajeFinal } = body;
    return await this.ticketService.updateEstado(id, estado, mensajeFinal);
  }
}
