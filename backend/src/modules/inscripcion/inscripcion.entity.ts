import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Curso } from '../curso/curso.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Pago } from '../pago/pago.entity';

@Entity({ name: 'inscripcion' })
export class Inscripcion {
  @PrimaryGeneratedColumn({ name: 'id_inscripcion' })
  id_inscripcion: number;

  @Column({ name: 'id_curso' })
  id_curso: number;

  @Column({ name: 'id_usuario' })
  id_usuario: number;

  @Column()
  estado: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({ name: 'precio_final', type: 'decimal', precision: 10, scale: 2 })
  precio_final: number;

  @Column({ name: 'fecha_inscripcion', default: () => 'CURRENT_DATE' })
  fecha_inscripcion: Date;

  // Relaciones
  @ManyToOne(() => Curso)
  @JoinColumn({ name: 'id_curso' })
  curso: Curso;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @OneToMany(() => Pago, pago => pago.inscripcion)
  pagos: Pago[];
}
