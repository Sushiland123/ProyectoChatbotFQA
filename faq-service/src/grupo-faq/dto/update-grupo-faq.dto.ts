import { PartialType } from '@nestjs/mapped-types';
import { CreateGrupoFaqDto } from './create-grupo-faq.dto';

export class UpdateGrupoFaqDto extends PartialType(CreateGrupoFaqDto) {}
