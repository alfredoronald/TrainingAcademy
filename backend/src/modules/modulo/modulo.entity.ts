import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Curso } from '../curso/curso.entity';
import { Temario } from '../temario/temario.entity';

@Entity({ name: 'modulo' })
export class Modulo {
  @PrimaryGeneratedColumn({ name: 'id_modulo' })
  id_modulo: number;

  @ManyToOne(() => Curso, c => c.modulos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_curso' })
  curso: Curso;

  @Column({ length: 200 })
  nombre_modulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion_modulo: string;

  @Column({ type: 'int' })
  orden_modulo: number;

  @OneToMany(() => Temario, t => t.modulo)
  temarios: Temario[];
}
