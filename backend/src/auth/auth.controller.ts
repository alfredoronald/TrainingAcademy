import { Controller, Post, Body, NotFoundException } from '@nestjs/common';   
import { UsuarioService } from '../modules/usuario/usuario.service';

@Controller()
export class AuthController {
  constructor(private usuarioService: UsuarioService) {}

  @Post('login')
  async login(@Body() body: { correo_electronico: string; password: string; permiso?: string }) {
    const { correo_electronico, password, permiso } = body;

    // Convertimos permiso en array si se pasa, si no se pasa no valida permisos específicos
    const permisosRequeridos = permiso ? [permiso] : [];

    // Llamamos al servicio de login con permisos
    const usuario = await this.usuarioService.login(
      { correo_electronico, password },
      permisosRequeridos
    );

    if (!usuario) {
      throw new NotFoundException('Correo, contraseña o permisos incorrectos');
    }

    // Extraemos roles
    const roles = usuario.roles.map(r => r.nombre_rol);

    // Extraemos permisos de cada rol para frontend
    const permisos = usuario.roles.flatMap(r => r.permisos.map(p => p.nombre));

    return {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo_electronico: usuario.correo_electronico,
      roles,
      permisos,
    };
  }
}
