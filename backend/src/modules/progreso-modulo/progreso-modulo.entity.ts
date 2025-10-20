import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Modulo } from '../modulo/modulo.entity';
import { Usuario } from '../usuario/usuario.entity';

@Entity({ name: 'progreso_modulo' })
@Unique(['modulo','usuario'])
export class ProgresoModulo {
  @PrimaryGeneratedColumn({ name: 'id_progreso_modulo' })
  id_progreso_modulo: number;

  @ManyToOne(() => Modulo)
  @JoinColumn({ name: 'id_modulo' })
  modulo: Modulo;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 20, name: 'estado_evaluacion', default: 'PENDIENTE' })
  estado_evaluacion: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  porcentaje_avance: number;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fecha_actualizacion: string;
}
