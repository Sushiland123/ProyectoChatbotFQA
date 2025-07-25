import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatbotClientService } from './chatbot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotClientService) {}

  @Post('message')
  async sendMessage(@Body() body: any) {
    // Endpoint público para el chatbot (sin autenticación)
    return this.chatbotService.sendMessage(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('analytics')
  async getAnalytics(@Request() req: any) {
    return this.chatbotService.getAnalytics(req.user.id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Post('ticket')
  async createTicket(@Body() body: any, @Request() req: any) {
    return this.chatbotService.createTicket(body, req.user.id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Get('tickets')
  async getTickets(@Request() req: any) {
    return this.chatbotService.getTickets(req.user.rol);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('tickets/:id/estado')
  async updateTicketStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @Request() req: any,
  ) {
    return this.chatbotService.updateTicketStatus(id, body, req.user.rol);
  }
}
