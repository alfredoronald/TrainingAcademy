import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Curso } from '../curso/curso.entity';
import { Usuario } from '../usuario/usuario.entity';

@Entity({ name: 'inscripcion' })
@Unique(['curso','usuario'])
export class Inscripcion {
  @PrimaryGeneratedColumn({ name: 'id_inscripcion' })
  id_inscripcion: number;

 @ManyToOne(() => Curso)
@JoinColumn({ name: 'id_curso' })
curso: Curso;

  @ManyToOne(() => Usuario, u => u.inscripciones)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 20, name: 'estado', default: 'ACTIVA' })
  estado: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_final: number;

  @Column({ type: 'date', name: 'fecha_inscripcion', nullable: true })
  fecha_inscripcion: string;
}
