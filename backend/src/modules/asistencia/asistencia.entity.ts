import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Curso } from '../curso/curso.entity';
import { HorarioCurso } from '../horario-curso/horario-curso.entity';

@Entity({ name: 'asistencia' })
export class Asistencia {
  @PrimaryGeneratedColumn({ name: 'id_asistencia' })
  id_asistencia: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Curso)
  @JoinColumn({ name: 'id_curso' })
  curso: Curso;

  @ManyToOne(() => HorarioCurso)
  @JoinColumn({ name: 'id_horario_curso' })
  horario: HorarioCurso;

  @Column({ type: 'varchar', length: 20, name: 'estado', default: 'AUSENTE' })
  estado: string;

  @CreateDateColumn({ type: 'date' })
  fecha: string;
}
