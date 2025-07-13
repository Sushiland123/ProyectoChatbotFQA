import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthClientService {
  private baseUrl = 'http://localhost:3001/auth';

  constructor(private readonly http: HttpService) {}

  async register(data: any) {
    try {
      const res = await firstValueFrom(
        this.http.post(`${this.baseUrl}/register`, data),
      );
      return res.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(data: any) {
    try {
      const res = await firstValueFrom(
        this.http.post(`${this.baseUrl}/login`, data),
      );
      return res.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async profile(token: string) {
    try {
      const res = await firstValueFrom(
        this.http.get(`${this.baseUrl}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return res.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Error desconocido';

    const status = error?.response?.status;

    if (status === 400) {
      throw new BadRequestException(message);
    }

    throw new InternalServerErrorException(message);
  }
}
