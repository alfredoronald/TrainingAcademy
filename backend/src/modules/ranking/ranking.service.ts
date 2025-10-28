import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking } from './ranking.entity';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Ranking)
    private repo: Repository<Ranking>,
  ) {}

  create(b: any) {
    return this.repo.save(b);
  }

  findAll() {
    return this.repo.find({
      relations: ['usuario'],
      order: {
        tipo_ranking: 'ASC',
        posicion: 'ASC',
      },
    });
  }

  async findGlobalByPoints() {
    try {
      console.log('🔍 Buscando rankings globales por puntos...');
      
      const rankings = await this.repo.find({
        where: { tipo_ranking: 'global_puntos' },
        relations: ['usuario'],
        order: { posicion: 'ASC' },
        take: 10,
      });

      console.log(`📊 Encontrados ${rankings.length} rankings globales por puntos`);
      return rankings;

    } catch (error) {
      console.error('❌ Error en findGlobalByPoints:', error);
      throw error;
    }
  }

  async findGlobalByCalificaciones() {
    try {
      console.log('🔍 Buscando rankings globales por calificaciones...');
      
      const rankings = await this.repo.find({
        where: { tipo_ranking: 'global_calificaciones' },
        relations: ['usuario'],
        order: { posicion: 'ASC' },
        take: 10,
      });

      console.log(`📊 Encontrados ${rankings.length} rankings globales por calificaciones`);
      return rankings;

    } catch (error) {
      console.error('❌ Error en findGlobalByCalificaciones:', error);
      throw error;
    }
  }
}

