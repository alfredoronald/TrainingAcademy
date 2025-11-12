import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Recompensa } from '../recompensa/recompensa.entity';

@Entity('canje')
export class Canje {
  @PrimaryGeneratedColumn({ name: 'id_canje' }) // ← PrimaryGeneratedColumn
  id_canje: number;

  @Column({ name: 'id_usuario' })
  id_usuario: number;

  @Column({ name: 'id_recompensa' })
  id_recompensa: number;

  @Column({ name: 'fecha_canje', type: 'date', default: () => 'CURRENT_DATE' })
  fecha_canje: string;

  @ManyToOne(() => Recompensa, recompensa => recompensa.canjes)
  @JoinColumn({ name: 'id_recompensa' })
  recompensa: Recompensa;
}