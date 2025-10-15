import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Curso } from '../curso/curso.entity';

@Entity()
export class TipoCurso {
  @PrimaryGeneratedColumn()
  id_tipo_curso: number;

  @Column({ length: 100 })
  nombre_tipo_curso: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  // Relación ManyToOne con Curso
  @ManyToOne(() => Curso, { eager: true }) // Trae automáticamente los datos del curso
  @JoinColumn({ name: 'id_curso' }) // Columna en la tabla será id_curso
  curso: Curso;
}
