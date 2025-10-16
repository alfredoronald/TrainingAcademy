import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'recompensa' })
export class Recompensa {
  @PrimaryGeneratedColumn({ name: 'id_recompensa' })
  id_recompensa: number;

  @Column({ length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'int' })
  puntos_requeridos: number;

  @Column({ type: 'text', nullable: true })
  criterios: string;
}
