import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioCurso } from './horario-curso.entity';
import { HorarioCursoService } from './horario-curso.service';
import { HorarioCursoController } from './horario-curso.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioCurso])],
  providers: [HorarioCursoService],
  controllers: [HorarioCursoController],
})
export class HorarioCursoModule {}
