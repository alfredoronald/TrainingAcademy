import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Inscripcion } from '../inscripcion/inscripcion.entity';

@Entity({ name: 'pago' })
export class Pago {
  @PrimaryGeneratedColumn({ name: 'id_pago' })
  id_pago: number;

  @ManyToOne(() => Inscripcion)
  @JoinColumn({ name: 'id_inscripcion' })
  inscripcion: Inscripcion;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'varchar', length: 20, name: 'metodo_pago', nullable: true })
  metodo_pago: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  descuento_aplicado: number;

  @CreateDateColumn({ name: 'fecha_pago', type: 'date' })
  fecha_pago: string;
}
