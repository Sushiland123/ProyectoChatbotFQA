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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { FaqClientService } from './faq.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqClientService) {}

  @ApiOperation({
    summary: 'Obtener todas las FAQs',
    description: 'Listar todas las preguntas frecuentes disponibles (endpoint público).',
  })
  @ApiResponse({ status: 200, description: 'Lista de FAQs obtenida exitosamente' })
  @Get()
  findAll() {
    return this.faqService.findAllFaqs();
  }

  @ApiOperation({
    summary: 'Obtener FAQ por ID',
    description: 'Obtener una pregunta frecuente específica por su ID.',
  })
  @ApiParam({ name: 'id', description: 'ID de la FAQ', example: 1 })
  @ApiResponse({ status: 200, description: 'FAQ encontrada exitosamente' })
  @ApiResponse({ status: 404, description: 'FAQ no encontrada' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.findOneFaq(id);
  }

  @ApiOperation({
    summary: 'Crear nueva FAQ',
    description: 'Crear una nueva pregunta frecuente (solo administradores).',
  })
  @ApiBearerAuth('access-token')
  @ApiBody({
    description: 'Datos de la FAQ',
    examples: {
      horarios: {
        summary: 'FAQ sobre horarios',
        value: {
          pregunta: '¿Cuáles son los horarios de atención?',
          respuesta: 'Lunes a viernes de 8:00 AM a 6:00 PM',
          grupoId: 1,
        },
      },
      servicios: {
        summary: 'FAQ sobre servicios',
        value: {
          pregunta: '¿Qué servicios ofrecen?',
          respuesta: 'Ofrecemos desarrollo de software, consultoría IT y soporte técnico',
          grupoId: 2,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'FAQ creada exitosamente' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden crear FAQs' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any, @Headers('authorization') auth: string) {
    return this.faqService.createFaq(body, this.extractToken(auth));
  }

  @ApiOperation({
    summary: 'Actualizar FAQ',
    description: 'Actualizar una pregunta frecuente existente (solo administradores).',
  })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: 'ID de la FAQ a actualizar', example: 1 })
  @ApiBody({
    description: 'Datos actualizados de la FAQ',
    examples: {
      actualizacion: {
        summary: 'Actualizar respuesta',
        value: {
          respuesta: 'Lunes a viernes de 8:00 AM a 6:00 PM, sábados de 9:00 AM a 2:00 PM',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'FAQ actualizada exitosamente' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden actualizar FAQs' })
  @ApiResponse({ status: 404, description: 'FAQ no encontrada' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
    return this.faqService.updateFaq(id, body, this.extractToken(auth));
  }

  @ApiOperation({
    summary: 'Eliminar FAQ',
    description: 'Eliminar una pregunta frecuente (solo administradores).',
  })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: 'ID de la FAQ a eliminar', example: 1 })
  @ApiResponse({ status: 200, description: 'FAQ eliminada exitosamente' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden eliminar FAQs' })
  @ApiResponse({ status: 404, description: 'FAQ no encontrada' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') auth: string,
  ) {
    return this.faqService.removeFaq(id, this.extractToken(auth));
  }

  // --------- GRUPOS FAQ ---------

  @ApiOperation({
    summary: 'Obtener grupos de FAQ',
    description: 'Listar todos los grupos de preguntas frecuentes.',
  })
  @ApiResponse({ status: 200, description: 'Lista de grupos obtenida exitosamente' })
  @Get('/grupo-faq')
  findAllGroups() {
    return this.faqService.findAllGrupos();
  }

  @ApiOperation({
    summary: 'Obtener grupo de FAQ por ID',
    description: 'Obtener un grupo específico de preguntas frecuentes.',
  })
  @ApiParam({ name: 'id', description: 'ID del grupo', example: 1 })
  @ApiResponse({ status: 200, description: 'Grupo encontrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  @Get('/grupo-faq/:id')
  findOneGroup(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.findOneGrupo(id);
  }

  @ApiOperation({
    summary: 'Crear grupo de FAQ',
    description: 'Crear un nuevo grupo de preguntas frecuentes (solo administradores).',
  })
  @ApiBearerAuth('access-token')
  @ApiBody({
    description: 'Datos del grupo',
    examples: {
      grupo_general: {
        summary: 'Grupo general',
        value: {
          nombre: 'Información General',
          descripcion: 'Preguntas generales sobre la empresa',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Grupo creado exitosamente' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  @UseGuards(JwtAuthGuard)
  @Post('/grupo-faq')
  createGroup(@Body() body: any, @Headers('authorization') auth: string) {
    return this.faqService.createGrupo(body, this.extractToken(auth));
  }

  @ApiOperation({
    summary: 'Actualizar grupo de FAQ',
    description: 'Actualizar un grupo de preguntas frecuentes (solo administradores).',
  })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: 'ID del grupo a actualizar', example: 1 })
  @UseGuards(JwtAuthGuard)
  @Patch('/grupo-faq/:id')
  updateGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
    return this.faqService.updateGrupo(id, body, this.extractToken(auth));
  }

  @ApiOperation({
    summary: 'Eliminar grupo de FAQ',
    description: 'Eliminar un grupo de preguntas frecuentes (solo administradores).',
  })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: 'ID del grupo a eliminar', example: 1 })
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
