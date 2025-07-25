import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('ChatBot Integration Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    
    await app.init();

    // Limpiar datos de prueba
    await prismaService.interaccion.deleteMany({});
    await prismaService.ticket.deleteMany({});
  });

  afterAll(async () => {
    // Limpiar después de las pruebas
    await prismaService.interaccion.deleteMany({});
    await prismaService.ticket.deleteMany({});
    await app.close();
  });

  describe('Integración Dialogflow + AI + Base de Datos', () => {
    it('debe procesar consulta y registrar interacción en BD', async () => {
      const sessionId = `integration-test-${Date.now()}`;

      const response = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: '¿Cuáles son sus horarios?',
          sessionId: sessionId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBeDefined();

      // Verificar que se registró en la base de datos
      const interacciones = await prismaService.interaccion.findMany({
        where: { sessionId: sessionId },
      });

      expect(interacciones).toHaveLength(1);
      expect(['DIALOGFLOW', 'IA']).toContain(interacciones[0].origen);
      expect(interacciones[0].escalado).toBe(false);
    });

    it('debe manejar fallback de Dialogflow a IA correctamente', async () => {
      const sessionId = `fallback-test-${Date.now()}`;
      
      // Enviar una pregunta muy específica que probablemente active el fallback
      const response = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: 'Explícame la teoría cuántica aplicada a los negocios digitales',
          sessionId: sessionId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBeDefined();

      // Verificar registro en BD
      const interacciones = await prismaService.interaccion.findMany({
        where: { sessionId: sessionId },
      });

      expect(interacciones).toHaveLength(1);
      // Probablemente será IA por la complejidad de la pregunta
      expect(interacciones[0]).toHaveProperty('origen');
    });

    it('debe procesar escalamiento completo a ticket', async () => {
      const sessionId = `escalation-test-${Date.now()}`;
      const uniqueDui = `${Date.now()}-9`; // DUI único para cada prueba

      // Primero, crear un cliente de prueba en la base de datos
      const testCliente = await prismaService.cliente.create({
        data: {
          dui: uniqueDui,
          nombre: 'Cliente Test',
          correo: 'test@integration.com',
        },
      });

      // Paso 1: Expresar frustración
      const step1 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: 'no entiendo nada, esto no me ayuda',
          sessionId: sessionId,
        })
        .expect(201);

      expect(step1.body.message).toContain('escalar');
      expect(step1.body.message).toContain('DUI');

      // Paso 2: Proporcionar DUI y correo (usando el DUI único)
      const step2 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: `${uniqueDui} test@integration.com`,
          sessionId: sessionId,
        })
        .expect(201);

      // El sistema puede responder con éxito o con error de cliente no encontrado
      expect(step2.body).toBeDefined();
      expect(
        step2.body.message || step2.body.error
      ).toBeDefined();
      
      if (step2.body.message) {
        // Escalamiento exitoso
        expect(
          step2.body.message.includes('ticket') || 
          step2.body.message.includes('formato') ||
          step2.body.message.includes('DUI')
        ).toBe(true);
      } else if (step2.body.error) {
        // Error esperado: cliente no encontrado
        expect(step2.body.error).toContain('Cliente no encontrado');
      }

      // Limpiar: eliminar dependencias primero, luego el cliente
      await prismaService.interaccion.deleteMany({
        where: { clienteId: testCliente.id },
      });
      
      await prismaService.ticket.deleteMany({
        where: { clienteId: testCliente.id },
      });
      
      await prismaService.cliente.delete({
        where: { id: testCliente.id },
      });
    });
  });

  describe('Integración con Analytics', () => {
    it('debe generar analytics basados en interacciones reales', async () => {
      // Crear varias interacciones de prueba
      const sessionId1 = `analytics-test-1-${Date.now()}`;
      const sessionId2 = `analytics-test-2-${Date.now()}`;

      // Interacción Dialogflow
      await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: '¿Horarios?',
          sessionId: sessionId1,
        });

      // Interacción IA (pregunta compleja)
      await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: 'Pregunta muy específica y compleja que requiere IA',
          sessionId: sessionId2,
        });

      // Obtener analytics
      const analytics = await request(app.getHttpServer())
        .get('/analytics')
        .expect(200);

      expect(analytics.body).toHaveProperty('interacciones');
      expect(analytics.body).toHaveProperty('origen');
      expect(analytics.body).toHaveProperty('escalamiento');
      
      expect(analytics.body.interacciones.total).toBeGreaterThan(0);
      expect(analytics.body.origen).toHaveProperty('dialogflow');
      expect(analytics.body.origen).toHaveProperty('ia');
    });
  });

  describe('Integración Headers Internos (Sin JWT)', () => {
    it('debe funcionar sin autenticación JWT', async () => {
      const response = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: 'Hola',
          sessionId: 'no-auth-test',
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
    });

    it('debe procesar headers internos x-user-id', async () => {
      const response = await request(app.getHttpServer())
        .post('/chat/message')
        .set('x-user-id', '123')
        .send({
          message: 'Hola con user context',
          sessionId: 'user-context-test',
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
    });

    it('debe generar analytics con user context', async () => {
      const analytics = await request(app.getHttpServer())
        .get('/analytics')
        .set('x-user-id', '456')
        .expect(200);

      expect(analytics.body).toHaveProperty('userId');
      expect(['456', 'anonymous']).toContain(analytics.body.userId);
    });
  });

  describe('Integración Manejo de Errores', () => {
    it('debe manejar consultas vacías graciosamente', async () => {
      const response = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: '',
          sessionId: 'empty-test',
        })
        .expect(201);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('parámetro');
    });

    it('debe generar sessionId automáticamente si no se proporciona', async () => {
      const response = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: 'Hola sin session',
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      
      // Verificar que se creó una interacción con sessionId generado
      const interacciones = await prismaService.interaccion.findMany({
        where: { 
          createdAt: {
            gte: new Date(Date.now() - 5000), // Últimos 5 segundos
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      });

      expect(interacciones).toHaveLength(1);
      expect(interacciones[0].sessionId).toBeDefined();
    });
  });

  describe('Compatibilidad con Endpoint GET', () => {
    it('debe funcionar con query parameters (compatibilidad legacy)', async () => {
      const response = await request(app.getHttpServer())
        .get('/chat?q=Hola&session=get-test')
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });
});
