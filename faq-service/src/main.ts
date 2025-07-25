import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración global de validación
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configuración de CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('FAQ Service API')
    .setDescription(`
      ❓ **Servicio de Preguntas Frecuentes (FAQ)**
      
      Gestión completa de preguntas frecuentes y base de conocimientos.
      
      ## 📝 **Funcionalidades FAQ**
      - **CRUD Completo**: Crear, leer, actualizar, eliminar FAQs
      - **Búsqueda**: Buscar por palabra clave o categoría
      - **Categorías**: Organización por temas
      - **Priorización**: Orden de importancia
      
      ## 🔍 **Búsqueda Inteligente**
      - **Texto completo**: Búsqueda en preguntas y respuestas
      - **Filtros**: Por categoría, fecha, popularidad
      - **Sugerencias**: Preguntas relacionadas
      
      ## 🔒 **Control de Acceso**
      - **Público**: Lectura de FAQs
      - **Admin**: Gestión completa (requiere JWT)
      - **Moderación**: Control de contenido
    `)
    .setVersion('1.0.0')
    .addTag('FAQ', 'Gestión de preguntas frecuentes')
    .addTag('Categories', 'Categorías de FAQ')
    .addTag('Search', 'Búsqueda de contenido')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token requerido para operaciones de admin',
      },
      'access-token',
    )
    .addServer('http://localhost:3002', 'FAQ Service (desarrollo)')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'FAQ Service Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #ea580c; }
      .swagger-ui .scheme-container { background: #fff7ed; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      tryItOutEnabled: true,
    },
  });

  const port = process.env.PORT || 3002;
  await app.listen(port, '0.0.0.0');
  
  console.log(`❓ FAQ Service corriendo en puerto ${port}`);
  console.log(`📚 Documentación Swagger disponible en http://localhost:${port}/api/docs`);
  console.log('🔍 Búsqueda: GET /faq/search');
  console.log('📝 CRUD: GET, POST, PUT, DELETE /faq');
}

bootstrap();
