import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgresoCurso } from './progreso-curso.entity';
import { ProgresoCursoService } from './progreso-curso.service';
import { ProgresoCursoController } from './progreso-curso.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProgresoCurso])],
  providers: [ProgresoCursoService],
  controllers: [ProgresoCursoController],
})
export class ProgresoCursoModule {}
