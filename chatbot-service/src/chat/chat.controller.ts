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
      
      // Crear un asunto más descriptivo con el contexto de la conversación
      let asunto = 'Solicitud escalada desde el chat';
      if (session.lastFailedResponse) {
        asunto = `Chat escalado: ${query.substring(0, 50)}...`;
      }
      
      const ticket = await this.ticketService.createTicket(asunto, dui);

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
        message: `✅ Se ha generado el ticket de soporte #${ticket.id}.\n🎧 Nuestro equipo de soporte le contactará pronto.\n📧 Recibirá actualizaciones en ${correo}.\n\n¡Gracias por su paciencia!`,
      };
    }

    // Verificar frases que indiquen que necesita escalar
    const needsEscalation = ['no entiendo', 'sigo sin entender', 'no me ayudó', 'no me sirve', 'quiero hablar con alguien'].some((p) =>
      query.toLowerCase().includes(p),
    );

    if (needsEscalation) {
      sessionManager.set(sessionId, { waitingForContact: true });
      return {
        message: '🎧 Entiendo que necesita ayuda adicional. ¿Desea escalar su problema a soporte humano? Por favor, envíe su DUI y correo electrónico en el formato: 01234567-8 correo@ejemplo.com',
      };
    }

    // Intentar con Dialogflow
    const result = await this.dialogflowService.detectIntent(query, sessionId);

    // Verificar si necesita fallback a IA
    const shouldUseAI = 
      result.intent === 'Default' || 
      result.intent === 'Default Fallback Intent' ||
      result.isFallback ||
      !result.intent ||
      result.intent === 'projects/conectaya-bot/agent/intents/default' ||
      !result.response ||
      result.response.trim() === '' ||
      result.response.includes('No entendí') ||
      result.response.includes('No comprendo') ||
      result.response.includes('default fallback');

    if (shouldUseAI) {
      console.log('🤖 Usando IA como fallback para:', query);
      // Si no hay intención clara o es fallback, usar IA
      const aiResult = await this.aiService.getResponse(query);

      // Verificar si la IA también falló
      if (aiResult.isFallback) {
        sessionManager.incrementFailedAttempts(sessionId, aiResult.response);
        const currentSession = sessionManager.get(sessionId);
        
        // Si ya hubo 2 o más intentos fallidos, ofrecer escalamiento
        if (currentSession.failedAttempts && currentSession.failedAttempts >= 2) {
          sessionManager.set(sessionId, { waitingForContact: true });
          return {
            message: '🤔 Parece que estoy teniendo dificultades para ayudarle con su consulta específica. ¿Le gustaría que escalemos esto a nuestro equipo de soporte? Por favor, proporcione su DUI y correo electrónico en el formato: 01234567-8 correo@ejemplo.com',
          };
        } else {
          return {
            message: `${aiResult.response}\n\n💡 Si esta respuesta no le ayuda, puedo conectarle con soporte humano. Simplemente escriba "no me ayudó" o "quiero hablar con alguien".`,
          };
        }
      }

      // Respuesta exitosa de la IA, resetear contadores
      if (session.failedAttempts) {
        sessionManager.set(sessionId, { failedAttempts: 0 });
      }

      await this.prisma.interaccion.create({
        data: {
          sessionId,
          origen: 'IA',
        },
      });

      return { message: aiResult.response };
    }

    console.log('✅ Respuesta de Dialogflow:', result.intent);
    // Respuesta válida de Dialogflow, resetear contadores
    const currentSession2 = sessionManager.get(sessionId);
    if (currentSession2.failedAttempts) {
      sessionManager.set(sessionId, { failedAttempts: 0 });
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
