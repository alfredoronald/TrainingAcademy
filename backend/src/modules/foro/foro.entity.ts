import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Curso } from '../curso/curso.entity';
import { Mensaje } from '../mensaje/mensaje.entity';

@Entity({ name: 'foro' })
export class Foro {
  @PrimaryGeneratedColumn({ name: 'id_foro' })
  id_foro: number;

  @OneToOne(() => Curso)
  @JoinColumn({ name: 'id_curso' })
  curso: Curso;

  @Column({ length: 200 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'date', name: 'fecha_creacion', nullable: true })
  fecha_creacion: string;

  @OneToMany(() => Mensaje, m => m.foro)
  mensajes: Mensaje[];
}
