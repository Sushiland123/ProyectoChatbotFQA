import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Acepta certificados autofirmados
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    return await this.transporter.sendMail({
      from: `"Soporte Técnico" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  }
}
