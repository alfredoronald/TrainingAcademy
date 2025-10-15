import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { EstadoDisponibilidad } from './estado.enum'; // ⚠️ debe apuntar al enum exportado

@Entity()
export class Curso {
  @PrimaryGeneratedColumn()
  id_curso: number;

  @Column({ length: 200 })
  nombre_curso: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: EstadoDisponibilidad,  // ⚠️ aquí usamos el enum
    default: EstadoDisponibilidad.ACTIVO, // ⚠️ default también usa el enum
  })
  estado_disponibilidad: EstadoDisponibilidad;

  @Column({ type: 'int', nullable: true })
  duracion: number;

  @Column({ length: 50, nullable: true })
  modalidad: string;

  @Column({ type: 'decimal', default: 0 })
  costo: number;

  @Column({ type: 'int', nullable: true })
  cupos: number;

   @ManyToOne(() => Usuario, usuario => usuario.cursos)
@JoinColumn({ name: 'id_usuario' })
usuario: Usuario;
}
