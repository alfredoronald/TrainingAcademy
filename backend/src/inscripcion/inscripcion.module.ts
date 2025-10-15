import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from './inscripcion.entity';
import { Curso } from '../curso/curso.entity';
import { Usuario } from '../usuario/usuario.entity';
import { InscripcionService } from './inscripcion.service';
import { InscripcionController } from './inscripcion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion, Curso, Usuario])],
  providers: [InscripcionService],
  controllers: [InscripcionController],
  exports: [InscripcionService],
})
export class InscripcionModule {}
