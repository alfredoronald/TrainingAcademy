import { 
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Inscripcion } from '../inscripcion/inscripcion.entity';
import { ProgresoCurso } from '../progreso-curso/progreso-curso.entity';
import { Puntos } from '../puntaje/puntaje.entity';
import { Mensaje } from '../mensaje/mensaje.entity';
import { UsuarioInsignia } from '../usuario-insignia/usuario-insignia.entity';
import { DetalleRol } from '../detalle-rol/detalle-rol.entity';
import { Curso } from '../curso/curso.entity';

@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id_usuario: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ length: 255, unique: true })
  correo_electronico: string;

  @Column({ length: 255 })
  password: string;

  @CreateDateColumn({ name: 'fecha_ingreso', type: 'date' })
  fecha_ingreso: string;

  @OneToMany(() => Inscripcion, (i) => i.usuario)
  inscripciones: Inscripcion[];

  @OneToMany(() => ProgresoCurso, (p) => p.usuario)
  progresos: ProgresoCurso[];

  @OneToMany(() => Puntos, (pt) => pt.usuario)
  puntajes: Puntos[];

  @OneToMany(() => Mensaje, (m) => m.usuario)
  mensajes: Mensaje[];

  @OneToMany(() => UsuarioInsignia, (ui) => ui.usuario)
  insignias: UsuarioInsignia[];

  @OneToMany(() => DetalleRol, (detalleRol) => detalleRol.usuario)
  detalleRoles: DetalleRol[];

  // 🔹 Relación con los cursos dictados (si el usuario es docente)
  @OneToMany(() => Curso, (curso) => curso.docente)
  cursos_dictados: Curso[];
}
