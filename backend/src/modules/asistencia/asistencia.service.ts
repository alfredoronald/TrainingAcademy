import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asistencia } from './asistencia.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AsistenciaService {
  constructor(@InjectRepository(Asistencia) private repo: Repository<Asistencia>) {}
  create(data: Partial<Asistencia>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOneBy({ id_asistencia: id }); }
  update(id: number, data: Partial<Asistencia>) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
  
  // ✅ NUEVO MÉTODO: Contar asistencias por usuario
  async countByUsuario(idUsuario: number): Promise<number> {
    const count = await this.repo.count({
      where: { 
        usuario: { id_usuario: idUsuario },
        estado: 'PRESENTE' // Solo contar asistencias presentes
      }
    });
    console.log(`📊 Asistencias del usuario ${idUsuario}: ${count}`);
    return count;
  }
}
