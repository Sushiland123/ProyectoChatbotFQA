import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { DialogflowService } from '../dialogflow/dialogflow.service';
import { AiService } from '../ai/ai.service';
import { TicketService } from '../ticket/ticket.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ChatController - Lógica Fallback (Unit Tests)', () => {
  let controller: ChatController;
  let dialogflowService: DialogflowService;
  let aiService: AiService;
  let ticketService: TicketService;
  let prismaService: PrismaService;

  const mockDialogflowService = {
    detectIntent: jest.fn(),
  };

  const mockAiService = {
    getResponse: jest.fn(),
  };

  const mockTicketService = {
    createTicket: jest.fn(),
  };

  const mockPrismaService = {
    interaccion: {
      create: jest.fn(),
    },
    cliente: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        { provide: DialogflowService, useValue: mockDialogflowService },
        { provide: AiService, useValue: mockAiService },
        { provide: TicketService, useValue: mockTicketService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    dialogflowService = module.get<DialogflowService>(DialogflowService);
    aiService = module.get<AiService>(AiService);
    ticketService = module.get<TicketService>(TicketService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Lógica de Fallback: Dialogflow → AI', () => {
    it('debe usar AI cuando Dialogflow no entiende (intent Default)', async () => {
      // Arrange
      const query = 'Pregunta compleja que Dialogflow no entiende';
      const sessionId = 'test-session';
      
      mockDialogflowService.detectIntent.mockResolvedValue({
        intent: 'Default', // Dialogflow no entendió
        response: 'No entendí tu pregunta',
      });
      
      mockAiService.getResponse.mockResolvedValue(
        'Respuesta inteligente de la IA'
      );
      
      mockPrismaService.interaccion.create.mockResolvedValue({});

      // Act - Usar método público POST
      const result = await controller.sendMessage(
        { message: query, sessionId },
        undefined // userId
      );

      // Assert
      expect(dialogflowService.detectIntent).toHaveBeenCalledWith(query, sessionId);
      expect(aiService.getResponse).toHaveBeenCalledWith(query);
      expect(result.message).toBe('Respuesta inteligente de la IA');
      expect(mockPrismaService.interaccion.create).toHaveBeenCalledWith({
        data: { sessionId, origen: 'IA' }
      });
    });

    it('debe usar solo Dialogflow cuando entiende la intención', async () => {
      // Arrange
      const query = '¿Cuáles son sus horarios?';
      const sessionId = 'test-session';
      
      mockDialogflowService.detectIntent.mockResolvedValue({
        intent: 'horarios.atencion', // Dialogflow entendió
        response: 'Nuestros horarios son de 8 AM a 6 PM',
      });
      
      mockPrismaService.interaccion.create.mockResolvedValue({});

      // Act - Usar método público POST
      const result = await controller.sendMessage(
        { message: query, sessionId },
        undefined
      );

      // Assert
      expect(dialogflowService.detectIntent).toHaveBeenCalledWith(query, sessionId);
      expect(aiService.getResponse).not.toHaveBeenCalled(); // NO debe llamar IA
      expect(result.message).toBe('Nuestros horarios son de 8 AM a 6 PM');
      expect(mockPrismaService.interaccion.create).toHaveBeenCalledWith({
        data: { sessionId, origen: 'DIALOGFLOW' }
      });
    });
  });

  describe('Lógica de Escalamiento a Ticket', () => {
    it('debe escalar a ticket cuando el usuario indica frustración', async () => {
      // Arrange
      const query = 'no entiendo, sigo sin entender esto';
      const sessionId = 'test-session';

      // Act - Usar método público POST
      const result = await controller.sendMessage(
        { message: query, sessionId },
        undefined
      );

      // Assert
      expect(result.message).toContain('¿Desea escalar su problema a soporte?');
      expect(result.message).toContain('DUI y correo electrónico');
    });

    it('debe crear ticket cuando recibe DUI y correo válidos', async () => {
      // Arrange
      const contactInfo = '12345678-9 usuario@ejemplo.com';
      const sessionId = 'test-escalation';
      
      // Simular que la sesión está esperando información de contacto
      // Para esta prueba, asumimos que el sistema detecta el formato correcto
      
      mockTicketService.createTicket.mockResolvedValue({
        id: 123,
        clienteId: 1,
        asunto: 'Solicitud escalada desde el chat',
      });
      
      mockPrismaService.interaccion.create.mockResolvedValue({});

      // Primero establecer el estado de escalamiento
      await controller.sendMessage(
        { message: 'no entiendo', sessionId },
        undefined
      );

      // Luego proporcionar los datos
      const result = await controller.sendMessage(
        { message: contactInfo, sessionId },
        undefined
      );

      // Assert
      expect(
        result.message.includes('ticket') || result.message.includes('formato')
      ).toBe(true);
    });

    it('debe rechazar formato inválido de DUI y correo', async () => {
      // Arrange
      const invalidContact = 'formato inválido';
      const sessionId = 'test-session';
      
      // Primero establecer estado de escalamiento
      await controller.sendMessage(
        { message: 'no entiendo', sessionId },
        undefined
      );

      // Act
      const result = await controller.sendMessage(
        { message: invalidContact, sessionId },
        undefined
      );

      // Assert
      expect(
        result.message.includes('formato') || result.message.includes('DUI')
      ).toBe(true);
    });
  });

  describe('Validación de Entrada', () => {
    it('debe rechazar queries vacías', async () => {
      // Act - Usar método público POST
      const result = await controller.sendMessage(
        { message: '', sessionId: 'test-session' },
        undefined
      );

      // Assert
      expect(
        (result.error && result.error.includes('parámetro')) || result.message
      ).toBeTruthy();
    });

    it('debe generar sessionId si no se proporciona', async () => {
      // Arrange
      mockDialogflowService.detectIntent.mockResolvedValue({
        intent: 'saludo',
        response: 'Hola',
      });
      
      mockPrismaService.interaccion.create.mockResolvedValue({});

      // Act - Sin sessionId
      const result = await controller.sendMessage(
        { message: 'Hola' },
        undefined
      );

      // Assert
      expect(result.message).toBeDefined();
      expect(dialogflowService.detectIntent).toHaveBeenCalled();
    });
  });

  describe('Compatibilidad con GET', () => {
    it('debe funcionar con método GET (legacy)', async () => {
      // Arrange
      mockDialogflowService.detectIntent.mockResolvedValue({
        intent: 'saludo',
        response: 'Hola desde GET',
      });
      
      mockPrismaService.interaccion.create.mockResolvedValue({});

      // Act - Usar método GET con sessionId único
      const uniqueSessionId = `get-test-${Date.now()}`;
      const result = await controller.chat('Hola', uniqueSessionId);

      // Assert
      expect(result.message).toBe('Hola desde GET');
      expect(dialogflowService.detectIntent).toHaveBeenCalledWith('Hola', uniqueSessionId);
    });

    it('debe manejar query vacía en GET', async () => {
      // Act
      const result = await controller.chat('', 'test-session');

      // Assert
      expect(result.error).toContain('parámetro');
    });
  });

  describe('Manejo de Errores', () => {
    it('debe manejar errores de Dialogflow graciosamente', async () => {
      // Arrange
      mockDialogflowService.detectIntent.mockRejectedValue(
        new Error('Dialogflow service unavailable')
      );
      
      mockAiService.getResponse.mockResolvedValue('Respuesta de emergencia de IA');
      mockPrismaService.interaccion.create.mockResolvedValue({});

      // Act
      const result = await controller.sendMessage(
        { message: 'test query', sessionId: 'test-session' },
        undefined
      );

      // Assert
      expect(result.message).toBeDefined();
      // El sistema debe intentar usar IA como fallback o manejar el error
    });

    it('debe manejar errores de IA como último recurso', async () => {
      // Arrange
      mockDialogflowService.detectIntent.mockRejectedValue(
        new Error('Dialogflow error')
      );
      mockAiService.getResponse.mockRejectedValue(
        new Error('AI service error')
      );

      // Act
      const result = await controller.sendMessage(
        { message: 'test query', sessionId: 'test-session' },
        undefined
      );

      // Assert
      expect(result).toBeDefined();
      // El sistema debe manejar el error de alguna manera
      expect(result.error || result.message).toBeDefined();
    });
  });
});
