// curso.dto.ts
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export enum ModalidadEnum {
  VIRTUAL = 'VIRTUAL',
  PRESENCIAL = 'PRESENCIAL',
  HIBRIDO = 'HIBRIDO',
}

export enum EstadoDisponibilidadEnum {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export class CreateCursoDto {
  @IsString()
  nombre_curso: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  costo: number;

  @IsNumber()
  duracion: number;

  @IsNumber()
  cupos: number;

  @IsEnum(ModalidadEnum)
  modalidad: ModalidadEnum;

  @IsNumber()
  id_docente: number;

  @IsEnum(EstadoDisponibilidadEnum)
  estado_disponibilidad: EstadoDisponibilidadEnum;

  // 🔹 nuevo campo opcional
  @IsOptional()
  @IsNumber()
  id_tipo_curso?: number;
}
