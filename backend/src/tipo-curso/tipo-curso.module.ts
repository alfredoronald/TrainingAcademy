import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCurso } from './tipo_curso.entity';
import { Curso } from '../curso/curso.entity';
import { TipoCursoService } from './tipo_curso.service';
import { TipoCursoController } from './tipo_curso.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoCurso, Curso])],
  providers: [TipoCursoService],
  controllers: [TipoCursoController],
  exports: [TipoCursoService],
})
export class TipoCursoModule {}