// src/modules/insignia/insignia.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioInsignia } from '../usuario-insignia/usuario-insignia.entity';

@Entity({ name: 'insignia' })
export class Insignia {
  @PrimaryGeneratedColumn({ 
    name: 'id_insignia',
    type: 'integer'
  })
  id_insignia: number;

  @Column({ 
    name: 'nombre',
    length: 100 
  })
  nombre: string;

  @Column({ 
    name: 'descripcion',
    type: 'text', 
    nullable: true 
  })
  descripcion: string | null;

  @Column({ 
    name: 'criterio',
    type: 'text', 
    nullable: true 
  })
  criterio: string | null;

  // Relación OneToMany con UsuarioInsignia
  @OneToMany(() => UsuarioInsignia, (usuarioInsignia) => usuarioInsignia.insignia)
  usuarios: UsuarioInsignia[];
}