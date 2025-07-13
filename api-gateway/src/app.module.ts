import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';

// Importar controladores y servicios
import { AuthController } from './clients/auth/auth.controller';
import { AuthClientService } from './clients/auth/auth.service';

import { FaqController } from './clients/faq/faq.controller';
import { FaqClientService } from './clients/faq/faq.service';

import { JwtStrategy } from './clients/auth/jwt.strategy';

@Module({
  imports: [
    HttpModule,
    PassportModule,
  ],
  controllers: [
    AuthController,
    FaqController,
  ],
  providers: [
    AuthClientService,
    FaqClientService,
    JwtStrategy,
  ],
})
export class AppModule {}
