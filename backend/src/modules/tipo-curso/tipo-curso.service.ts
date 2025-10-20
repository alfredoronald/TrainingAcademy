import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoCurso } from './tipo-curso.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoCursoService {
  constructor(@InjectRepository(TipoCurso) private repo: Repository<TipoCurso>) {}
  create(data: Partial<TipoCurso>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOneBy({ id_tipo_curso: id }); }
  update(id: number, data: Partial<TipoCurso>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
}
