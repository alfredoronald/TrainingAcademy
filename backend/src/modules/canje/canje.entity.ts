import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Recompensa } from '../recompensa/recompensa.entity';

@Entity({ name: 'canje' })
export class Canje {
  @PrimaryGeneratedColumn({ name: 'id_canje' })
  id_canje: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Recompensa)
  @JoinColumn({ name: 'id_recompensa' })
  recompensa: Recompensa;

  @CreateDateColumn({ name: 'fecha_canje', type: 'date' })
  fecha_canje: string;
}
