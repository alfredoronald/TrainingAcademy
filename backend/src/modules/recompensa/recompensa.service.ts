import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recompensa } from './recompensa.entity';
import { Canje } from '../canje/canje.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecompensaService {
  constructor(
    @InjectRepository(Recompensa) private repo: Repository<Recompensa>,
    @InjectRepository(Canje) private canjeRepo: Repository<Canje>
  ) {}

  create(data: Partial<Recompensa>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find(); }
  canjear(data: Partial<Canje>) { return this.canjeRepo.save(this.canjeRepo.create(data)); }
}
