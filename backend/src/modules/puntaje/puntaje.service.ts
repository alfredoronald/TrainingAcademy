import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Puntos } from './puntaje.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PuntajeService {
  constructor(@InjectRepository(Puntos) private repo: Repository<Puntos>) {}
  create(data: Partial<Puntos>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find({ relations: ['usuario'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id_puntaje: id }, relations: ['usuario'] }); }
  update(id: number, data: Partial<Puntos>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
}
