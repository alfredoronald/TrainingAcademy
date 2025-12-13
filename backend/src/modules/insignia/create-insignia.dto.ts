// src/modules/insignia/create-insignia.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateInsigniaDto {
  @IsString()
  nombre: string;  // El DTO usa 'nombre' (igual que la entidad)

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  criterio?: string;
}