import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { HorarioCurso } from '../horario-curso/horario-curso.entity';
import { Inscripcion } from '../inscripcion/inscripcion.entity';
import { Modulo } from '../modulo/modulo.entity';

@Entity({ name: 'curso' })
export class Curso {
  @PrimaryGeneratedColumn({ name: 'id_curso' })
  id_curso: number;

  // 🔹 Relación con el docente (Usuario)
  // Muchos cursos pueden ser dictados por un mismo docente.
  @ManyToOne(() => Usuario, (usuario) => usuario.cursos_dictados, {
    nullable: false, // cada curso debe tener un docente
    onDelete: 'CASCADE', // si se elimina el docente, también se eliminan sus cursos
    onUpdate: 'CASCADE', // actualiza en cascada si cambia el id del docente
  })
  @JoinColumn({ name: 'id_docente' })
  docente: Usuario;

  @Column({ length: 200 })
  nombre_curso: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVO', 'INACTIVO'],
    name: 'estado_disponibilidad',
    default: 'ACTIVO',
  })
  estado_disponibilidad: string;

  @Column({ type: 'int', nullable: true })
  duracion: number;

  @Column({ length: 50, nullable: true })
  modalidad: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costo: number;

  @Column({ type: 'int', nullable: true })
  cupos: number;

  // 🔹 Relaciones con otras entidades
  @OneToMany(() => HorarioCurso, (h) => h.curso)
  horarios: HorarioCurso[];

  @OneToMany(() => Inscripcion, (i) => i.curso)
  inscripciones: Inscripcion[];

  @OneToMany(() => Modulo, (m) => m.curso)
  modulos: Modulo[];
}
