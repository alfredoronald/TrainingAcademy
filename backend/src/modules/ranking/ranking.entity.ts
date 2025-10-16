import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Curso } from '../curso/curso.entity';

@Entity({ name: 'ranking' })
export class Ranking {
  @PrimaryGeneratedColumn({ name: 'id_ranking' })
  id_ranking: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Curso, { nullable: true })
  @JoinColumn({ name: 'id_curso' })
  curso: Curso | null;

  @Column({ length: 50, nullable: true })
  tipo_ranking: string;

  @Column({ type: 'int', nullable: true })
  posicion: number;

  @Column({ type: 'date', name: 'fecha_generado', nullable: true })
  fecha_generado: string;
}
