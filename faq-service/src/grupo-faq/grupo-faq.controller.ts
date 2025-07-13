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
import { GrupoFaqService } from './grupo-faq.service';
import { CreateGrupoFaqDto } from './dto/create-grupo-faq.dto';
import { UpdateGrupoFaqDto } from './dto/update-grupo-faq.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';

@Controller('grupo-faq')
export class GrupoFaqController {
  constructor(private readonly grupoFaqService: GrupoFaqService) {}

  @Get()
  findAll() {
    return this.grupoFaqService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.grupoFaqService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateGrupoFaqDto, @User('rol') rol: string) {
    if (rol !== 'ADMIN') {
      return { message: 'Solo los administradores pueden crear grupos' };
    }
    return this.grupoFaqService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGrupoFaqDto,
    @User('rol') rol: string,
  ) {
    if (rol !== 'ADMIN') {
      return { message: 'Solo los administradores pueden actualizar grupos' };
    }
    return this.grupoFaqService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @User('rol') rol: string) {
    if (rol !== 'ADMIN') {
      return { message: 'Solo los administradores pueden eliminar grupos' };
    }
    return this.grupoFaqService.remove(id);
  }
}
