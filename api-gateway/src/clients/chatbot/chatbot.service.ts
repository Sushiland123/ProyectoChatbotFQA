import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatbotClientService {
  private baseUrl = process.env.CHATBOT_SERVICE_URL || 'http://localhost:3003';

  constructor(private readonly http: HttpService) {
    console.log('🔗 Chatbot Service URL:', this.baseUrl);
  }

  async sendMessage(data: any, userId?: string) {
    try {
      const headers: any = {};
      if (userId) {
        headers['x-user-id'] = userId;
      }

      console.log('📤 Enviando mensaje al chatbot:', { url: `${this.baseUrl}/chat/message`, data });
      
      const res = await firstValueFrom(
        this.http.post(`${this.baseUrl}/chat/message`, data, { headers }),
      );
      
      console.log('📥 Respuesta del chatbot:', res.data);
      return res.data;
    } catch (error) {
      console.error('❌ Error al comunicarse con chatbot-service:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  async getAnalytics(userId?: string) {
    try {
      const headers: any = {};
      if (userId) {
        headers['x-user-id'] = userId;
      }

      const res = await firstValueFrom(
        this.http.get(`${this.baseUrl}/analytics`, { headers }),
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async createTicket(data: any, userId?: string) {
    try {
      const headers: any = {};
      if (userId) {
        headers['x-user-id'] = userId;
      }

      const res = await firstValueFrom(
        this.http.post(`${this.baseUrl}/tickets`, data, { headers }),
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async getTickets(userRole?: string) {
    try {
      const headers: any = {};
      if (userRole) {
        headers['x-user-role'] = userRole;
      }

      const res = await firstValueFrom(
        this.http.get(`${this.baseUrl}/tickets`, { headers }),
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async updateTicketStatus(id: number, data: any, userRole?: string) {
    try {
      const headers: any = {};
      if (userRole) {
        headers['x-user-role'] = userRole;
      }

      const res = await firstValueFrom(
        this.http.patch(`${this.baseUrl}/tickets/${id}/estado`, data, { headers }),
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
