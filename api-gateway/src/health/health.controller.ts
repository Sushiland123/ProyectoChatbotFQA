import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from '../health/health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({
    summary: 'Health check consolidado del sistema',
    description: 'Verifica el estado de todos los microservicios y la conectividad general del sistema.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Sistema operativo - Todos los servicios funcionando correctamente',
    example: {
      status: 'ok',
      timestamp: '2025-07-25T12:00:00.000Z',
      services: {
        'api-gateway': { status: 'ok', responseTime: '5ms' },
        'auth-service': { status: 'ok', responseTime: '120ms' },
        'chatbot-service': { status: 'ok', responseTime: '95ms' },
        'faq-service': { status: 'ok', responseTime: '80ms' }
      },
      uptime: 3600,
      version: '1.0.0'
    }
  })
  @ApiResponse({ 
    status: 503, 
    description: 'Uno o más servicios no están disponibles',
    example: {
      status: 'degraded',
      timestamp: '2025-07-25T12:00:00.000Z',
      services: {
        'api-gateway': { status: 'ok', responseTime: '5ms' },
        'auth-service': { status: 'error', error: 'Connection timeout' },
        'chatbot-service': { status: 'ok', responseTime: '95ms' },
        'faq-service': { status: 'ok', responseTime: '80ms' }
      }
    }
  })
  @Get()
  async getHealth(): Promise<any> {
    return this.healthService.getSystemHealth();
  }

  @ApiOperation({
    summary: 'Health check rápido',
    description: 'Verifica solo el estado del API Gateway sin consultar otros servicios.',
  })
  @ApiResponse({ status: 200, description: 'API Gateway operativo' })
  @Get('quick')
  async getQuickHealth() {
    return {
      status: 'ok',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0'
    };
  }
}
