import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Curso } from '../curso/curso.entity';
import { Usuario } from '../usuario/usuario.entity';

@Entity('progreso_curso')
export class ProgresoCurso {
  @PrimaryGeneratedColumn()
  id_progreso_curso: number;

  @Column({ name: 'id_curso' })
  id_curso: number;

  @Column({ name: 'id_usuario' })
  id_usuario: number;

  @Column({
    type: 'enum',
    enum: ['EN_PROGRESO', 'CANCELADO', 'COMPLETADO'],
    default: 'EN_PROGRESO',
    name: 'estado_curso'
  })
  estado_curso: string;

  @Column({ 
    type: 'decimal', 
    precision: 5, 
    scale: 2, 
    default: 0,
    name: 'porcentaje_avance' 
  })
  porcentaje_avance: number;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP',
    name: 'fecha_actualizacion' 
  })
  fecha_actualizacion: Date;

  // Relaciones corregidas
  @ManyToOne(() => Curso, curso => curso.progresos)
  @JoinColumn({ name: 'id_curso' })
  curso: Curso;

  @ManyToOne(() => Usuario, usuario => usuario.progresosCursos)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}