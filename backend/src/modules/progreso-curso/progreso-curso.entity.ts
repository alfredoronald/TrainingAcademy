import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Curso } from '../curso/curso.entity';
import { Usuario } from '../usuario/usuario.entity';

@Entity({ name: 'progreso_curso' })
@Unique(['curso','usuario'])
export class ProgresoCurso {
  @PrimaryGeneratedColumn({ name: 'id_progreso_curso' })
  id_progreso_curso: number;

  @ManyToOne(() => Curso)
  @JoinColumn({ name: 'id_curso' })
  curso: Curso;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 20, name: 'estado_curso', default: 'EN_PROGRESO' })
  estado_curso: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  porcentaje_avance: number;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fecha_actualizacion: string;
}
