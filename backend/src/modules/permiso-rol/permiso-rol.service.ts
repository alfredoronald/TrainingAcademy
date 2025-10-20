import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermisoRol } from './permiso-rol.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermisoRolService {
  constructor(@InjectRepository(PermisoRol) private repo: Repository<PermisoRol>) {}
  create(data: Partial<PermisoRol>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find(); }
  remove(id_rol: number, id_permiso: number) { return this.repo.delete({ id_rol, id_permiso }); }
}
