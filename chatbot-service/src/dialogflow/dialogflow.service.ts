import { Injectable } from '@nestjs/common';
import * as dialogflow from 'dialogflow';
import * as path from 'path';
import { DialogflowConfig } from './dialogflow.config';

@Injectable()
export class DialogflowService {
  private sessionClient: dialogflow.SessionsClient;
  private projectId: string;
  private dialogflowConfig: DialogflowConfig;

  constructor() {
    this.dialogflowConfig = new DialogflowConfig();
    this.projectId = this.dialogflowConfig.getProjectId();

    try {
      // En Railway/producción, usar variables de entorno
      if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT) {
        const credentials = this.dialogflowConfig.getCredentials();
        
        this.sessionClient = new dialogflow.SessionsClient({
          credentials: credentials,
          projectId: this.projectId,
        });
        console.log('✅ Dialogflow configurado con variables de entorno para Railway');
      } else {
        // En desarrollo local, usar archivo JSON
        const keyPath = path.join(__dirname, '../../config/dialogflow-key.json');
        this.sessionClient = new dialogflow.SessionsClient({
          keyFilename: keyPath,
        });
        console.log('✅ Dialogflow configurado con archivo JSON local');
      }
    } catch (error) {
      console.error('❌ Error configurando Dialogflow:', error);
      throw new Error(`Failed to initialize Dialogflow: ${error.message}`);
    }
  }

  async detectIntent(userText: string, sessionId: string) {
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

      return {
        intent: result.intent?.displayName || 'Default',
        response: result.fulfillmentText,
        isFallback: result.intent?.isFallback || false,
      };
    } catch (error) {
      console.error('❌ Error en Dialogflow detectIntent:', error);
      throw new Error(`Dialogflow detection failed: ${error.message}`);
    }
  }
}
