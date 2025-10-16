import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from './curso.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CursoService {
  constructor(@InjectRepository(Curso) private repo: Repository<Curso>) {}

  create(data: Partial<Curso>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find({ relations: ['horarios','modulos'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id_curso: id }, relations: ['horarios','modulos'] }); }
  update(id: number, data: Partial<Curso>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
}
