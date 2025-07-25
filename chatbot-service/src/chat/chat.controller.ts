import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Headers,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';
import { DialogflowService } from '../dialogflow/dialogflow.service';
import { AiService } from '../ai/ai.service';
import { TicketService } from '../ticket/ticket.service';
import { PrismaService } from '../prisma/prisma.service';
import { sessionManager } from './session.manager';
import { v4 as uuidv4 } from 'uuid';
import {
  SendMessageDto,
  ChatResponseDto,
  ChatErrorResponseDto,
} from '../dto/chat.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly dialogflowService: DialogflowService,
    private readonly aiService: AiService,
    private readonly ticketService: TicketService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiOperation({
    summary: 'Enviar mensaje al chatbot (Legacy)',
    description: 'Endpoint legacy para compatibilidad. Recomendado usar POST /chat/message',
  })
  @ApiQuery({ name: 'q', description: 'Mensaje del usuario', example: '¿Cuáles son sus horarios?' })
  @ApiQuery({ name: 'session', description: 'ID de sesión (opcional)', required: false })
  @ApiResponse({ status: 200, description: 'Respuesta exitosa del chatbot' })
  @Get()
  async chat(@Query('q') query: string, @Query('session') sessionId?: string) {
    return this.handleMessage(query, sessionId);
  }

  @ApiOperation({
    summary: 'Enviar mensaje al chatbot',
    description: 'Endpoint principal para interactuar con el chatbot. Incluye fallback automático y escalamiento.',
  })
  @ApiBody({ type: SendMessageDto, description: 'Datos del mensaje' })
  @ApiHeader({ name: 'x-user-id', description: 'ID del usuario (opcional)', required: false })
  @ApiResponse({ status: 201, description: 'Mensaje procesado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @Post('message')
  async sendMessage(
    @Body() body: SendMessageDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.handleMessage(body.message, body.sessionId, userId);
  }

  private async handleMessage(query: string, sessionId?: string, userId?: string) {
    if (!query) {
      return { error: 'Debe enviar un parámetro ?q= con el texto de la consulta.' };
    }

    sessionId = sessionId || uuidv4();
    const session = sessionManager.get(sessionId);

    // Si estamos esperando DUI y correo
    if (session.waitingForContact) {
      const parsed = this.parseContactInfo(query);
      if (!parsed) {
        return {
          message: 'Por favor, envíe su DUI y correo electrónico en el formato: 01234567-8 correo@ejemplo.com',
        };
      }

      const { dui, correo } = parsed;
      const ticket = await this.ticketService.createTicket('Solicitud escalada desde el chat', dui);

      if ('error' in ticket) {
        return { error: ticket.error };
      }

      // Registrar interacción escalada
      await this.prisma.interaccion.create({
        data: {
          clienteId: ticket.clienteId,
          sessionId,
          origen: 'IA',
          escalado: true,
        },
      });

      sessionManager.clear(sessionId);
      return {
        message: `✅ Se ha generado el ticket #${ticket.id}. Recibirá actualizaciones en ${correo}.`,
      };
    }

    // Verificar frases que indiquen que necesita escalar
    const needsEscalation = ['no entiendo', 'sigo sin entender', 'no me ayudó'].some((p) =>
      query.toLowerCase().includes(p),
    );

    if (needsEscalation) {
      sessionManager.set(sessionId, { waitingForContact: true });
      return {
        message: '¿Desea escalar su problema a soporte? Por favor, envíe su DUI y correo electrónico.',
      };
    }

    // Intentar con Dialogflow
    const result = await this.dialogflowService.detectIntent(query, sessionId);

    if (result.intent === 'Default') {
      // Si no hay intención clara, usar IA
      const aiResponse = await this.aiService.getResponse(query);

      await this.prisma.interaccion.create({
        data: {
          sessionId,
          origen: 'IA',
        },
      });

      return { message: aiResponse };
    }

    // Respuesta válida de Dialogflow
    await this.prisma.interaccion.create({
      data: {
        sessionId,
        origen: 'DIALOGFLOW',
      },
    });

    return { message: result.response };
  }

  private parseContactInfo(text: string): { dui: string; correo: string } | null {
    const match = text.match(/(\d{8}-\d)\s+([^\s]+@[^\s]+\.[^\s]+)/);
    if (!match) return null;
    return {
      dui: match[1],
      correo: match[2],
    };
  }
}
