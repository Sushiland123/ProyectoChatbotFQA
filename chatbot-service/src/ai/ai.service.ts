import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({ apiKey });
  }

  async getResponse(prompt: string): Promise<{ response: string; isFallback: boolean }> {
    try {
      // Para testing: forzar fallos en ciertos casos
      if (prompt.toLowerCase().includes('test fallback') || prompt.toLowerCase().includes('prueba fallo')) {
        return {
          response: 'Lo siento, no puedo ayudar con esa consulta específica.',
          isFallback: true
        };
      }

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Eres un asistente virtual de servicio al cliente amigable y profesional. 
            Tu objetivo es ayudar a los usuarios con sus consultas de manera clara y útil.
            Si no tienes información específica sobre algo, explica que puedes ayudar con consultas generales
            y que para temas específicos de la empresa pueden contactar a soporte.
            Mantén tus respuestas concisas pero informativas.
            Responde siempre en español.`
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content || 'No se pudo generar una respuesta. Por favor, intenta reformular tu pregunta.';
      
      // Detectar si la respuesta indica que la IA no puede ayudar
      const isFailureResponse = this.isFailureResponse(response);
      
      return {
        response,
        isFallback: isFailureResponse
      };
    } catch (error) {
      console.error('❌ Error en OpenAI:', error);
      return {
        response: 'Lo siento, hay un problema técnico temporal. Por favor, intenta nuevamente en unos momentos.',
        isFallback: true
      };
    }
  }

  private isFailureResponse(response: string): boolean {
    const failureIndicators = [
      'no puedo ayudar',
      'no tengo información',
      'no sé',
      'no conozco',
      'fuera de mi alcance',
      'contactar a soporte',
      'problema técnico',
      'no se pudo generar',
      'intenta nuevamente',
      'reformular tu pregunta'
    ];

    const lowerResponse = response.toLowerCase();
    return failureIndicators.some(indicator => lowerResponse.includes(indicator));
  }
}
