import { Entity, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Insignia } from '../insignia/insignia.entity';

@Entity({ name: 'usuario_insignia' })
export class UsuarioInsignia {
  @PrimaryColumn({ name: 'id_usuario', type: 'int' })
  id_usuario: number;

  @PrimaryColumn({ name: 'id_insignia', type: 'int' })
  id_insignia: number;

  @CreateDateColumn({ name: 'fecha_otorgada', type: 'date' })
  fecha_otorgada: string;

  // optional relations
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario?: Usuario;

  @ManyToOne(() => Insignia)
  @JoinColumn({ name: 'id_insignia' })
  insignia?: Insignia;
}
