import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsuarioModule } from './usuario/usuario.module';
import { CursoModule } from './curso/curso.module';
import { RolModule } from './rol/rol.module';
import { InscripcionModule } from './inscripcion/inscripcion.module';
import { TipoCursoModule } from './tipo-curso/tipo-curso.module';

@Module({
  imports: [
    DatabaseModule,
    UsuarioModule,
    CursoModule,
    RolModule,
    InscripcionModule,
    TipoCursoModule,
  ],
})
export class AppModule {}
