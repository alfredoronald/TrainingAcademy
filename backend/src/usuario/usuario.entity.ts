// src/usuario/usuario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ unique: true, length: 255 })
  correo_electronico: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_ingreso: Date;
}
