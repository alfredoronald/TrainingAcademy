import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Curso } from '../curso/curso.entity';
import { Mensaje } from '../mensaje/mensaje.entity';

@Entity('foro')
export class Foro {
  @PrimaryColumn({ name: 'id_foro', type: 'int' })
  id_foro: number;

  @Column({ name: 'id_curso', type: 'int' })
  id_curso: number;

  @Column({ name: 'titulo', type: 'varchar', length: 200 })
  titulo: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;

  @Column({ 
    name: 'fecha_creacion', 
    type: 'date', 
    default: () => 'CURRENT_DATE' 
  })
  fecha_creacion: Date;

  @OneToMany(() => Mensaje, mensaje => mensaje.foro)
  mensajes: Mensaje[];
}