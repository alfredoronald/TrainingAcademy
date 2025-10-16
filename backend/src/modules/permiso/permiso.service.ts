import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permiso } from './permiso.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermisoService {
  constructor(@InjectRepository(Permiso) private repo: Repository<Permiso>) {}
  create(data: Partial<Permiso>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOneBy({ id_permiso: id }); }
  update(id: number, data: Partial<Permiso>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
}
