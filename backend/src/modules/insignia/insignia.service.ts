// src/modules/insignia/insignia.service.ts (CORREGIDO)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Insignia } from './insignia.entity';
import { Repository } from 'typeorm';
import { CreateInsigniaDto } from './create-insignia.dto';

@Injectable()
export class InsigniaService {
  constructor(@InjectRepository(Insignia) private repo: Repository<Insignia>) {}

  async create(createInsigniaDto: CreateInsigniaDto): Promise<Insignia> {
    const insignia = this.repo.create({
      nombre: createInsigniaDto.nombre,
      descripcion: createInsigniaDto.descripcion,
      criterio: createInsigniaDto.criterio,
    });

    return await this.repo.save(insignia);
  }

  async findAll(): Promise<Insignia[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Insignia> {
    const insignia = await this.repo.findOne({ 
      where: { id_insignia: id } 
    });
    
    if (!insignia) {
      throw new Error(`Insignia con ID ${id} no encontrada`); // CORREGIDO
    }
    
    return insignia;
  }

  async update(id: number, data: Partial<Insignia>): Promise<Insignia> {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}