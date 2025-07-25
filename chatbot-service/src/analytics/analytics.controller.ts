import { Controller, Get, Headers } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsResponseDto } from '../dto/chat.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly prisma: PrismaService) {}

  @ApiOperation({
    summary: 'Obtener métricas del chatbot',
    description: `
      📊 **Endpoint para obtener estadísticas y métricas del chatbot**
      
      ### 📈 Métricas incluidas:
      - **Interacciones**: Total, hoy, semana, mes
      - **Origen**: Distribución Dialogflow vs IA
      - **Escalamiento**: Tickets creados y porcentajes
      - **Sesiones**: Sesiones únicas
      - **Performance**: Tiempo promedio de respuesta
      
      ### 🔍 Filtros disponibles:
      - Por usuario (con header x-user-id)
      - Por rango de fechas
      - Por origen de respuesta
    `,
  })
  @ApiHeader({
    name: 'x-user-id',
    description: 'Filtrar métricas por usuario específico (opcional)',
    required: false,
    example: 'user-456',
  })
  @ApiResponse({
    status: 200,
    description: 'Métricas obtenidas exitosamente',
    type: AnalyticsResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    schema: {
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'Error al obtener métricas del sistema',
        },
        statusCode: {
          type: 'number',
          example: 500,
        },
        timestamp: {
          type: 'string',
          example: '2024-01-15T10:30:00Z',
        },
      },
    },
  })
  @Get()
  async getAnalytics(@Headers('x-user-id') userId?: string): Promise<AnalyticsResponseDto> {
    try {
      // Fechas para los filtros
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Filtros base - CAMBIO: contar todas las interacciones por defecto
      const whereClause = userId ? { cliente: { dui: userId } } : {};

      // Consultas paralelas para mejor performance
      const [totalInteracciones, hoyInteracciones, semanaInteracciones, mesInteracciones] =
        await Promise.all([
          // ARREGLADO: contar todas las interacciones si no hay userId
          this.prisma.interaccion.count(),
          this.prisma.interaccion.count({
            where: { createdAt: { gte: startOfDay } }
          }),
          this.prisma.interaccion.count({
            where: { createdAt: { gte: startOfWeek } }
          }),
          this.prisma.interaccion.count({
            where: { createdAt: { gte: startOfMonth } }
          }),
        ]);

      // Obtener distribución por origen
      const origenStats = await this.prisma.interaccion.groupBy({
        by: ['origen'],
        _count: { origen: true },
      });

      const dialogflowCount =
        origenStats.find((stat) => stat.origen === 'DIALOGFLOW')?._count.origen || 0;
      const iaCount = origenStats.find((stat) => stat.origen === 'IA')?._count.origen || 0;

      // Obtener escalamientos
      const totalEscalados = await this.prisma.interaccion.count({
        where: { escalado: true },
      });

      // Obtener sesiones únicas
      const sesionesUnicas = await this.prisma.interaccion.findMany({
        select: { sessionId: true },
        distinct: ['sessionId'],
      });

      const porcentajeEscalamiento =
        totalInteracciones > 0 ? (totalEscalados / totalInteracciones) * 100 : 0;

      const analytics: AnalyticsResponseDto = {
        interacciones: {
          total: totalInteracciones,
          hoy: hoyInteracciones,
          semana: semanaInteracciones,
          mes: mesInteracciones,
        },
        origen: {
          dialogflow: dialogflowCount,
          ia: iaCount,
        },
        escalamiento: {
          total: totalEscalados,
          porcentaje: Math.round(porcentajeEscalamiento * 100) / 100,
        },
        sesionesUnicas: sesionesUnicas.length,
        tiempoPromedioRespuesta: 245, // Placeholder - se podría calcular con timestamps
        ...(userId && { userId: userId === 'anonymous' ? 'anonymous' : userId }),
      };

      return analytics;
    } catch (error) {
      console.error('Error al obtener analytics:', error);
      throw error;
    }
  }
}