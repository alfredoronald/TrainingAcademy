import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './curso.entity';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { Usuario } from '../usuario/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Curso, Usuario])],
  providers: [CursoService],
  controllers: [CursoController],
  exports: [CursoService],
})
export class CursoModule {}
