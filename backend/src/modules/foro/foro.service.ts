import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Foro } from './foro.entity';
import { Mensaje } from '../mensaje/mensaje.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ForoService {
  constructor(
    @InjectRepository(Foro) private foroRepo: Repository<Foro>,
    @InjectRepository(Mensaje) private msgRepo: Repository<Mensaje>
  ) {}

  create(data: Partial<Foro>) { return this.foroRepo.save(this.foroRepo.create(data)); }
  findAll() { return this.foroRepo.find({ relations: ['mensajes'] }); }
  addMensaje(data: Partial<Mensaje>) { return this.msgRepo.save(this.msgRepo.create(data)); }
}
