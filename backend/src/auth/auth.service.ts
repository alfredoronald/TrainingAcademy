import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../modules/usuario/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) 
    private usuarioRepo: Repository<Usuario>
  ) {}

  // Función centralizada para login
  async login(email: string, password: string) {
    // Buscar usuario por correo
    const usuario = await this.usuarioRepo.findOne({
      where: { correo_electronico: email },
    });

    if (!usuario) return null; // usuario no existe

    // Comparar contraseñas (usando bcrypt)
    const isMatch = bcrypt.compareSync(password, usuario.password);
    if (!isMatch) return null; // contraseña incorrecta

    return usuario; // devuelve usuario con rol
  }
}