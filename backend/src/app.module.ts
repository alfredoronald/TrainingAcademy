import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth/auth.controller';
import { UsuarioService } from './modules/usuario/usuario.service';
import * as dotenv from 'dotenv';
dotenv.config();

// import all entities
import { Usuario } from './modules/usuario/usuario.entity';
import { Rol } from './modules/rol/rol.entity';
import { Permiso } from './modules/permiso/permiso.entity';
import { DetalleRol } from './modules/detalle-rol/detalle-rol.entity';
import { PermisoRol } from './modules/permiso-rol/permiso-rol.entity';
import { Curso } from './modules/curso/curso.entity';
import { HorarioCurso } from './modules/horario-curso/horario-curso.entity';
import { Asistencia } from './modules/asistencia/asistencia.entity';
import { TipoCurso } from './modules/tipo-curso/tipo-curso.entity';
import { Inscripcion } from './modules/inscripcion/inscripcion.entity';
import { Pago } from './modules/pago/pago.entity';
import { ProgresoCurso } from './modules/progreso-curso/progreso-curso.entity';
import { Modulo } from './modules/modulo/modulo.entity';
import { ProgresoModulo } from './modules/progreso-modulo/progreso-modulo.entity';
import { Temario } from './modules/temario/temario.entity';
import { ProgresoTema } from './modules/progreso-tema/progreso-tema.entity';
import { Foro } from './modules/foro/foro.entity';
import { Mensaje } from './modules/mensaje/mensaje.entity';
import { Evaluacion } from './modules/evaluacion/evaluacion.entity';
import { Puntos } from './modules/puntaje/puntaje.entity';
import { Recompensa } from './modules/recompensa/recompensa.entity';
import { Canje } from './modules/canje/canje.entity';
import { Ranking } from './modules/ranking/ranking.entity';
import { Insignia } from './modules/insignia/insignia.entity';
import { UsuarioInsignia } from './modules/usuario-insignia/usuario-insignia.entity';

// import modules
import { UsuarioModule } from './modules/usuario/usuario.module';
import { RolModule } from './modules/rol/rol.module';
import { PermisoModule } from './modules/permiso/permiso.module';
import { DetalleRolModule } from './modules/detalle-rol/detalle-rol.module';
import { PermisoRolModule } from './modules/permiso-rol/permiso-rol.module';
import { CursoModule } from './modules/curso/curso.module';
import { HorarioCursoModule } from './modules/horario-curso/horario-curso.module';
import { AsistenciaModule } from './modules/asistencia/asistencia.module';
import { TipoCursoModule } from './modules/tipo-curso/tipo-curso.module';
import { InscripcionModule } from './modules/inscripcion/inscripcion.module';
import { PagoModule } from './modules/pago/pago.module';
import { ProgresoCursoModule } from './modules/progreso-curso/progreso-curso.module';
import { ModuloModule } from './modules/modulo/modulo.module';
import { ProgresoModuloModule } from './modules/progreso-modulo/progreso-modulo.module';
import { TemarioModule } from './modules/temario/temario.module';
import { ProgresoTemaModule } from './modules/progreso-tema/progreso-tema.module';
import { ForoModule } from './modules/foro/foro.module';
import { MensajeModule } from './modules/mensaje/mensaje.module';
import { EvaluacionModule } from './modules/evaluacion/evaluacion.module';
import { PuntajeModule } from './modules/puntaje/puntaje.module';
import { RecompensaModule } from './modules/recompensa/recompensa.module';
import { CanjeModule } from './modules/canje/canje.module';
import { RankingModule } from './modules/ranking/ranking.module';
import { InsigniaModule } from './modules/insignia/insignia.module';
import { UsuarioInsigniaModule } from './modules/usuario-insignia/usuario-insignia.module';
import { AuthModule } from './auth/auth.module';
import { ReportesModule } from './modules/reportes/reportes.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'password',
      database: process.env.DB_NAME || 'training_academy',
      entities: [
        Usuario, Rol, Permiso, DetalleRol, PermisoRol, Curso, HorarioCurso, Asistencia, TipoCurso,
        Inscripcion, Pago, ProgresoCurso, Modulo, ProgresoModulo, Temario, ProgresoTema, Foro, Mensaje,
        Evaluacion, Puntos, Recompensa, Canje, Ranking, Insignia, UsuarioInsignia
      ],
      synchronize: false, // <<-- sincronización automática
      logging: false
    }),
    UsuarioModule, RolModule, PermisoModule, DetalleRolModule, PermisoRolModule,
    CursoModule, HorarioCursoModule, AsistenciaModule, TipoCursoModule, InscripcionModule,
    PagoModule, ProgresoCursoModule, ModuloModule, ProgresoModuloModule, TemarioModule,
    ProgresoTemaModule, ForoModule, MensajeModule, EvaluacionModule, PuntajeModule,
    RecompensaModule, CanjeModule, RankingModule, InsigniaModule, UsuarioInsigniaModule, ReportesModule,AuthModule
  
  ],

  controllers: [AuthController], // <<-- agrega tu controlador
   
})
export class AppModule {}