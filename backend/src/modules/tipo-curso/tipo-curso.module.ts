import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCurso } from './tipo-curso.entity';
import { TipoCursoService } from './tipo-curso.service';
import { TipoCursoController } from './tipo-curso.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoCurso])],
  providers: [TipoCursoService],
  controllers: [TipoCursoController],
})
export class TipoCursoModule {}
