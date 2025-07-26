import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface ServiceHealth {
  status: 'ok' | 'error' | 'timeout';
  responseTime?: string;
  error?: string;
}

interface SystemHealth {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  services: Record<string, ServiceHealth>;
  uptime: number;
  version: string;
}

@Injectable()
export class HealthService {
  constructor(private readonly httpService: HttpService) {}

  async getSystemHealth(): Promise<SystemHealth> {
    const startTime = Date.now();
    const services: Record<string, ServiceHealth> = {};

    // Configuración de servicios a verificar
    const servicesToCheck = [
      { name: 'auth-service', url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001' },
      { name: 'chatbot-service', url: process.env.CHATBOT_SERVICE_URL || 'http://localhost:3003' },
      { name: 'faq-service', url: process.env.FAQ_SERVICE_URL || 'http://localhost:3002' }
    ];

    // API Gateway siempre está OK si llegamos aquí
    services['api-gateway'] = {
      status: 'ok',
      responseTime: '0ms'
    };

    // Verificar cada servicio en paralelo
    const healthChecks = servicesToCheck.map(service => 
      this.checkServiceHealth(service.name, service.url)
    );

    const results = await Promise.allSettled(healthChecks);
    
    results.forEach((result, index) => {
      const serviceName = servicesToCheck[index].name;
      if (result.status === 'fulfilled') {
        services[serviceName] = result.value;
      } else {
        services[serviceName] = {
          status: 'error',
          error: 'Health check failed'
        };
      }
    });

    // Determinar estado general del sistema
    const hasErrors = Object.values(services).some(service => service.status === 'error');
    const hasTimeouts = Object.values(services).some(service => service.status === 'timeout');
    
    let systemStatus: 'ok' | 'degraded' | 'down' = 'ok';
    if (hasErrors || hasTimeouts) {
      const errorCount = Object.values(services).filter(s => s.status === 'error').length;
      systemStatus = errorCount >= servicesToCheck.length ? 'down' : 'degraded';
    }

    return {
      status: systemStatus,
      timestamp: new Date().toISOString(),
      services,
      uptime: process.uptime(),
      version: '1.0.0'
    };
  }

  private async checkServiceHealth(serviceName: string, baseUrl: string): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${baseUrl}/health`, {
          timeout: 5000, // 5 segundos timeout
          headers: {
            'User-Agent': 'API-Gateway-Health-Check'
          }
        })
      );

      const responseTime = Date.now() - startTime;
      
      if (response.status === 200) {
        return {
          status: 'ok',
          responseTime: `${responseTime}ms`
        };
      } else {
        return {
          status: 'error',
          error: `HTTP ${response.status}`
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      if (responseTime >= 5000) {
        return {
          status: 'timeout',
          error: 'Service timeout (>5s)'
        };
      }
      
      return {
        status: 'error',
        error: error.message || 'Connection failed'
      };
    }
  }
}
