import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { TipoCurso } from '../tipo-curso/tipo-curso.entity';

@Entity({ name: 'curso' })
export class Curso {
  @PrimaryGeneratedColumn({ name: 'id_curso' })
  id_curso: number;

  @Column({ length: 100 })
  nombre_curso: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column()
  duracion: number;

  @Column()
  cupos: number;

  @Column()
  costo: number;

  @Column()
  modalidad: string;

  @Column()
  estado_disponibilidad: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_docente' })
  docente: Usuario;

  @ManyToOne(() => TipoCurso, { cascade: true }) // <- curso tiene un tipo
  @JoinColumn({ name: 'id_tipo_curso' })
  tipo_curso: TipoCurso;
}
