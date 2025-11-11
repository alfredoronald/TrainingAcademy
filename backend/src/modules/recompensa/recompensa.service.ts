import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recompensa } from './recompensa.entity';

@Injectable()
export class RecompensaService {
  constructor(
    @InjectRepository(Recompensa)
    private readonly recompensaRepository: Repository<Recompensa>,
  ) {}

  async findAll(): Promise<Recompensa[]> {
    console.log('🔍 Buscando todas las recompensas en la BD...');
    try {
      const recompensas = await this.recompensaRepository.find();
      console.log(`✅ Encontradas ${recompensas.length} recompensas`);
      return recompensas;
    } catch (error) {
      console.error('❌ Error buscando recompensas:', error);
      throw error;
    }
  }

  // OPCIÓN 1: Retornar Recompensa o null (Recomendado si no usas findOne)
  async findOne(id: number): Promise<Recompensa | null> {
    return await this.recompensaRepository.findOne({
      where: { id_recompensa: id }
    });
  }

  // OPCIÓN 2: Lanzar excepción si no encuentra
  async findOneOrFail(id: number): Promise<Recompensa> {
    const recompensa = await this.recompensaRepository.findOne({
      where: { id_recompensa: id }
    });
    
    if (!recompensa) {
      throw new NotFoundException(`Recompensa con ID ${id} no encontrada`);
    }
    
    return recompensa;
  }
}