import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  
  // Configuración global de validación
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Configuración de CORS simple
  app.enableCors();

  // Puerto de Railway o 3003
  const port = process.env.PORT || 3003;
  
  // Escuchar en todas las interfaces
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Chatbot Service corriendo en puerto ${port}`);
  console.log(`🔍 Health check disponible en: http://0.0.0.0:${port}/health`);
}

bootstrap().catch(error => {
  console.error('❌ Error fatal al iniciar:', error);
  process.exit(1);
});
