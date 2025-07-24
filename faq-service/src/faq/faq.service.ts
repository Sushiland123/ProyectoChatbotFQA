import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFaqDto) {
    return this.prisma.preguntaFrecuente.create({
      data: {
        pregunta: dto.pregunta,
        respuesta: dto.respuesta,
        multimedia: dto.multimedia,
        grupoId: dto.grupoId,
      },
    });
  }

  findAll() {
    return this.prisma.preguntaFrecuente.findMany({
      include: {
        grupo: true,
      },
    });
  }

  async findOne(id: number) {
    const faq = await this.prisma.preguntaFrecuente.findUnique({
      where: { id },
      include: { grupo: true },
    });

    if (!faq) throw new NotFoundException('Pregunta no encontrada');
    return faq;
  }

  async update(id: number, dto: UpdateFaqDto) {
    await this.findOne(id); // lanza error si no existe

    return this.prisma.preguntaFrecuente.update({
      where: { id },
      data: {
        pregunta: dto.pregunta,
        respuesta: dto.respuesta,
        multimedia: dto.multimedia,
        grupoId: dto.grupoId,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // lanza error si no existe

    return this.prisma.preguntaFrecuente.delete({
      where: { id },
    });
  }
}
