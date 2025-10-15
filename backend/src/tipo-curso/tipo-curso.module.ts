import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCurso } from './tipo-curso.entity';
import { Curso } from '../curso/curso.entity';
import { TipoCursoService } from './tipo-curso.service';
import { TipoCursoController } from './tipo-curso.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoCurso, Curso])],
  providers: [TipoCursoService],
  controllers: [TipoCursoController],
  exports: [TipoCursoService],
})
export class TipoCursoModule {}
