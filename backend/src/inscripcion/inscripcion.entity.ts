import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Curso } from '../curso/curso.entity';
import { Usuario } from '../usuario/usuario.entity';

// ✅ Exporta el enum
export enum EstadoInscripcion {
  ACTIVA = 'ACTIVA',
  CANCELADA = 'CANCELADA',
}

@Entity()
export class Inscripcion {
  @PrimaryGeneratedColumn()
  id_inscripcion: number;

  @ManyToOne(() => Curso)
  @JoinColumn({ name: 'id_curso' })
  curso: Curso;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({
    type: 'enum',
    enum: EstadoInscripcion,
    default: EstadoInscripcion.ACTIVA,
  })
  estado: EstadoInscripcion;

  @Column('decimal')
  precio: number;

  @Column('decimal')
  precio_final: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  fecha_inscripcion: Date;
}
