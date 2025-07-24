import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class WhatsappService {
  private client: Twilio;
  private from: string;

  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
    this.from = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
  }

  async sendMessage(to: string, message: string): Promise<void> {
    const whatsappTo = `whatsapp:${to}`;
    await this.client.messages.create({
      body: message,
      from: this.from,
      to: whatsappTo,
    });
  }
}
