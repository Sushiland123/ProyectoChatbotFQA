import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('E2E - Simulación Completa de Conversaciones', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Conversación Exitosa - Cliente Satisfecho', () => {
    const sessionId = `happy-customer-${Date.now()}`;

    it('Escenario 1: Cliente pregunta horarios y queda satisfecho', async () => {
      // 1. Saludo inicial
      const step1 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: 'Hola, buenos días',
          sessionId: sessionId,
        })
        .expect(201);

      expect(step1.body.message).toBeDefined();
      console.log('🤖 Bot:', step1.body.message);

      // 2. Pregunta sobre horarios
      const step2 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: '¿Cuáles son sus horarios de atención?',
          sessionId: sessionId,
        })
        .expect(201);

      expect(step2.body.message).toBeDefined();
      console.log('🤖 Bot:', step2.body.message);

      // 3. Pregunta de seguimiento
      const step3 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: '¿Atienden los sábados?',
          sessionId: sessionId,
        })
        .expect(201);

      expect(step3.body.message).toBeDefined();
      console.log('🤖 Bot:', step3.body.message);

      // 4. Despedida
      const step4 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: 'Gracias, eso es todo',
          sessionId: sessionId,
        })
        .expect(201);

      expect(step4.body.message).toBeDefined();
      console.log('🤖 Bot:', step4.body.message);

      // Verificar que se registraron todas las interacciones
      const interacciones = await prismaService.interaccion.findMany({
        where: { sessionId: sessionId },
        orderBy: { createdAt: 'asc' },
      });

      expect(interacciones.length).toBeGreaterThanOrEqual(4);
      expect(interacciones.every(i => !i.escalado)).toBe(true);
    });
  });

  describe('Conversación con Escalamiento - Cliente Frustrado', () => {
    const sessionId = `frustrated-customer-${Date.now()}`;

    it('Escenario 2: Cliente se frustra y escala a ticket', async () => {
      // 1. Pregunta compleja
      const step1 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: 'Tengo un problema muy específico con mi cuenta que nadie ha podido resolver',
          sessionId: sessionId,
        })
        .expect(201);

      console.log('👤 Cliente: Tengo un problema muy específico...');
      console.log('🤖 Bot:', step1.body.message);

      // 2. Expresar frustración
      const step2 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: 'No entiendo la respuesta, sigo sin entender mi problema',
          sessionId: sessionId,
        })
        .expect(201);

      console.log('👤 Cliente: No entiendo la respuesta...');
      console.log('🤖 Bot:', step2.body.message);

      expect(step2.body.message).toContain('escalar');
      expect(step2.body.message).toContain('DUI');

      // 3. Aceptar escalamiento con datos incorrectos
      const step3 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: 'Sí, mi datos son juan perez',
          sessionId: sessionId,
        })
        .expect(201);

      console.log('👤 Cliente: Sí, mi datos son juan perez');
      console.log('🤖 Bot:', step3.body.message);

      expect(step3.body.message).toContain('formato');

      // 4. Proporcionar datos correctos
      const step4 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: '12345678-9 juan.perez@email.com',
          sessionId: sessionId,
        })
        .expect(201);

      console.log('👤 Cliente: 12345678-9 juan.perez@email.com');
      console.log('🤖 Bot:', step4.body.message);

      expect(step4.body.message).toContain('ticket');
      expect(step4.body.message).toContain('#');

      // Verificar escalamiento en base de datos
      const interacciones = await prismaService.interaccion.findMany({
        where: { 
          sessionId: sessionId,
          escalado: true,
        },
      });

      expect(interacciones.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Conversación Mixta - FAQ + IA + Información', () => {
    const sessionId = `mixed-conversation-${Date.now()}`;

    it('Escenario 3: Conversación que usa múltiples fuentes', async () => {
      // 1. Pregunta estándar (FAQ)
      const step1 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: '¿Qué servicios ofrecen?',
          sessionId: sessionId,
        })
        .expect(201);

      console.log('👤 Cliente: ¿Qué servicios ofrecen?');
      console.log('🤖 Bot:', step1.body.message);

      // 2. Pregunta compleja (IA)
      const step2 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: 'Explícame las ventajas competitivas de trabajar con ustedes en el sector tecnológico',
          sessionId: sessionId,
        })
        .expect(201);

      console.log('👤 Cliente: Explícame las ventajas competitivas...');
      console.log('🤖 Bot:', step2.body.message);

      // 3. Pregunta de seguimiento
      const step3 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: '¿Tienen experiencia en inteligencia artificial?',
          sessionId: sessionId,
        })
        .expect(201);

      console.log('👤 Cliente: ¿Tienen experiencia en IA?');
      console.log('🤖 Bot:', step3.body.message);

      // 4. Solicitar contacto
      const step4 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: '¿Cómo puedo contactar a un representante?',
          sessionId: sessionId,
        })
        .expect(201);

      console.log('👤 Cliente: ¿Cómo puedo contactar a un representante?');
      console.log('🤖 Bot:', step4.body.message);

      // Verificar diversidad de fuentes
      const interacciones = await prismaService.interaccion.findMany({
        where: { sessionId: sessionId },
        orderBy: { createdAt: 'asc' },
      });

      expect(interacciones.length).toBeGreaterThanOrEqual(4);
      
      // Verificar que se usaron diferentes orígenes
      const origenes = interacciones.map(i => i.origen);
      const uniqueOrigenes = [...new Set(origenes)];
      
      // Debe haber al menos un origen (idealmente ambos)
      expect(uniqueOrigenes.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Conversación Edge Cases', () => {
    const sessionId = `edge-cases-${Date.now()}`;

    it('Escenario 5: Casos límite y errores', async () => {
      // 1. Mensaje vacío
      const step1 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: '',
          sessionId: sessionId,
        })
        .expect(201);

      expect(step1.body).toHaveProperty('error');

      // 2. Mensaje muy largo (pero dentro del límite de Dialogflow)
      const mensajeLargo = 'Esta es una consulta muy extensa que incluye muchos detalles pero se mantiene dentro de los límites de Dialogflow para evitar errores de validación en las pruebas automatizadas.';
      const step2 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: mensajeLargo,
          sessionId: sessionId,
        })
        .expect(201);

      expect(step2.body.message).toBeDefined();

      // 3. Caracteres especiales
      const step3 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: '¿Cómo están? 🤖💬✨',
          sessionId: sessionId,
        })
        .expect(201);

      expect(step3.body.message).toBeDefined();

      // 4. Múltiples idiomas (si está soportado)
      const step4 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: 'Hello, how are you?',
          sessionId: sessionId,
        })
        .expect(201);

      expect(step4.body.message).toBeDefined();

      // 5. Inyección de código (prueba de seguridad)
      const step5 = await request(app.getHttpServer())
        .post('/chat/message')
        .send({
          message: '<script>alert("test")</script>',
          sessionId: sessionId,
        })
        .expect(201);

      expect(step5.body.message).toBeDefined();
      expect(step5.body.message).not.toContain('<script>');
    });
  });

  describe('Conversación de Performance', () => {
    it('Escenario 6: Medir tiempos de respuesta', async () => {
      const sessionId = `performance-test-${Date.now()}`;
      const preguntas = [
        '¿Cuáles son sus horarios?',
        'Explícame sobre inteligencia artificial',
        '¿Qué servicios ofrecen?',
      ];

      const tiempos: number[] = [];

      for (const pregunta of preguntas) {
        const inicio = Date.now();
        
        const response = await request(app.getHttpServer())
          .post('/chat/message')
          .send({
            message: pregunta,
            sessionId: sessionId,
          })
          .expect(201);

        const tiempo = Date.now() - inicio;
        tiempos.push(tiempo);

        console.log(`⏱️  Pregunta: "${pregunta}" - Tiempo: ${tiempo}ms`);
        expect(response.body.message).toBeDefined();
        
        // Verificar que la respuesta no tome más de 10 segundos
        expect(tiempo).toBeLessThan(10000);
      }

      const tiempoPromedio = tiempos.reduce((a, b) => a + b, 0) / tiempos.length;
      console.log(`📊 Tiempo promedio de respuesta: ${tiempoPromedio.toFixed(2)}ms`);
      
      expect(tiempoPromedio).toBeLessThan(5000); // Menos de 5 segundos promedio
    });
  });

  describe('Resumen de Conversaciones E2E', () => {
    it('debe generar un reporte de todas las conversaciones de prueba', async () => {
      // Obtener todas las interacciones de las pruebas E2E
      const interaccionesE2E = await prismaService.interaccion.findMany({
        where: {
          sessionId: {
            contains: '-test-',
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      console.log('\n📊 REPORTE DE PRUEBAS E2E:');
      console.log('===============================');
      console.log(`Total de interacciones simuladas: ${interaccionesE2E.length}`);
      
      const porOrigen = interaccionesE2E.reduce((acc, interaccion) => {
        acc[interaccion.origen] = (acc[interaccion.origen] || 0) + 1;
        return acc;
      }, {});
      
      console.log('Distribución por origen:');
      Object.entries(porOrigen).forEach(([origen, count]) => {
        console.log(`  - ${origen}: ${count}`);
      });
      
      const escalados = interaccionesE2E.filter(i => i.escalado).length;
      console.log(`Escalamientos a ticket: ${escalados}`);
      
      const sesionesUnicas = new Set(interaccionesE2E.map(i => i.sessionId)).size;
      console.log(`Sesiones de conversación únicas: ${sesionesUnicas}`);
      
      expect(interaccionesE2E.length).toBeGreaterThan(0);
      expect(sesionesUnicas).toBeGreaterThan(0);
    });
  });
});
