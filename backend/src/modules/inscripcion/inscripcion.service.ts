import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inscripcion } from './inscripcion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InscripcionService {
  constructor(@InjectRepository(Inscripcion) private repo: Repository<Inscripcion>) {}
  create(data: Partial<Inscripcion>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find({ relations: ['curso','usuario'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id_inscripcion: id }, relations: ['curso','usuario'] }); }
  update(id: number, data: Partial<Inscripcion>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
}
