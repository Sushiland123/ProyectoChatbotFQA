import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crear una nueva cuenta de usuario en el sistema',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o email ya existe' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autenticar usuario y obtener token JWT',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login exitoso, token JWT generado' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({
    summary: 'Obtener perfil de usuario',
    description: 'Obtener información del usuario autenticado',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@User() user: any) {
    return {
      message: 'Ruta protegida',
      user,
    };
  }
}
