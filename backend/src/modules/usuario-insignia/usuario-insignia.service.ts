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

  // ✅ AGREGAR ESTE MÉTODO NUEVO
  async findByUsuario(idUsuario: number) {
  console.log('🔍 Service - Buscando insignias para usuario:', idUsuario);
  console.log('🔍 Service - Tipo de idUsuario:', typeof idUsuario);
  
  try {
    // Verifica que la conexión a la BD funcione
    console.log('🔍 Service - Probando conexión a BD...');
    
    const insignias = await this.repo.find({
      where: { id_usuario: idUsuario },
      relations: ['insignia']
    });
    
    console.log('📦 Service - Insignias encontradas:', insignias);
    console.log('📊 Service - Número de insignias:', insignias.length);
    
    // Si no hay insignias, retorna array vacío
    return insignias || [];
    
  } catch (error) {
    console.error('❌ Service - Error ENCONTRADO:', error);
    console.error('❌ Service - Stack trace:', error.stack);
    
    // Para debug más detallado:
    if (error.code) {
      console.error('❌ Service - Error code:', error.code);
    }
    if (error.message) {
      console.error('❌ Service - Error message:', error.message);
    }
    
    throw error;
  }
}

  remove(idUsuario: number, idInsignia: number) {
    return this.repo.delete({ id_usuario: idUsuario, id_insignia: idInsignia });
  }
}
