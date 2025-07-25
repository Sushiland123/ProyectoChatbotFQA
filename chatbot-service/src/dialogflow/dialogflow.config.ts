import { Injectable } from '@nestjs/common';

@Injectable()
export class DialogflowConfig {
  getCredentials() {
    // En Railway, usar variables de entorno
    if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT) {
      console.log('🔑 Usando credenciales de variables de entorno para Dialogflow');
      
      // Validar que todas las variables estén presentes
      const requiredVars = ['GOOGLE_PROJECT_ID', 'GOOGLE_PRIVATE_KEY_ID', 'GOOGLE_PRIVATE_KEY', 'GOOGLE_CLIENT_EMAIL', 'GOOGLE_CLIENT_ID'];
      const missingVars = requiredVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        console.error('❌ Variables de Google faltantes:', missingVars);
        throw new Error(`Variables de entorno faltantes: ${missingVars.join(', ')}`);
      }

      return {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        universe_domain: 'googleapis.com'
      };
    }

    // En desarrollo local, usar archivo JSON
    try {
      console.log('🔑 Usando archivo de credenciales local para Dialogflow');
      return require('../../config/dialogflow-key.json');
    } catch (error) {
      console.warn('⚠️ Archivo dialogflow-key.json no encontrado, usando variables de entorno');
      return this.getCredentials(); // Fallback a variables de entorno
    }
  }

  getProjectId(): string {
    return process.env.GOOGLE_PROJECT_ID || 'conectaya-bot';
  }
}
