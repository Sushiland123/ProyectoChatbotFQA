import { Injectable } from '@nestjs/common';
import * as dialogflow from 'dialogflow';

@Injectable()
export class DialogflowService {
  private sessionClient: dialogflow.SessionsClient;
  private projectId: string;
  private isConfigured: boolean = false;

  constructor() {
    try {
      const key = process.env.DIALOGFLOW_KEY;
      if (!key) {
        console.warn('⚠️  DIALOGFLOW_KEY no está definida - Dialogflow deshabilitado');
        this.isConfigured = false;
        return;
      }

      const credentials = JSON.parse(key);
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

      this.projectId = credentials.project_id;

      this.sessionClient = new dialogflow.SessionsClient({
        credentials,
      });

      this.isConfigured = true;
      console.log('✅ Dialogflow configurado desde DIALOGFLOW_KEY');
    } catch (error) {
      console.error('❌ Error al inicializar Dialogflow:', error);
      console.warn('⚠️  Continuando sin Dialogflow - Solo se usará IA como fallback');
      this.isConfigured = false;
    }
  }

  async detectIntent(userText: string, sessionId: string) {
    // Si Dialogflow no está configurado, devolver respuesta de fallback
    if (!this.isConfigured) {
      console.log('⚠️  Dialogflow no configurado - Usando fallback directo a IA');
      return {
        intent: 'Default Fallback Intent',
        response: '',
        isFallback: true,
        confidence: 0,
      };
    }

    try {
      const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);

      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: userText,
            languageCode: 'es',
          },
        },
      };

      const responses = await this.sessionClient.detectIntent(request);
      const result = responses[0].queryResult;

      const intentName = result.intent?.displayName || 'No Intent';
      const response = result.fulfillmentText || '';
      const isFallback = result.intent?.isFallback || false;
      const confidence = result.intentDetectionConfidence || 0;

      console.log(`🎯 Dialogflow - Intent: ${intentName}, Confidence: ${confidence.toFixed(2)}, Fallback: ${isFallback}`);

      return {
        intent: intentName,
        response: response,
        isFallback: isFallback,
        confidence: confidence,
      };
    } catch (error) {
      console.error('❌ Error en Dialogflow detectIntent:', error);
      // En caso de error, retornar como fallback para que use IA
      return {
        intent: 'Error',
        response: '',
        isFallback: true,
        confidence: 0,
      };
    }
  }
}
