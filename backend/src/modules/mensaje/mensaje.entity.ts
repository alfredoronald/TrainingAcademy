import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Foro } from '../foro/foro.entity';

@Entity({ name: 'mensaje' })
export class Mensaje {

  @PrimaryGeneratedColumn({ name: 'id_mensaje' })
  id_mensaje: number;

  @Column({ type: 'text', name: 'contenido' }) // ⚠ nombre exacto
  contenido: string;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_publicacion' })
  fecha_publicacion: Date;

  @ManyToOne(() => Foro, foro => foro.mensajes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_foro' })
  foro: Foro;

  @ManyToOne(() => Usuario, usuario => usuario.mensajes, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
