import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Curso } from '../curso/curso.entity';

@Entity({ name: 'horario_curso' })
export class HorarioCurso {
  @PrimaryGeneratedColumn({ name: 'id_horario_curso' })
  id_horario_curso: number;

  @ManyToOne(() => Curso, c => c.horarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_curso' })
  curso: Curso;

  @Column({ length: 15, nullable: true })
  dia_semana: string;

  @Column({ type: 'time', nullable: true })
  hora_inicio: string;

  @Column({ type: 'time', nullable: true })
  hora_fin: string;

  @Column({ type: 'date', nullable: true })
  fecha: string;

  @Column({ length: 50, nullable: true })
  modalidad_sesion: string;

  @Column({ length: 500, nullable: true })
  enlace_virtual: string;

  @Column({ length: 100, nullable: true })
  aula: string;
}
