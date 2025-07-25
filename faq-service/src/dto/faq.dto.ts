import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, MaxLength } from 'class-validator';

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
    description: 'Categoría de la FAQ',
    example: 'horarios',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty({
    description: 'Palabras clave para búsqueda',
    example: 'horarios, atención, tiempo',
    required: false,
  })
  @IsOptional()
  @IsString()
  palabrasClave?: string;

  @ApiProperty({
    description: 'Orden de prioridad (mayor número = mayor prioridad)',
    example: 1,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El orden debe ser un número' })
  @IsPositive({ message: 'El orden debe ser positivo' })
  orden?: number;
}

export class UpdateFaqDto {
  @ApiProperty({
    description: 'Nueva pregunta',
    example: '¿Cuál es el horario de atención al cliente?',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'La pregunta no puede exceder 255 caracteres' })
  pregunta?: string;

  @ApiProperty({
    description: 'Nueva respuesta',
    example: 'Atendemos de lunes a viernes de 8:00 AM a 6:00 PM, y sábados de 9:00 AM a 2:00 PM',
    required: false,
  })
  @IsOptional()
  @IsString()
  respuesta?: string;

  @ApiProperty({
    description: 'Nueva categoría',
    example: 'atención-cliente',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty({
    description: 'Nuevas palabras clave',
    example: 'horarios, atención, cliente, sábados',
    required: false,
  })
  @IsOptional()
  @IsString()
  palabrasClave?: string;

  @ApiProperty({
    description: 'Nuevo orden de prioridad',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El orden debe ser un número' })
  @IsPositive({ message: 'El orden debe ser positivo' })
  orden?: number;
}

export class FaqResponseDto {
  @ApiProperty({
    description: 'ID único de la FAQ',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Pregunta frecuente',
    example: '¿Cuáles son los horarios de atención?',
  })
  pregunta: string;

  @ApiProperty({
    description: 'Respuesta a la pregunta',
    example: 'Nuestros horarios de atención son de lunes a viernes de 8:00 AM a 6:00 PM',
  })
  respuesta: string;

  @ApiProperty({
    description: 'Categoría de la FAQ',
    example: 'horarios',
    nullable: true,
  })
  categoria: string | null;

  @ApiProperty({
    description: 'Palabras clave para búsqueda',
    example: 'horarios, atención, tiempo',
    nullable: true,
  })
  palabrasClave: string | null;

  @ApiProperty({
    description: 'Orden de prioridad',
    example: 1,
    nullable: true,
  })
  orden: number | null;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: string;
}

export class SearchFaqDto {
  @ApiProperty({
    description: 'Término de búsqueda',
    example: 'horarios',
    required: false,
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({
    description: 'Filtrar por categoría',
    example: 'horarios',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty({
    description: 'Número de página',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La página debe ser un número' })
  @IsPositive({ message: 'La página debe ser mayor a 0' })
  page?: number;

  @ApiProperty({
    description: 'Elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @IsPositive({ message: 'El límite debe ser mayor a 0' })
  limit?: number;
}

export class FaqSearchResponseDto {
  @ApiProperty({
    description: 'Lista de FAQs encontradas',
    type: [FaqResponseDto],
  })
  data: FaqResponseDto[];

  @ApiProperty({
    description: 'Total de resultados encontrados',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Página actual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Elementos por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 3,
  })
  totalPages: number;
}

export class CategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'horarios',
  })
  nombre: string;

  @ApiProperty({
    description: 'Cantidad de FAQs en esta categoría',
    example: 5,
  })
  cantidad: number;
}

export class FaqStatsDto {
  @ApiProperty({
    description: 'Total de FAQs en el sistema',
    example: 50,
  })
  totalFaqs: number;

  @ApiProperty({
    description: 'Categorías disponibles',
    type: [CategoryDto],
  })
  categorias: CategoryDto[];

  @ApiProperty({
    description: 'FAQ más reciente',
    type: FaqResponseDto,
    nullable: true,
  })
  faqMasReciente: FaqResponseDto | null;
}