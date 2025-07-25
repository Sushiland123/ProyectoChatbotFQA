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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ChatbotClientService } from './chatbot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotClientService) {}

  @ApiOperation({
    summary: 'Enviar mensaje al chatbot',
    description: 'Endpoint público para enviar mensajes al chatbot. Incluye fallback automático Dialogflow → IA.',
  })
  @ApiBody({
    description: 'Mensaje del usuario',
    examples: {
      simple: {
        summary: 'Consulta simple',
        value: {
          message: '¿Cuáles son sus horarios?',
          sessionId: 'user-session-123',
        },
      },
      complex: {
        summary: 'Consulta compleja',
        value: {
          message: 'Explícame sobre inteligencia artificial',
          sessionId: 'user-session-123',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Respuesta del chatbot obtenida exitosamente' })
  @ApiResponse({ status: 400, description: 'Mensaje inválido' })
  @Post('message')
  async sendMessage(@Body() body: any) {
    // Endpoint público para el chatbot (sin autenticación)
    return this.chatbotService.sendMessage(body);
  }

  @ApiOperation({
    summary: 'Obtener analytics del chatbot',
    description: 'Obtener métricas y estadísticas de las interacciones del chatbot.',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Analytics obtenidos exitosamente' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  @UseGuards(JwtAuthGuard)
  @Get('analytics')
  async getAnalytics(@Request() req: any) {
    return this.chatbotService.getAnalytics(req.user.id.toString());
  }

  @ApiOperation({
    summary: 'Crear ticket de soporte',
    description: 'Crear un nuevo ticket de soporte desde el chatbot.',
  })
  @ApiBearerAuth('access-token')
  @ApiBody({
    description: 'Datos del ticket',
    examples: {
      problema_cuenta: {
        summary: 'Problema con cuenta',
        value: {
          asunto: 'Problema con mi cuenta',
          dui: '01234567-8',
        },
      },
      consulta_tecnica: {
        summary: 'Consulta técnica',
        value: {
          asunto: 'Error en la aplicación',
          dui: '98765432-1',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Ticket creado exitosamente' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  @UseGuards(JwtAuthGuard)
  @Post('ticket')
  async createTicket(@Body() body: any, @Request() req: any) {
    return this.chatbotService.createTicket(body, req.user.id.toString());
  }

  @ApiOperation({
    summary: 'Obtener tickets de soporte',
    description: 'Obtener lista de tickets (solo administradores).',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Lista de tickets obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes (solo ADMIN)' })
  @UseGuards(JwtAuthGuard)
  @Get('tickets')
  async getTickets(@Request() req: any) {
    return this.chatbotService.getTickets(req.user.rol);
  }

  @ApiOperation({
    summary: 'Actualizar estado de ticket',
    description: 'Actualizar el estado de un ticket de soporte (solo administradores).',
  })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: 'ID del ticket', example: 1 })
  @ApiBody({
    description: 'Nuevo estado del ticket',
    examples: {
      resuelto: {
        summary: 'Marcar como resuelto',
        value: { estado: 'RESUELTO' },
      },
      en_proceso: {
        summary: 'Marcar como en proceso',
        value: { estado: 'EN_PROCESO' },
      },
      cerrado: {
        summary: 'Cerrar ticket',
        value: { estado: 'CERRADO' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Estado del ticket actualizado exitosamente' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes (solo ADMIN)' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
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
