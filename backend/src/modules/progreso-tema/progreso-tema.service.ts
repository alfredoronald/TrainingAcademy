import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgresoTema } from './progreso-tema.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProgresoTemaService {
  constructor(@InjectRepository(ProgresoTema) private repo: Repository<ProgresoTema>) {}
  create(data: Partial<ProgresoTema>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find({ relations: ['temario','usuario'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id_progreso_tema: id }, relations: ['temario','usuario'] }); }
  update(id: number, data: Partial<ProgresoTema>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
}
