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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @ApiOperation({
    summary: 'Obtener todas las FAQs',
    description: 'Listar todas las preguntas frecuentes disponibles',
  })
  @ApiResponse({ status: 200, description: 'Lista de FAQs obtenida exitosamente' })
  @Get()
  findAll() {
    return this.faqService.findAll();
  }

  @ApiOperation({
    summary: 'Obtener FAQ por ID',
    description: 'Obtener una pregunta frecuente específica por su ID',
  })
  @ApiParam({ name: 'id', description: 'ID de la FAQ', example: 1 })
  @ApiResponse({ status: 200, description: 'FAQ encontrada exitosamente' })
  @ApiResponse({ status: 404, description: 'FAQ no encontrada' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.findOne(id);
  }

  @ApiOperation({
    summary: 'Crear nueva FAQ',
    description: 'Crear una nueva pregunta frecuente (solo administradores)',
  })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateFaqDto })
  @ApiResponse({ status: 201, description: 'FAQ creada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden crear FAQs' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateFaqDto, @User('rol') rol: string) {
    if (rol !== 'ADMIN') {
      return { message: 'Solo los administradores pueden crear preguntas' };
    }
    return this.faqService.create(dto);
  }

  @ApiOperation({
    summary: 'Actualizar FAQ',
    description: 'Actualizar una pregunta frecuente existente (solo administradores)',
  })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: 'ID de la FAQ a actualizar', example: 1 })
  @ApiBody({ type: UpdateFaqDto })
  @ApiResponse({ status: 200, description: 'FAQ actualizada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden actualizar FAQs' })
  @ApiResponse({ status: 404, description: 'FAQ no encontrada' })
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

  @ApiOperation({
    summary: 'Eliminar FAQ',
    description: 'Eliminar una pregunta frecuente (solo administradores)',
  })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: 'ID de la FAQ a eliminar', example: 1 })
  @ApiResponse({ status: 200, description: 'FAQ eliminada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden eliminar FAQs' })
  @ApiResponse({ status: 404, description: 'FAQ no encontrada' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @User('rol') rol: string) {
    if (rol !== 'ADMIN') {
      return { message: 'Solo los administradores pueden eliminar preguntas' };
    }
    return this.faqService.remove(id);
  }
}
