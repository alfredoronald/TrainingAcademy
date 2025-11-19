import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Curso } from '../curso/curso.entity';
import { Mensaje } from '../mensaje/mensaje.entity';

@Entity('foro')
export class Foro {
  @PrimaryGeneratedColumn()
  id_foro: number;

  @ManyToOne(() => Curso, curso => curso.foros)
  @JoinColumn({ name: 'id_curso' })
  curso: Curso;

  @Column({ length: 200 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  fecha_creacion: Date;

  @OneToMany(() => Mensaje, mensaje => mensaje.foro)
  mensajes: Mensaje[];
}
