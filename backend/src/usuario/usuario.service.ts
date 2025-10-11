// src/usuario/usuario.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  // Crear usuario
  async create(usuario: Usuario): Promise<Usuario> {
    return this.usuarioRepository.save(usuario);
  }

  // Leer todos
  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  // Leer uno por ID
  //async findOne(id: number): Promise<Usuario> {
  //  return this.usuarioRepository.findOneBy({ id_usuario: id });
  //}

  // Actualizar
  async update(id: number, usuario: Partial<Usuario>): Promise<void> {
    await this.usuarioRepository.update(id, usuario);
  }

  // Eliminar
  async remove(id: number): Promise<void> {
    await this.usuarioRepository.delete(id);
  }
}
