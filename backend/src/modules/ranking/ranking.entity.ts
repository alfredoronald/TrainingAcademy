import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity({ name: 'ranking' })
export class Ranking {
  // ❌ REMOVER PrimaryGeneratedColumn
  // ✅ Usar PrimaryColumn para columnas compuestas o sin autoincrement
  @PrimaryColumn({ name: 'tipo_ranking' })
  tipo_ranking: string;

  @PrimaryColumn({ name: 'id_usuario' })
  id_usuario: number;

  @PrimaryColumn({ name: 'posicion' })
  posicion: number;

  @Column({ type: 'date', name: 'fecha_generado' })
  fecha_generado: string;

  // Relación con Usuario
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}

