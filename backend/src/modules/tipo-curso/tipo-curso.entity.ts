// backend/src/modules/tipo-curso/tipo-curso.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Curso } from '../curso/curso.entity';

@Entity({ name: 'tipo_curso' })
export class TipoCurso {
  @PrimaryGeneratedColumn({ name: 'id_tipo_curso' })
  id_tipo_curso: number;

  @Column({ name: 'nombre_tipo_curso', length: 100 })
  nombre_tipo_curso: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @OneToMany(() => Curso, curso => curso.tipo_curso)
  cursos: Curso[];
}
