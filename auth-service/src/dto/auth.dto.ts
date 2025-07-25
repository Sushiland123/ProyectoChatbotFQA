import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  USUARIO = 'USUARIO',
}

export class LoginDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'admin@test.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: '123456',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@email.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: UserRole,
    example: UserRole.USUARIO,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser ADMIN o USUARIO' })
  rol?: UserRole;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticación',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    example: {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan.perez@email.com',
      rol: 'USUARIO',
    },
  })
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
}

export class UserProfileDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  nombre: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: UserRole,
    example: UserRole.USUARIO,
  })
  rol: UserRole;

  @ApiProperty({
    description: 'Fecha de creación de la cuenta',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: string;
}

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Nuevo nombre del usuario',
    example: 'Juan Carlos Pérez',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre?: string;

  @ApiProperty({
    description: 'Nuevo email del usuario',
    example: 'juan.carlos@email.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email?: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Contraseña actual',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  currentPassword: string;

  @ApiProperty({
    description: 'Nueva contraseña',
    example: 'newpassword456',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  newPassword: string;
}

export class AuthErrorDto {
  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Credenciales inválidas',
  })
  message: string;

  @ApiProperty({
    description: 'Código de error HTTP',
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Unauthorized',
  })
  error: string;
}