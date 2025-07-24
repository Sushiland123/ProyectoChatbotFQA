import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly prisma: PrismaService) {}

  // Total de interacciones
  @Get('interacciones')
  async totalInteracciones() {
    const total = await this.prisma.interaccion.count();
    return { total };
  }

  // Interacciones por origen (Dialogflow vs IA)
  @Get('origen')
  async interaccionesPorOrigen() {
    const dialogflow = await this.prisma.interaccion.count({
      where: { origen: 'DIALOGFLOW' },
    });

    const ia = await this.prisma.interaccion.count({
      where: { origen: 'IA' },
    });

    return {
      dialogflow,
      ia,
    };
  }

  // Porcentaje de clientes que escalaron a ticket
  @Get('escalamiento')
  async porcentajeEscalamiento() {
    const totalClientes = await this.prisma.cliente.count();
    const clientesConTickets = await this.prisma.ticket.findMany({
      distinct: ['clienteId'],
    });

    const porcentaje =
      totalClientes > 0
        ? (clientesConTickets.length / totalClientes) * 100
        : 0;

    return {
      totalClientes,
      clientesConTickets: clientesConTickets.length,
      porcentaje: `${porcentaje.toFixed(2)}%`,
    };
  }
}
