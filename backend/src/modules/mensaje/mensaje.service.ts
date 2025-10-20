import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mensaje } from './mensaje.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MensajeService {
  constructor(@InjectRepository(Mensaje) private repo: Repository<Mensaje>) {}
  create(data: Partial<Mensaje>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find({ relations: ['foro','usuario'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id_mensaje: id }, relations: ['foro','usuario'] }); }
  update(id: number, data: Partial<Mensaje>) { return this.repo.update(id,data); }
  remove(id: number) { return this.repo.delete(id); }
}
