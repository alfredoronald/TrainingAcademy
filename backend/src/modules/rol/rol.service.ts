import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './rol.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolService {
  constructor(@InjectRepository(Rol) private repo: Repository<Rol>) {}

  create(data: Partial<Rol>) {
    const r = this.repo.create(data);
    return this.repo.save(r);
  }

  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOneBy({ id_rol: id }); }
  update(id: number, data: Partial<Rol>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
}
