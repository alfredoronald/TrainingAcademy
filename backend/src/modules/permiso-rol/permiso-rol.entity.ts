import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'permiso_rol' })
export class PermisoRol {
  @PrimaryColumn({ name: 'id_rol', type: 'int' })
  id_rol: number;

  @PrimaryColumn({ name: 'id_permiso', type: 'int' })
  id_permiso: number;
}
