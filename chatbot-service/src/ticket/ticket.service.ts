import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Asegúrate de tener este servicio si usas DI
import { MailService } from '../mail/mail.service';

@Injectable()
export class TicketService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async createTicket(asunto: string, dui: string) {
    const cliente = await this.prisma.cliente.findUnique({ where: { dui } });

    if (!cliente) {
      return { error: 'Cliente no encontrado con ese DUI.' };
    }

    const ticket = await this.prisma.ticket.create({
      data: {
        asunto,
        clienteId: cliente.id,
      },
    });

    return ticket;
  }

  async updateEstado(
    id: number,
    estado: 'EN_PROCESO' | 'LISTO',
    mensajeFinal?: string,
  ) {
    const ticket = await this.prisma.ticket.update({
      where: { id },
      data: { estado },
      include: { cliente: true }, // Para acceder al correo del cliente
    });

    const { correo } = ticket.cliente;

    if (estado === 'EN_PROCESO') {
      await this.mailService.sendMail(
        correo,
        'Tu ticket está en proceso',
        `Tu ticket con ID ${ticket.id} ha cambiado de estado a EN PROCESO. Pronto recibirás una solución.`,
      );
    } else if (estado === 'LISTO') {
      // Enviar notificación de resolución
      await this.mailService.sendMail(
        correo,
        'Tu ticket ha sido resuelto',
        `Tu ticket con ID ${ticket.id} ha sido marcado como LISTO. Solución: ${mensajeFinal || 'No se proporcionó un detalle.'}`,
      );

      // Enviar encuesta de satisfacción
      await this.enviarEncuestaSatisfaccion(ticket.id, correo);
    }

    return ticket;
  }

  async getTickets() {
    return await this.prisma.ticket.findMany({
      include: { cliente: true },
    });
  }

  private async enviarEncuestaSatisfaccion(ticketId: number, correo: string) {
    const encuestaUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/encuesta/${ticketId}`;
    
    const mensaje = `
🎯 ENCUESTA DE SATISFACCIÓN

Hola! Tu ticket #${ticketId} ha sido resuelto.

¿Qué tal fue nuestra atención? Tu opinión es muy importante para nosotros.

👆 Califica nuestro servicio (1-5 estrellas):
⭐ (1) Muy malo
⭐⭐ (2) Malo  
⭐⭐⭐ (3) Regular
⭐⭐⭐⭐ (4) Bueno
⭐⭐⭐⭐⭐ (5) Excelente

📝 Para calificar, responde a este correo con el número de estrellas (1-5).

¡Gracias por confiar en nosotros!

---
Equipo de Soporte Técnico
`;

    await this.mailService.sendMail(
      correo,
      '⭐ Califica nuestro servicio - Ticket #' + ticketId,
      mensaje
    );

    console.log(`📧 Encuesta enviada para ticket ${ticketId} a ${correo}`);
  }
}
