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
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription(`
      🔐 **Servicio de Autenticación y Autorización**
      
      Manejo completo de usuarios, autenticación JWT y control de acceso.
      
      ## 👥 **Funcionalidades de Usuario**
      - **Registro**: Crear nuevas cuentas de usuario
      - **Login**: Autenticación con email y contraseña
      - **Perfil**: Gestión de datos personales
      - **Roles**: Control de permisos (ADMIN, USUARIO)
      
      ## 🔑 **JWT Tokens**
      - **Access Token**: Para autenticación en API
      - **Refresh Token**: Para renovar sesión
      - **Expiración**: Tokens seguros con tiempo límite
      
      ## 🛑 **Seguridad**
      - **Bcrypt**: Hash seguro de contraseñas
      - **Validación**: Reglas estrictas de entrada
      - **Rate Limiting**: Protección contra ataques
    `)
    .setVersion('1.0.0')
    .addTag('Auth', 'Autenticación y login')
    .addTag('Users', 'Gestión de usuarios')
    .addTag('Profile', 'Perfil de usuario')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtenido del endpoint /auth/login',
      },
      'access-token',
    )
    .addServer('http://localhost:3001', 'Auth Service (desarrollo)')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Auth Service Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #1d4ed8; }
      .swagger-ui .scheme-container { background: #eff6ff; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      tryItOutEnabled: true,
    },
  });

  await app.listen(process.env.PORT ?? 3001);
  
  console.log('🔐 Auth Service corriendo en http://localhost:3001');
  console.log('📚 Documentación Swagger disponible en http://localhost:3001/api/docs');
  console.log('👥 Login: POST /auth/login');
  console.log('✅ Register: POST /auth/register');
}

bootstrap();
