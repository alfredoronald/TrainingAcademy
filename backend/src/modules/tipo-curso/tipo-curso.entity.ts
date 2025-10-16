import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Curso } from '../curso/curso.entity';

@Entity({ name: 'tipo_curso' })
export class TipoCurso {
  @PrimaryGeneratedColumn({ name: 'id_tipo_curso' })
  id_tipo_curso: number;

  @ManyToOne(() => Curso, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_curso' })
  curso: Curso;

  @Column({ length: 100 })
  nombre_tipo_curso: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;
}
