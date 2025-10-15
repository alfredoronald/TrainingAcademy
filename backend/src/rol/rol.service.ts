import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './rol.entity';
import { CreateRolDto } from './rol.dto';

@Injectable()
export class RolService {
    constructor(
        @InjectRepository(Rol)
        private readonly rolRepo: Repository<Rol>,
    ) {}

    async create(dto: CreateRolDto): Promise<Rol> {
        const rol = this.rolRepo.create(dto);
        return this.rolRepo.save(rol);
    }

    findAll(): Promise<Rol[]> {
        return this.rolRepo.find();
    }

    // findOne devuelve null si no encuentra el rol
    async findOne(id: number): Promise<Rol | null> {
        const rol = await this.rolRepo.findOne({ where: { id_rol: id } });
        return rol ?? null;
    }

    // findByNombre devuelve null si no encuentra el rol
    async findByNombre(nombreRol: string): Promise<Rol | null> {
        const rol = await this.rolRepo.findOne({ where: { nombre_rol: nombreRol } });
        return rol ?? null;
    }
}