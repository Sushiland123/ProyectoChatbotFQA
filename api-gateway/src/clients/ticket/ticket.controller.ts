import { 
  Controller, 
  Get, 
  Put, 
  Param, 
  Body, 
  Headers,
  UseGuards,
  Request
} from '@nestjs/common';
import { TicketClientService } from './ticket.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketClientService) {}

  @Get()
  async getAllTickets(
    @Headers('authorization') authHeader: string,
    @Request() req: any
  ) {
    return this.ticketService.getAllTickets(authHeader, req.user.rol);
  }

  @Get(':id')
  async getTicketById(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
    @Request() req: any
  ) {
    return this.ticketService.getTicketById(id, authHeader, req.user.rol);
  }

  @Put(':id/status')
  async updateTicketStatus(
    @Param('id') id: string,
    @Body() statusData: any,
    @Headers('authorization') authHeader: string,
    @Request() req: any
  ) {
    return this.ticketService.updateTicketStatus(id, statusData, authHeader, req.user.rol);
  }
}
