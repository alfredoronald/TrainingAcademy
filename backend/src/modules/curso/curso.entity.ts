import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm'; 
import { Usuario } from '../usuario/usuario.entity';
import { TipoCurso } from '../tipo-curso/tipo-curso.entity';
import { HorarioCurso } from '../horario-curso/horario-curso.entity';
import { Modulo } from '../modulo/modulo.entity';
import { ProgresoCurso } from '../progreso-curso/progreso-curso.entity';

@Entity({ name: 'curso' })
export class Curso {
  @PrimaryGeneratedColumn({ 
    name: 'id_curso',
    type: 'integer'
  })
  id_curso: number;

  @Column({ name: 'nombre_curso', length: 200 })
  nombre_curso: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  duracion: number;

  @Column({ nullable: true })
  cupos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costo: number;

  @Column({ length: 50, nullable: true })
  modalidad: string;

  @Column({ 
    name: 'estado_disponibilidad',
    type: 'enum',
    enum: ['ACTIVO', 'INACTIVO'],
    default: 'ACTIVO'
  })
  estado_disponibilidad: string;

  @Column({ name: 'id_usuario_docente' })
  id_usuario_docente: number;

  @Column({ name: 'id_tipo_curso' })
  id_tipo_curso: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario_docente' })
  docente: Usuario;

  @ManyToOne(() => TipoCurso)
  @JoinColumn({ name: 'id_tipo_curso' })
  tipo_curso: TipoCurso;

  @OneToMany(() => HorarioCurso, horario => horario.curso)
  horarios: HorarioCurso[];

  @OneToMany(() => Modulo, modulo => modulo.curso)
  modulos: Modulo[];

  @OneToMany(() => ProgresoCurso, progresoCurso => progresoCurso.curso)
  progresos: ProgresoCurso[];
}