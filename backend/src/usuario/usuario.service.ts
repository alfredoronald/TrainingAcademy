import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(Usuario) private repo: Repository<Usuario>) {}

  create(data: Partial<Usuario>) {
    if (data.password) data.password = bcrypt.hashSync(data.password, 10);
    const e = this.repo.create(data);
    return this.repo.save(e);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id_usuario: id });
  }

  async update(id: number, data: Partial<Usuario>) {
    if (data.password) data.password = bcrypt.hashSync(data.password, 10);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
