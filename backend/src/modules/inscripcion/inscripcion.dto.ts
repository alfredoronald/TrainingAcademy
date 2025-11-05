import { IsInt, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateInscripcionDto {
  @IsInt()
  @IsNotEmpty()
  id_curso: number;

  @IsInt()
  @IsNotEmpty()
  id_usuario: number;

  @IsOptional()
  @IsEnum(['TARJETA', 'TRANSFERENCIA', 'BILLETERA'])
  metodo_pago?: string;
}