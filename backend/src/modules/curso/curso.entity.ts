import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm'; 
import { Usuario } from '../usuario/usuario.entity';
import { TipoCurso } from '../tipo-curso/tipo-curso.entity';
import { HorarioCurso } from '../horario-curso/horario-curso.entity';
import { Modulo } from '../modulo/modulo.entity';
import { ProgresoCurso } from '../progreso-curso/progreso-curso.entity';
import { Foro } from '../foro/foro.entity';

@Entity({ name: 'curso' })
export class Curso {
  @PrimaryGeneratedColumn({ name: 'id_curso' })
  id_curso: number;

  @Column({ name: 'nombre_curso', length: 200 }) // Cambié de 100 a 200 para coincidir con tu BD
  nombre_curso: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true }) // Agregué nullable: true
  descripcion: string;

  @Column({ nullable: true }) // Agregué nullable: true
  duracion: number;

  @Column({ nullable: true }) // Agregué nullable: true
  cupos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) // Especificar tipo decimal
  costo: number;

  @Column({ length: 50, nullable: true }) // Agregué length y nullable
  modalidad: string;

  @Column({ 
    name: 'estado_disponibilidad',
    type: 'enum',
    enum: ['ACTIVO', 'INACTIVO'],
    default: 'ACTIVO'
  })
  estado_disponibilidad: string;

  @Column({ name: 'id_usuario_docente' }) // Columna para la FK
  id_usuario_docente: number;

  @Column({ name: 'id_tipo_curso' }) // Columna para la FK
  id_tipo_curso: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario_docente' })
  docente: Usuario;

  @ManyToOne(() => TipoCurso)
  @JoinColumn({ name: 'id_tipo_curso' })
  tipo_curso: TipoCurso;

  // Relación con Horarios
  @OneToMany(() => HorarioCurso, horario => horario.curso)
  horarios: HorarioCurso[];

  // Relación con Módulos
  @OneToMany(() => Modulo, modulo => modulo.curso)
  modulos: Modulo[];

  // 🆕 Relación con ProgresoCurso
  @OneToMany(() => ProgresoCurso, progresoCurso => progresoCurso.curso)
  progresos: ProgresoCurso[];
  @OneToMany(() => Foro, foro => foro.curso)
foros: Foro[];

}