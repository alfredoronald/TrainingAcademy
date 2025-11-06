import { 
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
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
  @PrimaryColumn({ name: 'id_usuario' })
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
  progresosCursos: ProgresoCurso[];

  @OneToMany(() => Puntos, (pt) => pt.usuario)
  puntajes: Puntos[];

  @OneToMany(() => Mensaje, (m) => m.usuario)
  mensajes: Mensaje[];

  @OneToMany(() => UsuarioInsignia, (ui) => ui.usuario)
  usuarioInsignias: UsuarioInsignia[]; // ✅ Cambié el nombre para consistencia

  @OneToMany(() => DetalleRol, (detalleRol) => detalleRol.usuario)
  detalleRoles: DetalleRol[];

  @OneToMany(() => Curso, (curso) => curso.docente)
  cursos_dictados: Curso[];

  @BeforeInsert()
  async setId() {
    // Se manejará en el service con query manual
  }
}