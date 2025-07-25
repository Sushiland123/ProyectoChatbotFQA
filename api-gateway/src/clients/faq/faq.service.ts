import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FaqClientService {
  private faqUrl = process.env.FAQ_SERVICE_URL || 'http://faq-service.railway.internal:3002/faq';
  private grupoUrl = process.env.FAQ_SERVICE_URL || 'http://faq-service.railway.internal:3002/grupo-faq';

  constructor(private readonly http: HttpService) {}

  // FAQs

  async findAllFaqs() {
    const res = await firstValueFrom(this.http.get(this.faqUrl));
    return res.data;
  }

  async findOneFaq(id: number) {
    const res = await firstValueFrom(this.http.get(`${this.faqUrl}/${id}`));
    return res.data;
  }

  async createFaq(data: any, token: string) {
    const res = await firstValueFrom(
      this.http.post(this.faqUrl, data, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return res.data;
  }

  async updateFaq(id: number, data: any, token: string) {
    const res = await firstValueFrom(
      this.http.patch(`${this.faqUrl}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return res.data;
  }

  async removeFaq(id: number, token: string) {
    const res = await firstValueFrom(
      this.http.delete(`${this.faqUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return res.data;
  }

  // Grupos FAQ

  async findAllGrupos() {
    const res = await firstValueFrom(this.http.get(this.grupoUrl));
    return res.data;
  }

  async findOneGrupo(id: number) {
    const res = await firstValueFrom(this.http.get(`${this.grupoUrl}/${id}`));
    return res.data;
  }

  async createGrupo(data: any, token: string) {
    const res = await firstValueFrom(
      this.http.post(this.grupoUrl, data, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return res.data;
  }

  async updateGrupo(id: number, data: any, token: string) {
    const res = await firstValueFrom(
      this.http.patch(`${this.grupoUrl}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return res.data;
  }

  async removeGrupo(id: number, token: string) {
    const res = await firstValueFrom(
      this.http.delete(`${this.grupoUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return res.data;
  }
}
