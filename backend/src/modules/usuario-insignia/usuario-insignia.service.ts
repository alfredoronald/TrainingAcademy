import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioInsignia } from './usuario-insignia.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioInsigniaService {
  constructor(@InjectRepository(UsuarioInsignia) private repo: Repository<UsuarioInsignia>) {}
  create(data: Partial<UsuarioInsignia>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find(); }
  remove(id_usuario: number, id_insignia: number) { return this.repo.delete({ id_usuario, id_insignia }); }
}
