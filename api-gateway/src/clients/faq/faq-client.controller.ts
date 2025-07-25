import { 
  Controller, 
  Get, 
  Post,
  Patch,
  Delete,
  Param, 
  Body, 
  Headers,
  UseGuards 
} from '@nestjs/common';
import { FaqClientService } from './faq-client.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('faq')
@UseGuards(JwtAuthGuard)
export class FaqClientController {
  constructor(private readonly faqService: FaqClientService) {}

  @Get()
  async getAllFaqs(@Headers('authorization') authHeader: string) {
    return this.faqService.getAllFaqs(authHeader);
  }

  @Post()
  async createFaq(
    @Body() faqData: any,
    @Headers('authorization') authHeader: string
  ) {
    return this.faqService.createFaq(faqData, authHeader);
  }

  @Patch(':id')
  async updateFaq(
    @Param('id') id: string,
    @Body() faqData: any,
    @Headers('authorization') authHeader: string
  ) {
    return this.faqService.updateFaq(id, faqData, authHeader);
  }

  @Delete(':id')
  async deleteFaq(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string
  ) {
    return this.faqService.deleteFaq(id, authHeader);
  }

  @Get('groups')
  async getAllGroups(@Headers('authorization') authHeader: string) {
    return this.faqService.getAllGroups(authHeader);
  }

  @Post('groups')
  async createGroup(
    @Body() groupData: any,
    @Headers('authorization') authHeader: string
  ) {
    return this.faqService.createGroup(groupData, authHeader);
  }
}
