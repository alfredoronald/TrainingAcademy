import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCanjeDto {
  @IsInt()
  @IsNotEmpty()
  id_usuario: number;

  @IsInt()
  @IsNotEmpty()
  id_recompensa: number;
}