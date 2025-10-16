import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'permiso' })
export class Permiso {
  @PrimaryGeneratedColumn({ name: 'id_permiso' })
  id_permiso: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;
}
