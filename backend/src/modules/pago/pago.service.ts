import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './pago.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PagoService {
  constructor(@InjectRepository(Pago) private repo: Repository<Pago>) {}
  create(data: Partial<Pago>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find({ relations: ['inscripcion'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id_pago: id }, relations: ['inscripcion'] }); }
  update(id: number, data: Partial<Pago>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
}
