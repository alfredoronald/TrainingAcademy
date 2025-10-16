import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ranking } from './ranking.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RankingService {
  constructor(@InjectRepository(Ranking) private repo: Repository<Ranking>) {}
  create(data: Partial<Ranking>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find({ relations: ['usuario','curso'] }); }
}
