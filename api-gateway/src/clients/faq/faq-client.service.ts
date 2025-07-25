import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FaqClientService {
  private readonly faqServiceUrl = process.env.FAQ_SERVICE_URL || 'http://localhost:3002';

  async getAllFaqs(authHeader: string) {
    try {
      const response = await axios.get(`${this.faqServiceUrl}/faq`, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
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

  async createFaq(faqData: any, authHeader: string) {
    try {
      const response = await axios.post(`${this.faqServiceUrl}/faq`, faqData, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
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

  async updateFaq(faqId: string, faqData: any, authHeader: string) {
    try {
      const response = await axios.patch(`${this.faqServiceUrl}/faq/${faqId}`, faqData, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
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

  async deleteFaq(faqId: string, authHeader: string) {
    try {
      const response = await axios.delete(`${this.faqServiceUrl}/faq/${faqId}`, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
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

  async getAllGroups(authHeader: string) {
    try {
      const response = await axios.get(`${this.faqServiceUrl}/grupo-faq`, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
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

  async createGroup(groupData: any, authHeader: string) {
    try {
      const response = await axios.post(`${this.faqServiceUrl}/grupo-faq`, groupData, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
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
