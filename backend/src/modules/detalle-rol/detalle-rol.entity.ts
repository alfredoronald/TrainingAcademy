import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';  
import { Usuario } from '../usuario/usuario.entity';
import { Rol } from '../rol/rol.entity';

@Entity({ name: 'detalle_rol' })
export class DetalleRol {

  // 🔹 Clave primaria compuesta
  @PrimaryColumn({ name: 'id_usuario', type: 'int' })
  id_usuario: number;

  @PrimaryColumn({ name: 'id_rol', type: 'int' })
  id_rol: number;

  // 🔹 Relación hacia Usuario
  @ManyToOne(() => Usuario, usuario => usuario.detalleRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  // 🔹 Relación hacia Rol
  @ManyToOne(() => Rol, rol => rol.detalleRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;
}

