import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgresoCurso } from './progreso-curso.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProgresoCursoService {
  constructor(@InjectRepository(ProgresoCurso) private repo: Repository<ProgresoCurso>) {}
  create(data: Partial<ProgresoCurso>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find({ relations: ['curso','usuario'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id_progreso_curso: id }, relations: ['curso','usuario'] }); }
  update(id: number, data: Partial<ProgresoCurso>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
}
