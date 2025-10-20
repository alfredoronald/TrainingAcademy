import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from './inscripcion.entity';
import { InscripcionService } from './inscripcion.service';
import { InscripcionController } from './inscripcion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion])],
  providers: [InscripcionService],
  controllers: [InscripcionController],
})
export class InscripcionModule {}
