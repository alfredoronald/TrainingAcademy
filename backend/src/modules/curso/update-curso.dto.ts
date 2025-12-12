import { PartialType } from '@nestjs/mapped-types';
import { CreateCursoDto } from './curso.dto';

export class UpdateCursoDto extends PartialType(CreateCursoDto) {}
