import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Permiso {
    @PrimaryGeneratedColumn()
    id_permiso: number;

    @Column({ length: 100, nullable: false })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;
}