import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Canje } from '../canje/canje.entity';

@Entity('recompensa')
export class Recompensa {
  @PrimaryColumn({ name: 'id_recompensa' })
  id_recompensa: number;

  @Column({ name: 'nombre', length: 200 })
  nombre: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'puntos_requeridos' })
  puntos_requeridos: number;

  @Column({ name: 'criterio' })
  criterio: number;

  @OneToMany(() => Canje, canje => canje.recompensa)
  canjes: Canje[];
}