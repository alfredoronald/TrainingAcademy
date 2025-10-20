import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { HorarioCurso } from '../horario-curso/horario-curso.entity';
import { Inscripcion } from '../inscripcion/inscripcion.entity';
import { Modulo } from '../modulo/modulo.entity';

@Entity({ name: 'curso' })
export class Curso {
  @PrimaryGeneratedColumn({ name: 'id_curso' })
  id_curso: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ length: 200 })
  nombre_curso: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 20, name: 'estado_disponibilidad', default: 'ACTIVO' })
  estado_disponibilidad: string;

  @Column({ type: 'int', nullable: true })
  duracion: number;

  @Column({ length: 50, nullable: true })
  modalidad: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costo: number;

  @Column({ type: 'int', nullable: true })
  cupos: number;

  @OneToMany(() => HorarioCurso, h => h.curso)
  horarios: HorarioCurso[];

  @OneToMany(() => Inscripcion, i => i.curso)
  inscripciones: Inscripcion[];

  @OneToMany(() => Modulo, m => m.curso)
  modulos: Modulo[];
}
