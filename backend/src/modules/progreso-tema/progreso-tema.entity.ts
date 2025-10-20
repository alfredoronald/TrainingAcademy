import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Temario } from '../temario/temario.entity';
import { Usuario } from '../usuario/usuario.entity';

@Entity({ name: 'progreso_tema' })
@Unique(['temario','usuario'])
export class ProgresoTema {
  @PrimaryGeneratedColumn({ name: 'id_progreso_tema' })
  id_progreso_tema: number;

  @ManyToOne(() => Temario)
  @JoinColumn({ name: 'id_temario' })
  temario: Temario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 20, name: 'estado', default: 'PENDIENTE' })
  estado: string;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fecha_actualizacion: string;
}
