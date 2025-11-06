import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Evaluacion } from './evaluacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EvaluacionService {
  constructor(@InjectRepository(Evaluacion) private repo: Repository<Evaluacion>) {}
  create(data: Partial<Evaluacion>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find({ relations: ['modulo','usuario'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id_evaluacion: id }, relations: ['modulo','usuario'] }); }
  update(id: number, data: Partial<Evaluacion>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
  
  // ✅ NUEVO MÉTODO: Contar evaluaciones aprobadas por usuario
  async countAprobadasByUsuario(idUsuario: number): Promise<number> {
    const count = await this.repo.count({
      where: { 
        usuario: { id_usuario: idUsuario },
        estado: 'APROBADO' // Solo contar evaluaciones aprobadas
      }
    });
    console.log(`📝 Evaluaciones aprobadas del usuario ${idUsuario}: ${count}`);
    return count;
  }
}
