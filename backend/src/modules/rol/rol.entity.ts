import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DetalleRol } from '../detalle-rol/detalle-rol.entity';
import { Permiso } from '../permiso/permiso.entity';
import { ManyToMany, JoinTable } from 'typeorm';

@Entity({ name: 'rol' })
export class Rol {
  @PrimaryGeneratedColumn({ name: 'id_rol' })
  id_rol: number;

  @Column({ length: 50 })
  nombre_rol: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @OneToMany(() => DetalleRol, detalle => detalle.rol)
  detalleRoles: DetalleRol[];

  @ManyToMany(() => Permiso, permiso => permiso.roles)
@JoinTable({
  name: 'permiso_rol',
  joinColumn: { name: 'id_rol', referencedColumnName: 'id_rol' },
  inverseJoinColumn: { name: 'id_permiso', referencedColumnName: 'id_permiso' },
})
permisos: Permiso[];

}
