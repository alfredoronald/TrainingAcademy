import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgresoModulo } from './progreso-modulo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProgresoModuloService {
  constructor(@InjectRepository(ProgresoModulo) private repo: Repository<ProgresoModulo>) {}
  create(data: Partial<ProgresoModulo>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find({ relations: ['modulo','usuario'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id_progreso_modulo: id }, relations: ['modulo','usuario'] }); }
  update(id: number, data: Partial<ProgresoModulo>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
  
  // ✅ NUEVO MÉTODO: Contar módulos completados por usuario
  async countCompletadosByUsuario(idUsuario: number): Promise<number> {
    const count = await this.repo.count({
      where: { 
        usuario: { id_usuario: idUsuario },
        porcentaje_avance: 100 // Solo contar módulos completados al 100%
      }
    });
    console.log(`📚 Módulos completados del usuario ${idUsuario}: ${count}`);
    return count;
  }
}