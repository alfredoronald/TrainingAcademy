import { Injectable } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // Crear usuario con hash de contraseña
  async create(data: Partial<Usuario>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const usuario = this.usuarioRepository.create(data);
    return this.usuarioRepository.save(usuario);
  }

  // Obtener todos los usuarios
  findAll() {
    return this.usuarioRepository.find({
      relations: ['detalleRoles', 'detalleRoles.rol', 'detalleRoles.rol.permisos'],
    });
  }

  // Obtener usuario por id
  findOne(id: number) {
    if (!id || isNaN(id)) return null;
    return this.usuarioRepository.findOne({
      where: { id_usuario: id },
      relations: ['detalleRoles', 'detalleRoles.rol', 'detalleRoles.rol.permisos'],
    });
  }

  // Actualizar usuario
  async update(id: number, data: Partial<Usuario>) {
    if (!id || isNaN(id)) return null;
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    await this.usuarioRepository.update(id, data);
    return this.findOne(id);
  }

  // Eliminar usuario
  remove(id: number) {
    if (!id || isNaN(id)) return null;
    return this.usuarioRepository.delete(id);
  }

  // 🔑 Login con validación de permisos
  async login(
    { correo_electronico, password }: { correo_electronico: string; password: string },
    permisosRequeridos: string[] = [],
  ) {
    if (!correo_electronico || !password) return null;

    const usuario = await this.usuarioRepository.findOne({
      where: { correo_electronico },
      relations: ['detalleRoles', 'detalleRoles.rol', 'detalleRoles.rol.permisos'],
    });

    if (!usuario) return null;

    // Validación de contraseña
    const valid = usuario.password.startsWith('$2')
      ? await bcrypt.compare(password, usuario.password)
      : usuario.password === password;

    if (!valid) return null;

    // Validación de permisos
    if (permisosRequeridos.length > 0 && !this.tienePermiso(usuario, permisosRequeridos)) {
      return null;
    }

    // Transformar detalleRoles a roles
    const roles = usuario.detalleRoles.map((dr) => dr.rol);

    return {
      ...usuario,
      roles,
    };
  }

  // Función privada para validar permisos
  private tienePermiso(usuario: Usuario, permisosRequeridos: string[]): boolean {
    for (const dr of usuario.detalleRoles) {
      for (const permiso of dr.rol.permisos) {
        if (permisosRequeridos.includes(permiso.nombre)) {
          return true;
        }
      }
    }
    return false;
  }

  // Obtener usuario por correo electrónico (perfil)
  async findByEmail(correo_electronico: string) {
    if (!correo_electronico) return null;

    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { correo_electronico },
        relations: [
          'detalleRoles',
          'detalleRoles.rol',
          'detalleRoles.rol.permisos',
          'usuarioInsignias',
          'usuarioInsignias.insignia',
        ],
      });
      return usuario || null;
    } catch (error) {
      console.error('Error en findByEmail:', error);
      return null;
    }
  }
}