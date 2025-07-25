import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) throw new UnauthorizedException('No token provided.');

    const token = authHeader.replace('Bearer ', '');
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'secreto',
      });

      request['user'] = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }
}
