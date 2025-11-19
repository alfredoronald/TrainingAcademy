import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Recompensa } from '../recompensa/recompensa.entity';

@Entity('canje')
export class Canje {
  @PrimaryGeneratedColumn({ name: 'id_canje' })
  id_canje: number;

  @Column({ name: 'id_usuario' })
  id_usuario: number;

  @Column({ name: 'id_recompensa' })
  id_recompensa: number;

  @Column({ name: 'fecha_canje', type: 'date', default: () => 'CURRENT_DATE' })
  fecha_canje: string;

  // 🆕 COLUMNAS NUEVAS
  @Column({ name: 'utilizado', type: 'boolean', default: false })
  utilizado: boolean;

  @Column({ name: 'estado', type: 'varchar', length: 20, default: 'ACTIVO' })
  estado: string;

  @Column({ name: 'fecha_uso', type: 'date', nullable: true })
  fecha_uso: string;

  // Solo la relación con Recompensa (quita Usuario si no existe)
  @ManyToOne(() => Recompensa, recompensa => recompensa.canjes)
  @JoinColumn({ name: 'id_recompensa' })
  recompensa: Recompensa;

  // 🚫 QUITA ESTA LÍNEA si no tienes la propiedad 'canjes' en Usuario
  // @ManyToOne(() => Usuario, usuario => usuario.canjes)
  // @JoinColumn({ name: 'id_usuario' })
  // usuario: Usuario;
}