import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGrupoFaqDto } from './dto/create-grupo-faq.dto';
import { UpdateGrupoFaqDto } from './dto/update-grupo-faq.dto';

@Injectable()
export class GrupoFaqService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateGrupoFaqDto) {
    return this.prisma.grupoFAQ.create({
      data: {
        nombre: dto.nombre,
      },
    });
  }

  findAll() {
    return this.prisma.grupoFAQ.findMany({
      include: {
        preguntas: true,
      },
    });
  }

  async findOne(id: number) {
    const grupo = await this.prisma.grupoFAQ.findUnique({
      where: { id },
      include: { preguntas: true },
    });

    if (!grupo) throw new NotFoundException('Grupo no encontrado');
    return grupo;
  }

  async update(id: number, dto: UpdateGrupoFaqDto) {
    await this.findOne(id);

    return this.prisma.grupoFAQ.update({
      where: { id },
      data: {
        nombre: dto.nombre,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.grupoFAQ.delete({
      where: { id },
    });
  }
}
