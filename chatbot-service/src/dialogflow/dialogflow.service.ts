import { Injectable } from '@nestjs/common';
import * as dialogflow from 'dialogflow';
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
      const credentials = this.dialogflowConfig.getCredentials();

      this.sessionClient = new dialogflow.SessionsClient({
        credentials,
        projectId: this.projectId,
      });

      console.log('✅ Dialogflow configurado con variables de entorno');
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
