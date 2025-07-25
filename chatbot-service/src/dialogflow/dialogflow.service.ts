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
      // Producción: usar variable DIALOGFLOW_KEY como JSON string
      if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT) {
        const credentialsString = process.env.DIALOGFLOW_KEY;
        if (!credentialsString) {
          throw new Error('❌ Falta la variable DIALOGFLOW_KEY en entorno de producción');
        }

        const credentials = JSON.parse(credentialsString);

        this.sessionClient = new dialogflow.SessionsClient({
          credentials,
          projectId: this.projectId,
        });

        console.log('✅ Dialogflow configurado con variable DIALOGFLOW_KEY (producción)');
      } else {
        // Desarrollo local: usar archivo JSON
        try {
          const keyPath = path.join(__dirname, '../../config/dialogflow-key.json');
          this.sessionClient = new dialogflow.SessionsClient({
            keyFilename: keyPath,
          });
          console.log('✅ Dialogflow configurado con archivo local dialogflow-key.json');
        } catch (error) {
          console.error('❌ No se encontró el archivo dialogflow-key.json en desarrollo:', error);
          throw new Error('Falta el archivo dialogflow-key.json en entorno local.');
        }
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
