import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Rol } from '../rol/rol.entity';
import { Permiso } from '../permiso/permiso.entity';

@Entity({ name: 'permiso_rol' })
export class PermisoRol {
  @PrimaryColumn({ name: 'id_rol', type: 'int' })
  id_rol: number;

  @PrimaryColumn({ name: 'id_permiso', type: 'int' })
  id_permiso: number;

  @ManyToOne(() => Rol, rol => rol.permisos)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @ManyToOne(() => Permiso, permiso => permiso.roles)
  @JoinColumn({ name: 'id_permiso' })
  permiso: Permiso;
}
