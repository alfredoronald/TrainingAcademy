import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { UsuarioService } from '../modules/usuario/usuario.service';

@Controller()
export class AuthController {
  constructor(private usuarioService: UsuarioService) {}

  @Post('login')
  async login(@Body() body: { correo_electronico: string; password: string }) {
    const { correo_electronico, password } = body;

    const usuario = await this.usuarioService.login({ correo_electronico, password });

    if (!usuario) {
      throw new NotFoundException('Correo o contraseña incorrectos');
    }

    // Extraemos roles como array de strings
    const roles = usuario.roles.map((r) => r.nombre_rol);

    return {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo_electronico: usuario.correo_electronico,
      roles,
    };
  }
}