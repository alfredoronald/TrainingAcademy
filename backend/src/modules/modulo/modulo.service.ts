import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Modulo } from './modulo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ModuloService {
  constructor(@InjectRepository(Modulo) private repo: Repository<Modulo>) {}
  create(data: Partial<Modulo>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOneBy({ id_modulo: id }); }
  update(id: number, data: Partial<Modulo>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
}
