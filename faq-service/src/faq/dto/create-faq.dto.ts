import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, MaxLength } from 'class-validator';

export class CreateFaqDto {
  @ApiProperty({
    description: 'Pregunta frecuente',
    example: '¿Cuáles son los horarios de atención?',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'La pregunta es requerida' })
  @MaxLength(255, { message: 'La pregunta no puede exceder 255 caracteres' })
  pregunta: string;

  @ApiProperty({
    description: 'Respuesta a la pregunta',
    example: 'Nuestros horarios de atención son de lunes a viernes de 8:00 AM a 6:00 PM',
  })
  @IsString()
  @IsNotEmpty({ message: 'La respuesta es requerida' })
  respuesta: string;

  @ApiProperty({
    description: 'URL de multimedia (imágenes, videos, etc.)',
    example: 'https://example.com/imagen.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  multimedia?: string;

  @ApiProperty({
    description: 'ID del grupo al que pertenece la FAQ',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID del grupo debe ser un número' })
  @IsNotEmpty({ message: 'El ID del grupo es requerido' })
  grupoId: number;
}
