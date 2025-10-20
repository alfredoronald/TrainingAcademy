import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Insignia } from './insignia.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InsigniaService {
  constructor(@InjectRepository(Insignia) private repo: Repository<Insignia>) {}
  create(data: Partial<Insignia>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOneBy({ id_insignia: id }); }
  update(id: number, data: Partial<Insignia>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
}
