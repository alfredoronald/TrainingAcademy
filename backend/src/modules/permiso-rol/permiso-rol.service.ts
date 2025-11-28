import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermisoRol } from './permiso-rol.entity';
import { Repository } from 'typeorm';
import { Rol } from '../rol/rol.entity';
import { Permiso } from '../permiso/permiso.entity';

@Injectable()
export class PermisoRolService {
  constructor(
    @InjectRepository(PermisoRol) 
    private repo: Repository<PermisoRol>,
    @InjectRepository(Rol)
    private rolRepo: Repository<Rol>,
    @InjectRepository(Permiso)
    private permisoRepo: Repository<Permiso>,
  ) {}

  async create(data: Partial<PermisoRol>) {
    return this.repo.save(this.repo.create(data));
  }

  async findAll() {
    return this.repo.find({
      relations: ['rol', 'permiso']
    });
  }

  async remove(id_rol: number, id_permiso: number) {
    return this.repo.delete({ id_rol, id_permiso });
  }

  // Nuevos métodos para el frontend
  async obtenerPermisosPorRol(id_rol: number) {
    const permisosRol = await this.repo.find({
      where: { id_rol },
      relations: ['permiso']
    });
    
    return permisosRol.map(pr => pr.permiso);
  }

  async asignarPermiso(id_rol: number, id_permiso: number) {
    // Verificar si el rol existe
    const rol = await this.rolRepo.findOne({ where: { id_rol } });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${id_rol} no encontrado`);
    }

    // Verificar si el permiso existe
    const permiso = await this.permisoRepo.findOne({ where: { id_permiso } });
    if (!permiso) {
      throw new NotFoundException(`Permiso con id ${id_permiso} no encontrado`);
    }

    // Verificar si la relación ya existe
    const existeRelacion = await this.repo.findOne({
      where: { id_rol, id_permiso }
    });

    if (existeRelacion) {
      return existeRelacion; // Ya existe, no hacer nada
    }

    // Crear nueva relación
    const nuevaRelacion = this.repo.create({
      id_rol,
      id_permiso
    });

    return await this.repo.save(nuevaRelacion);
  }

  async tienePermiso(id_rol: number, id_permiso: number): Promise<boolean> {
    const relacion = await this.repo.findOne({
      where: { id_rol, id_permiso }
    });
    return !!relacion;
  }

  async obtenerTodosLosPermisosConEstado(id_rol: number) {
    const todosLosPermisos = await this.permisoRepo.find();
    const permisosDelRol = await this.obtenerPermisosPorRol(id_rol);
    
    const permisosConEstado = todosLosPermisos.map(permiso => ({
      ...permiso,
      asignado: permisosDelRol.some(p => p.id_permiso === permiso.id_permiso)
    }));

    return permisosConEstado;
  }
}