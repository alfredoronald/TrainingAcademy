import {
  IsString,
  IsInt,
  IsOptional,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateRolDto {
  @IsInt()
  @IsNotEmpty()
  id_rol: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre_rol: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}

export class UpdateRolDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  nombre_rol?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}

export class RolDto {
  id_rol: number;
  nombre_rol: string;
  descripcion?: string;
}
