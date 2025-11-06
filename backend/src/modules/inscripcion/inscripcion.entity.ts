import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Unique, BeforeInsert } from 'typeorm';
import { Curso } from '../curso/curso.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Pago } from '../pago/pago.entity';

@Entity({ name: 'inscripcion' })
@Unique(['curso', 'usuario'])
export class Inscripcion {
  @PrimaryColumn({ name: 'id_inscripcion' })
  id_inscripcion: number;

  @Column({ name: 'id_curso' })
  id_curso: number;

  @Column({ name: 'id_usuario' })
  id_usuario: number;

  @ManyToOne(() => Curso)
  @JoinColumn({ name: 'id_curso' })
  curso: Curso;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 20, name: 'estado', default: 'ACTIVA' })
  estado: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_final: number;

  @Column({ type: 'date', name: 'fecha_inscripcion', nullable: true })
  fecha_inscripcion: string;

  @BeforeInsert()
  async setId() {
    // TypeORM manejará esto con la query que hagamos en el service
  }
}
