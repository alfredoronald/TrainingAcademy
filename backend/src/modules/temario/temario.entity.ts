import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Modulo } from '../modulo/modulo.entity';

@Entity({ name: 'temario' })
export class Temario {
  @PrimaryGeneratedColumn({ name: 'id_temario' })
  id_temario: number;

  @ManyToOne(() => Modulo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_modulo' })
  modulo: Modulo;

  @Column({ length: 200 })
  nombre_tema: string;

  @Column({ type: 'text', nullable: true })
  descripcion_tema: string;

  @Column({ type: 'text', nullable: true })
  contenido_tema: string;

  @Column({ type: 'int' })
  orden_tema: number;
}
