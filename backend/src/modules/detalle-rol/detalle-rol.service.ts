import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetalleRol } from './detalle-rol.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DetalleRolService {
  constructor(@InjectRepository(DetalleRol) private repo: Repository<DetalleRol>) {}
  create(data: Partial<DetalleRol>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find(); }
  removeComposite(id_usuario: number, id_rol: number) { return this.repo.delete({ id_usuario, id_rol }); }
}
