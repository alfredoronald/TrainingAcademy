import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Canje } from './canje.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CanjeService {
  constructor(@InjectRepository(Canje) private repo: Repository<Canje>) {}
  create(data: Partial<Canje>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find({ relations: ['usuario','recompensa'] }); }
}
