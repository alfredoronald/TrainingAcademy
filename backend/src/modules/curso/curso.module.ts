import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { Curso } from './curso.entity';
import { Usuario } from '../usuario/usuario.entity';
import { TipoCurso } from '../tipo-curso/tipo-curso.entity'; // <-- importante
import { Inscripcion } from '../inscripcion/inscripcion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Curso, Usuario, TipoCurso,Inscripcion ]), // <-- agrega TipoCurso
  ],
  providers: [CursoService],
  controllers: [CursoController],
  exports: [CursoService],
})
export class CursoModule {}
