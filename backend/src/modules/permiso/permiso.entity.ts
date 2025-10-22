import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Rol } from '../rol/rol.entity';

@Entity({ name: 'permiso' })
export class Permiso {
  @PrimaryGeneratedColumn({ name: 'id_permiso' })
  id_permiso: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ManyToMany(() => Rol, rol => rol.permisos)
  roles: Rol[];

}
