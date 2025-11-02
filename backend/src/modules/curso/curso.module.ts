import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { Curso } from './curso.entity';
import { Usuario } from '../usuario/usuario.entity';
import { TipoCurso } from '../tipo-curso/tipo-curso.entity'; // <-- importante

@Module({
  imports: [
    TypeOrmModule.forFeature([Curso, Usuario, TipoCurso]), // <-- agrega TipoCurso
  ],
  providers: [CursoService],
  controllers: [CursoController],
})
export class CursoModule {}
