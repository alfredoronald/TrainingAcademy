import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity({ name: 'puntaje' })
export class Puntos {
  @PrimaryGeneratedColumn({ name: 'id_puntaje' })
  id_puntaje: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ type: 'int', default: 0 })
  total_puntos_obtenidos: number;

  @Column({ type: 'int', default: 0 })
  total_puntos_usados: number;

  @Column({ type: 'int', default: 0 })
  total_saldo_puntos: number;

  @Column({ type: 'date', name: 'fecha_registro', nullable: true })
  fecha_registro: string;

  @Column({ type: 'text', nullable: true })
  detalle: string;
}
