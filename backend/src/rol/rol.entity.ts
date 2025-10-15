import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Rol {
  @PrimaryGeneratedColumn()
  id_rol: number;

  @Column({ length: 50 })
  nombre_rol: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;
}
