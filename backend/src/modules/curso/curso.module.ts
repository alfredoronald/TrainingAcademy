import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './curso.entity';
import { HorarioCurso } from '../horario-curso/horario-curso.entity';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Curso, HorarioCurso])],
  providers: [CursoService],
  controllers: [CursoController],
  exports: [CursoService],
})
export class CursoModule {}
