import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioInsignia } from './usuario-insignia.entity';

@Injectable()
export class UsuarioInsigniaService {
  constructor(
    @InjectRepository(UsuarioInsignia)
    private repo: Repository<UsuarioInsignia>,
  ) {}

  create(b: any) {
    return this.repo.save(b);
  }

  findAll() {
    return this.repo.find();
  }

  // ✅ MÉTODO PARA OBTENER INSIGNIAS POR USUARIO
  async findByUsuario(idUsuario: number) {
    console.log('🔍 Service - Buscando insignias para usuario:', idUsuario);
    
    try {
      const insignias = await this.repo.find({
        where: { id_usuario: idUsuario },
        relations: ['insignia']
      });
      
      console.log('📦 Service - Insignias encontradas:', insignias);
      console.log('📊 Service - Número de insignias:', insignias.length);
      
      return insignias || [];
      
    } catch (error) {
      console.error('❌ Service - Error:', error);
      throw error;
    }
  }

  remove(idUsuario: number, idInsignia: number) {
    return this.repo.delete({ id_usuario: idUsuario, id_insignia: idInsignia });
  }
}