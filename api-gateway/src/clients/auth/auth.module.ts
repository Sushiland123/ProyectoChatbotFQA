import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthClientService } from './auth.service'; // ✅ nombre correcto

@Module({
  imports: [HttpModule],
  providers: [AuthClientService],
  exports: [AuthClientService],
})
export class AuthModule {}
