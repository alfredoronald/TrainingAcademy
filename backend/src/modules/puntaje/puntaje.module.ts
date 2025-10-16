import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Puntos } from './puntaje.entity';
import { PuntajeService } from './puntaje.service';
import { PuntajeController } from './puntaje.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Puntos])],
  providers: [PuntajeService],
  controllers: [PuntajeController],
})
export class PuntajeModule {}
