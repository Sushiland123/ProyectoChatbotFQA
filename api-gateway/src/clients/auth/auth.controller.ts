import { Body, Controller, Post, Get, Headers, UnauthorizedException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { AuthClientService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authClient: AuthClientService) {}

  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autenticar usuario y obtener token JWT válido para toda la API.',
  })
  @ApiBody({
    description: 'Credenciales de usuario',
    examples: {
      admin: {
        summary: 'Administrador',
        value: {
          email: 'admin@test.com',
          password: 'admin123',
        },
      },
      user: {
        summary: 'Usuario normal',
        value: {
          email: 'user@test.com',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, token JWT generado',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 1,
        nombre: 'Usuario Test',
        email: 'user@test.com',
        rol: 'USUARIO',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @Post('login')
  async login(@Body() body: any) {
    return this.authClient.login(body);
  }

  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crear una nueva cuenta de usuario en el sistema.',
  })
  @ApiBody({
    description: 'Datos del nuevo usuario',
    examples: {
      usuario: {
        summary: 'Usuario normal',
        value: {
          nombre: 'Juan Pérez',
          email: 'juan@email.com',
          password: '123456',
          rol: 'USUARIO',
        },
      },
      admin: {
        summary: 'Administrador',
        value: {
          nombre: 'Admin Test',
          email: 'admin@email.com',
          password: 'admin123',
          rol: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o email ya existe' })
  @Post('register')
  async register(@Body() body: any) {
    return this.authClient.register(body);
  }

  @ApiOperation({
    summary: 'Obtener perfil de usuario',
    description: 'Obtener información del usuario autenticado.',
  })
  @ApiBearerAuth('access-token')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token obtenido del login',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido exitosamente',
    example: {
      message: 'Ruta protegida',
      user: {
        id: 1,
        nombre: 'Usuario Test',
        email: 'user@test.com',
        rol: 'USUARIO',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  @Get('profile')
  async profile(@Headers('Authorization') auth: string) {
    if (!auth) throw new UnauthorizedException('Token no proporcionado');
    return this.authClient.profile(auth.replace('Bearer ', ''));
  }
}
