import { Injectable } from '@nestjs/common';
import * as dialogflow from 'dialogflow';
import * as path from 'path';

@Injectable()
export class DialogflowService {
  private sessionClient: dialogflow.SessionsClient;
  private projectId: string;

  constructor() {
    const keyPath = path.join(__dirname, '../../config/dialogflow-key.json');

    this.sessionClient = new dialogflow.SessionsClient({
      keyFilename: keyPath,
    });

    const credentials = require(keyPath);
    this.projectId = credentials.project_id;
  }

  async detectIntent(userText: string, sessionId: string) {
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

    // Al final del método detectIntent
    return {
      intent: result.intent?.displayName || 'Default',
      response: result.fulfillmentText,
      isFallback: result.intent?.isFallback || false,
    };
  }
}
