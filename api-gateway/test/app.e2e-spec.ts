import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API Gateway Integration Tests', () => {
  let app: INestApplication;
  let jwtToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Flow', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          nombre: 'Test User',
          email: 'test@example.com',
          password: '123456',
          rol: 'USUARIO',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@example.com');
    });

    it('should register an admin user', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          nombre: 'Admin User',
          email: 'admin@example.com', 
          password: 'admin123',
          rol: 'ADMIN',
        })
        .expect(201);
    });

    it('should login user and return JWT', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: '123456',
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      jwtToken = response.body.token;
    });

    it('should login admin and return JWT', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'admin123',
        })
        .expect(200);

      adminToken = response.body.token;
    });

    it('should get user profile with valid JWT', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body.email).toBe('test@example.com');
    });

    it('should reject invalid JWT', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);
    });

    it('should reject request without JWT', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });
  });

  describe('Chatbot Endpoints', () => {
    it('should handle public chatbot message', async () => {
      const response = await request(app.getHttpServer())
        .post('/chatbot/message')
        .send({
          message: 'Hola, ¿cómo estás?',
          sessionId: 'test-session',
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should handle chatbot query with GET', async () => {
      const response = await request(app.getHttpServer())
        .get('/chatbot/message?q=Hola&session=test')
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should get analytics with JWT', async () => {
      const response = await request(app.getHttpServer())
        .get('/chatbot/analytics')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('interacciones');
    });

    it('should reject analytics without JWT', async () => {
      await request(app.getHttpServer())
        .get('/chatbot/analytics')
        .expect(401);
    });
  });

  describe('FAQ Endpoints', () => {
    it('should get FAQs without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/faq')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should create FAQ with JWT', async () => {
      const response = await request(app.getHttpServer())
        .post('/faq')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          pregunta: '¿Cuál es el horario?',
          respuesta: '8 AM a 6 PM',
          grupoId: 1,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
    });

    it('should reject FAQ creation without JWT', async () => {
      await request(app.getHttpServer())
        .post('/faq')
        .send({
          pregunta: 'Test',
          respuesta: 'Test',
          grupoId: 1,
        })
        .expect(401);
    });
  });

  describe('Ticket Endpoints', () => {
    it('should create ticket with JWT', async () => {
      const response = await request(app.getHttpServer())
        .post('/chatbot/ticket')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          asunto: 'Test ticket',
          dui: '12345678-9',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
    });

    it('should get tickets as admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/chatbot/tickets')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should reject tickets for non-admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/chatbot/tickets')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Architecture Tests', () => {
    it('should validate JWT only in API Gateway', async () => {
      // Test directo a microservicio (debería fallar o no tener JWT)
      const directResponse = await request('http://localhost:3003')
        .get('/analytics')
        .expect(200);

      // No debería validar JWT, pero debería funcionar
      expect(directResponse.body).toHaveProperty('userId');
    });

    it('should pass user context via headers', async () => {
      const response = await request(app.getHttpServer())
        .get('/chatbot/analytics')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      // Verificar que el user ID se pasó correctamente
      expect(response.body.userId).toBeDefined();
      expect(response.body.userId).not.toBe('anonymous');
    });
  });
});
