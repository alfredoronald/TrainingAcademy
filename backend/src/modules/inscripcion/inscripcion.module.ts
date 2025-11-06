import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscripcionService } from './inscripcion.service';
import { InscripcionController } from './inscripcion.controller';
import { Inscripcion } from './inscripcion.entity';
import { Curso } from '../curso/curso.entity';
import { Pago } from '../pago/pago.entity';
import { ProgresoCurso } from '../progreso-curso/progreso-curso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inscripcion, Curso, Pago, ProgresoCurso])
  ],
  controllers: [InscripcionController],
  providers: [InscripcionService],
  exports: [InscripcionService]
})
export class InscripcionModule {}