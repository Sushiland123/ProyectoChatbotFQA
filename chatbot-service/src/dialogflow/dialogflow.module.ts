import { Module } from '@nestjs/common';
import { DialogflowService } from './dialogflow.service';

@Module({
  providers: [DialogflowService],
  exports: [DialogflowService], // 👈 Importante para usarlo en otros módulos
})
export class DialogflowModule {}
