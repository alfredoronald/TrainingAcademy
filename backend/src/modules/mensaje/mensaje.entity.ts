import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Foro } from '../foro/foro.entity';
import { Usuario } from '../usuario/usuario.entity';

@Entity('mensaje')
export class Mensaje {
  @PrimaryColumn({ name: 'id_mensaje', type: 'int' })
  id_mensaje: number;

  @Column({ name: 'id_foro', type: 'int' })
  id_foro: number;

  @Column({ name: 'id_usuario', type: 'int' })
  id_usuario: number;

  @Column({ name: 'contenido', type: 'text' })
  contenido: string;

  @Column({ 
    name: 'fecha_envio', 
    type: 'date', 
    default: () => 'CURRENT_DATE' 
  })
  fecha_envio: Date;

  @Column({ 
    name: 'hora_envio', 
    type: 'time', 
    default: () => 'CURRENT_TIME' 
  })
  hora_envio: string;

  @Column({ 
    name: 'id_mensaje_respuesta', 
    type: 'int', 
    nullable: true 
  })
  id_mensaje_respuesta: number;

  @ManyToOne(() => Foro, foro => foro.mensajes)
  @JoinColumn({ name: 'id_foro' })
  foro: Foro;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}