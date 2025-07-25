import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface HealthStatus {
  status: 'ok' | 'error';
  service: string;
  timestamp: string;
  uptime: number;
  environment: string;
  database: {
    connected: boolean;
    error?: string;
  };
  dependencies: {
    openai: boolean;
    twilio: boolean;
    dialogflow: boolean;
  };
}

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async checkHealth(): Promise<HealthStatus> {
    const healthStatus: HealthStatus = {
      status: 'ok',
      service: 'chatbot-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: false,
      },
      dependencies: {
        openai: !!process.env.OPENAI_API_KEY,
        twilio: !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN,
        dialogflow: !!process.env.GOOGLE_PROJECT_ID,
      },
    };

    // Verificar conexión a base de datos
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      healthStatus.database.connected = true;
    } catch (error) {
      healthStatus.status = 'error';
      healthStatus.database.connected = false;
      healthStatus.database.error = error.message;
    }

    return healthStatus;
  }
}
