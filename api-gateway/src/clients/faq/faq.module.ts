import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FaqClientService } from './faq.service'; // ✅ nombre correcto

@Module({
  imports: [HttpModule],
  providers: [FaqClientService],
  exports: [FaqClientService],
})
export class FaqModule {}
