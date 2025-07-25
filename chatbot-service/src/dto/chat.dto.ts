import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'Mensaje del usuario para el chatbot',
    example: '¿Cuáles son sus horarios de atención?',
    minLength: 1,
    maxLength: 256,
  })
  @IsString()
  @IsNotEmpty({ message: 'El mensaje no puede estar vacío' })
  @Length(1, 256, { message: 'El mensaje debe tener entre 1 y 256 caracteres' })
  message: string;

  @ApiProperty({
    description: 'ID de sesión para mantener el contexto de la conversación',
    example: 'user-session-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  sessionId?: string;
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'Respuesta del chatbot',
    example: 'Nuestros horarios de atención son de lunes a viernes de 8:00 AM a 6:00 PM',
  })
  message: string;

  @ApiProperty({
    description: 'ID de sesión utilizado',
    example: 'user-session-123',
  })
  sessionId: string;

  @ApiProperty({
    description: 'Origen de la respuesta',
    enum: ['DIALOGFLOW', 'IA'],
    example: 'DIALOGFLOW',
  })
  origen: 'DIALOGFLOW' | 'IA';

  @ApiProperty({
    description: 'Indica si la conversación fue escalada a soporte',
    example: false,
  })
  escalado: boolean;

  @ApiProperty({
    description: 'Timestamp de la respuesta',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: string;
}

export class ChatErrorResponseDto {
  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Debe enviar un parámetro q con su consulta',
  })
  error: string;

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp del error',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: string;
}

export class AnalyticsResponseDto {
  @ApiProperty({
    description: 'Estadísticas de interacciones',
    example: {
      total: 150,
      hoy: 25,
      semana: 89,
      mes: 150,
    },
  })
  interacciones: {
    total: number;
    hoy: number;
    semana: number;
    mes: number;
  };

  @ApiProperty({
    description: 'Distribución por origen de respuesta',
    example: {
      dialogflow: 85,
      ia: 65,
    },
  })
  origen: {
    dialogflow: number;
    ia: number;
  };

  @ApiProperty({
    description: 'Estadísticas de escalamiento',
    example: {
      total: 12,
      porcentaje: 8.0,
    },
  })
  escalamiento: {
    total: number;
    porcentaje: number;
  };

  @ApiProperty({
    description: 'Sesiones únicas',
    example: 85,
  })
  sesionesUnicas: number;

  @ApiProperty({
    description: 'Tiempo promedio de respuesta en milisegundos',
    example: 245,
  })
  tiempoPromedioRespuesta: number;

  @ApiProperty({
    description: 'ID del usuario (si se proporcionó)',
    example: 'user-456',
    required: false,
  })
  userId?: string;
}