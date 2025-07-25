import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface HealthStatus {
  status: 'ok' | 'error';
  service: string;
  timestamp: string;
  uptime: number;
  environment: string;
  database?: {
    connected: boolean;
    error?: string;
  };
  dependencies?: {
    openai: boolean;
    twilio: boolean;
    dialogflow: boolean;
  };
}

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async checkHealth(): Promise<HealthStatus> {
    // Respuesta básica inmediata
    const basicHealth: HealthStatus = {
      status: 'ok',
      service: 'chatbot-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };

    // Si es una verificación rápida (primeros 30 segundos), devolver solo lo básico
    if (process.uptime() < 30) {
      return basicHealth;
    }

    // Verificaciones completas después del inicio
    try {
      // Verificar base de datos
      await this.prisma.$queryRaw`SELECT 1`;
      basicHealth.database = { connected: true };
    } catch (error) {
      basicHealth.database = { 
        connected: false, 
        error: error.message 
      };
      // No marcar como error si solo falla la DB
    }

    // Verificar dependencias
    basicHealth.dependencies = {
      openai: !!process.env.OPENAI_API_KEY,
      twilio: !!process.env.TWILIO_ACCOUNT_SID,
      dialogflow: !!process.env.GOOGLE_PROJECT_ID,
    };

    return basicHealth;
  }
}
