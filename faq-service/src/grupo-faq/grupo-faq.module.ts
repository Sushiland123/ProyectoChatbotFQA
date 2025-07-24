import { Module } from '@nestjs/common';
import { GrupoFaqService } from './grupo-faq.service';
import { GrupoFaqController } from './grupo-faq.controller';

@Module({
  controllers: [GrupoFaqController],
  providers: [GrupoFaqService],
})
export class GrupoFaqModule {}
