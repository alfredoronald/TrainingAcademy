import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HorarioCurso } from './horario-curso.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HorarioCursoService {
  constructor(@InjectRepository(HorarioCurso) private repo: Repository<HorarioCurso>) {}
  create(data: Partial<HorarioCurso>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOneBy({ id_horario_curso: id }); }
  update(id: number, data: Partial<HorarioCurso>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
}
