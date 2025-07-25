import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FaqClientService {
  private faqUrl = process.env.FAQ_SERVICE_URL || 'http://localhost:3002';
  private grupoUrl = process.env.FAQ_SERVICE_URL || 'http://localhost:3002';

  constructor(private readonly http: HttpService) {}

  // FAQs

  async findAllFaqs() {
    const res = await firstValueFrom(this.http.get(`${this.faqUrl}/faq`));
    return res.data;
  }

  async findOneFaq(id: number) {
    const res = await firstValueFrom(this.http.get(`${this.faqUrl}/faq/${id}`));
    return res.data;
  }

  async createFaq(data: any, token: string) {
    const res = await firstValueFrom(
      this.http.post(`${this.faqUrl}/faq`, data, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return res.data;
  }

  async updateFaq(id: number, data: any, token: string) {
    const res = await firstValueFrom(
      this.http.patch(`${this.faqUrl}/faq/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return res.data;
  }

  async removeFaq(id: number, token: string) {
    const res = await firstValueFrom(
      this.http.delete(`${this.faqUrl}/faq/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return res.data;
  }

  // Grupos FAQ

  async findAllGrupos() {
    const res = await firstValueFrom(this.http.get(`${this.grupoUrl}/grupo-faq`));
    return res.data;
  }

  async findOneGrupo(id: number) {
    const res = await firstValueFrom(this.http.get(`${this.grupoUrl}/grupo-faq/${id}`));
    return res.data;
  }

  async createGrupo(data: any, token: string) {
    const res = await firstValueFrom(
      this.http.post(`${this.grupoUrl}/grupo-faq`, data, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return res.data;
  }

  async updateGrupo(id: number, data: any, token: string) {
    const res = await firstValueFrom(
      this.http.patch(`${this.grupoUrl}/grupo-faq/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return res.data;
  }

  async removeGrupo(id: number, token: string) {
    const res = await firstValueFrom(
      this.http.delete(`${this.grupoUrl}/grupo-faq/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return res.data;
  }
}
