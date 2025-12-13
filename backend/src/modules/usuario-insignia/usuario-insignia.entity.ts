// src/modules/usuario-insignia/usuario-insignia.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Insignia } from '../insignia/insignia.entity';

@Entity({ name: 'usuario_insignia' })
export class UsuarioInsignia {
  @PrimaryGeneratedColumn({ name: 'id_usuario_insignia' })
  id_usuario_insignia: number;

  @Column({ name: 'id_usuario', type: 'integer' })
  id_usuario: number;

  @Column({ name: 'id_insignia', type: 'integer' })
  id_insignia: number;

  @Column({ name: 'fecha_obtencion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_obtencion: Date;

  // Relación ManyToOne con Usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.usuarioInsignias)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  // Relación ManyToOne con Insignia
  @ManyToOne(() => Insignia, (insignia) => insignia.usuarios)
  @JoinColumn({ name: 'id_insignia' })
  insignia: Insignia;
}