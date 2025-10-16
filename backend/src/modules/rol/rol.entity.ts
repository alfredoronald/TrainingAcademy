import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'rol' })
export class Rol {
  @PrimaryGeneratedColumn({ name: 'id_rol' })
  id_rol: number;

  @Column({ length: 50 })
  nombre_rol: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;
}
