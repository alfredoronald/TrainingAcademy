import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const usuario = this.usuarioRepo.create(dto);
    return this.usuarioRepo.save(usuario);
  }

  findAll(): Promise<Usuario[]> {
    return this.usuarioRepo.find();
  }

  // findOne devuelve null si no encuentra el usuario
  async findOne(id: number): Promise<Usuario | null> {
    const usuario = await this.usuarioRepo.findOne({ where: { id_usuario: id } });
    return usuario ?? null;
  }

  // findByEmail devuelve null si no encuentra el usuario
  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepo.findOne({ where: { correo_electronico: email } });
    return usuario ?? null;
  }
}
