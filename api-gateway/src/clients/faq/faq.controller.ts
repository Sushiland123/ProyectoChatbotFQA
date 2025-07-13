import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Headers,
} from '@nestjs/common';
import { FaqClientService } from './faq.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqClientService) {}

  @Get()
  findAll() {
    return this.faqService.findAllFaqs();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.findOneFaq(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any, @Headers('authorization') auth: string) {
    return this.faqService.createFaq(body, this.extractToken(auth));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
    return this.faqService.updateFaq(id, body, this.extractToken(auth));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') auth: string,
  ) {
    return this.faqService.removeFaq(id, this.extractToken(auth));
  }

  // --------- GRUPOS FAQ ---------

  @Get('/grupo-faq')
  findAllGroups() {
    return this.faqService.findAllGrupos();
  }

  @Get('/grupo-faq/:id')
  findOneGroup(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.findOneGrupo(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/grupo-faq')
  createGroup(@Body() body: any, @Headers('authorization') auth: string) {
    return this.faqService.createGrupo(body, this.extractToken(auth));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/grupo-faq/:id')
  updateGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
    return this.faqService.updateGrupo(id, body, this.extractToken(auth));
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/grupo-faq/:id')
  removeGroup(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') auth: string,
  ) {
    return this.faqService.removeGrupo(id, this.extractToken(auth));
  }

  private extractToken(header: string): string {
    return header?.replace('Bearer ', '');
  }
}
