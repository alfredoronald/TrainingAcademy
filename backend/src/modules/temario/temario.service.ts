import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Temario } from './temario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TemarioService {
  constructor(@InjectRepository(Temario) private repo: Repository<Temario>) {}
  create(data: Partial<Temario>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOneBy({ id_temario: id }); }
  update(id: number, data: Partial<Temario>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
}
