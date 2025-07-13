import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  findAll() {
    return this.faqService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateFaqDto, @User('rol') rol: string) {
    if (rol !== 'ADMIN') {
      return { message: 'Solo los administradores pueden crear preguntas' };
    }
    return this.faqService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFaqDto,
    @User('rol') rol: string,
  ) {
    if (rol !== 'ADMIN') {
      return { message: 'Solo los administradores pueden actualizar preguntas' };
    }
    return this.faqService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @User('rol') rol: string) {
    if (rol !== 'ADMIN') {
      return { message: 'Solo los administradores pueden eliminar preguntas' };
    }
    return this.faqService.remove(id);
  }
}
