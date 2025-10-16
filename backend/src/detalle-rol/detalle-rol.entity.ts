import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'detalle_rol' })
export class DetalleRol {
  @PrimaryColumn({ name: 'id_usuario', type: 'int' })
  id_usuario: number;

  @PrimaryColumn({ name: 'id_rol', type: 'int' })
  id_rol: number;
}
