// src/modules/usuario-insignia/usuario-insignia.entity.ts
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Insignia } from '../insignia/insignia.entity';

@Entity({ name: 'usuario_insignia' })
export class UsuarioInsignia {
  // ⚠️ IMPORTANTE: Usa PrimaryColumn, NO PrimaryGeneratedColumn
  // Porque tu tabla tiene clave primaria compuesta (id_usuario + id_insignia)
  @PrimaryColumn({ name: 'id_usuario', type: 'integer' })
  id_usuario: number;

  @PrimaryColumn({ name: 'id_insignia', type: 'integer' })
  id_insignia: number;

  // ⚠️ IMPORTANTE: El nombre real es 'fecha_otorgada', no 'fecha_obtencion'
  // Y es tipo 'date', no 'timestamp'
  @Column({ 
    name: 'fecha_otorgada', 
    type: 'date', 
    nullable: true  // Es nullable según tu tabla
  })
  fecha_otorgada: Date;

  // Relación ManyToOne con Usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.usuarioInsignias)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  // Relación ManyToOne con Insignia
  @ManyToOne(() => Insignia, (insignia) => insignia.usuarios)
  @JoinColumn({ name: 'id_insignia' })
  insignia: Insignia;
}