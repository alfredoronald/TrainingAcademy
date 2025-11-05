import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Inscripcion } from '../inscripcion/inscripcion.entity';

@Entity({ name: 'pago' })
export class Pago {
  @PrimaryGeneratedColumn({ name: 'id_pago' })
  id_pago: number;

  @Column({ name: 'id_inscripcion' })
  id_inscripcion: number;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'enum', enum: ['TARJETA', 'TRANSFERENCIA', 'BILLETERA'] })
  metodo_pago: string;

  @Column({ name: 'descuento_aplicado', type: 'decimal', precision: 10, scale: 2, default: 0 })
  descuento_aplicado: number;

  @Column({ name: 'fecha_pago', default: () => 'CURRENT_DATE' })
  fecha_pago: Date;

  // Relación
  @ManyToOne(() => Inscripcion, inscripcion => inscripcion.pagos)
  @JoinColumn({ name: 'id_inscripcion' })
  inscripcion: Inscripcion;
}
