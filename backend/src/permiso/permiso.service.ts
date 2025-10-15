import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso } from './permiso.entity';
import { CreatePermisoDto } from './permiso.dto';

@Injectable()
export class PermisoService {
    constructor(
        @InjectRepository(Permiso)
        private readonly permisoRepo: Repository<Permiso>,
    ) {}

    async create(dto: CreatePermisoDto): Promise<Permiso> {
        const permiso = this.permisoRepo.create(dto);
        return this.permisoRepo.save(permiso);
    }

    findAll(): Promise<Permiso[]> {
        return this.permisoRepo.find();
    }

    async findOne(id: number): Promise<Permiso | null> {
        const permiso = await this.permisoRepo.findOne({ where: { id_permiso: id } });
        return permiso ?? null;
    }

    async findByNombre(nombre: string): Promise<Permiso | null> {
        const permiso = await this.permisoRepo.findOne({ where: { nombre } });
        return permiso ?? null;
    }

    async update(id: number, dto: Partial<CreatePermisoDto>): Promise<Permiso | null> {
        await this.permisoRepo.update({ id_permiso: id }, dto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.permisoRepo.delete({ id_permiso: id });
    }
}