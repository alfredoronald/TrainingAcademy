import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'insignia' })
export class Insignia {
  @PrimaryGeneratedColumn({ name: 'id_insignia' })
  id_insignia: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  criterio: string;
}
