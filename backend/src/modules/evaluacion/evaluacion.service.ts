import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Evaluacion } from './evaluacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EvaluacionService {
  constructor(@InjectRepository(Evaluacion) private repo: Repository<Evaluacion>) {}
  create(data: Partial<Evaluacion>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find({ relations: ['modulo','usuario'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id_evaluacion: id }, relations: ['modulo','usuario'] }); }
  update(id: number, data: Partial<Evaluacion>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
}
