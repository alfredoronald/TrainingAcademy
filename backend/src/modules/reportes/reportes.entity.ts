import { Entity, Column } from 'typeorm';

@Entity()
export class Reporte {
  @Column()
  nombre: string;

  @Column('decimal')
  valor: number;
}