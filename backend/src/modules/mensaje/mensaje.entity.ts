import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Foro } from '../foro/foro.entity';
import { Usuario } from '../usuario/usuario.entity';

@Entity({ name: 'mensaje' })
export class Mensaje {
  @PrimaryGeneratedColumn({ name: 'id_mensaje' })
  id_mensaje: number;

  @ManyToOne(() => Foro, f => f.mensajes)
  @JoinColumn({ name: 'id_foro' })
  foro: Foro;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ type: 'text' })
  contenido: string;

  @Column({ type: 'date', name: 'fecha_envio', nullable: true })
  fecha_envio: string;

  @Column({ type: 'time', name: 'hora_envio', nullable: true })
  hora_envio: string;

  @Column({ type: 'int', name: 'id_mensaje_respuesta', nullable: true })
  id_mensaje_respuesta: number | null;
}
