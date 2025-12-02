import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Curso } from '../curso/curso.entity';
import { Usuario } from '../usuario/usuario.entity';

@Entity({ name: 'evaluacion' })
export class Evaluacion {
  @PrimaryGeneratedColumn({ name: 'id_evaluacion' })
  id_evaluacion: number;

  // ✅ AGREGAR: Columna explícita para id_curso
  @Column({ name: 'id_curso' })
  id_curso: number;

  @ManyToOne(() => Curso, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_curso' })
  curso: Curso;

  // ✅ AGREGAR: Columna explícita para id_usuario
  @Column({ name: 'id_usuario' })
  id_usuario: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  calificacion: number;

  @Column({ length: 50, nullable: true })
  tipo_evaluacion: string;

  @Column({ type: 'varchar', length: 20, name: 'estado', default: 'REPROBADO' })
  estado: string;

  @Column({ type: 'date', nullable: true })
  fecha: string;
}