import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Evaluacion } from './evaluacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EvaluacionService {
  constructor(@InjectRepository(Evaluacion) private repo: Repository<Evaluacion>) {}

  create(data: Partial<Evaluacion>) {
    return this.repo.save(this.repo.create(data));
  }

  // ✅ findAll con manejo de errores
  async findAll(): Promise<Evaluacion[]> {
    try {
      return await this.repo.find({ relations: ['modulo', 'usuario'] });
    } catch (err) {
      console.error('Error fetching evaluations:', err);

      // Opción segura: devolver solo campos básicos sin relaciones
      return await this.repo.find();
    }
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id_evaluacion: id }, relations: ['modulo','usuario'] });
  }

  update(id: number, data: Partial<Evaluacion>) {
    return this.repo.update(id, data);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }

  async countAprobadasByUsuario(idUsuario: number): Promise<number> {
    const count = await this.repo.count({
      where: { 
        usuario: { id_usuario: idUsuario },
        estado: 'APROBADO'
      }
    });
    console.log(`📝 Evaluaciones aprobadas del usuario ${idUsuario}: ${count}`);
    return count;
  }
}
