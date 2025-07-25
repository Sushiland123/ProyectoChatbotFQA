import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TicketClientService {
  private readonly ticketServiceUrl = process.env.CHATBOT_SERVICE_URL || 'http://localhost:3003';

  async getAllTickets(authHeader: string, userRole: string) {
    try {
      const response = await axios.get(`${this.ticketServiceUrl}/tickets`, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
          'x-user-role': userRole,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('Error interno del servidor', 500);
    }
  }

  async updateTicketStatus(ticketId: string, statusData: any, authHeader: string, userRole: string) {
    try {
      const response = await axios.put(
        `${this.ticketServiceUrl}/tickets/${ticketId}/status`,
        statusData,
        {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
            'x-user-role': userRole,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('Error interno del servidor', 500);
    }
  }

  async getTicketById(ticketId: string, authHeader: string, userRole: string) {
    try {
      const response = await axios.get(`${this.ticketServiceUrl}/tickets/${ticketId}`, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
          'x-user-role': userRole,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('Error interno del servidor', 500);
    }
  }
}
