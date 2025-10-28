import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { Ranking } from './ranking.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Puntos } from '../puntaje/puntaje.entity'; // 👈 Importa Puntos

@Module({
  imports: [TypeOrmModule.forFeature([Ranking, Usuario, Puntos,])],
  controllers: [RankingController],
  providers: [RankingService],
  exports: [RankingService],
})
export class RankingModule {}
