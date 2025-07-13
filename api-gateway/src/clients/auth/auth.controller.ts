import { Body, Controller, Post, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthClientService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authClient: AuthClientService) {}

  @Post('login')
  async login(@Body() body: any) {
    return this.authClient.login(body);
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authClient.register(body);
  }

  @Get('profile')
  async profile(@Headers('Authorization') auth: string) {
    if (!auth) throw new UnauthorizedException('Token no proporcionado');
    return this.authClient.profile(auth.replace('Bearer ', ''));
  }
}
