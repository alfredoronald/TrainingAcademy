import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Curso } from '../curso/curso.entity';
import { Inscripcion } from '../inscripcion/inscripcion.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ length: 255, unique: true })
  correo_electronico: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_ingreso: Date;

  // Relación con Curso
  @OneToMany(() => Curso, (curso) => curso.usuario)
  cursos: Curso[];

  // Relación con Inscripcion
  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.usuario)
  inscripciones: Inscripcion[];
}
