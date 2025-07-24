import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { FaqModule } from './faq/faq.module';
import { GrupoFaqModule } from './grupo-faq/grupo-faq.module';

@Module({
  imports: [PrismaModule, FaqModule, GrupoFaqModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
