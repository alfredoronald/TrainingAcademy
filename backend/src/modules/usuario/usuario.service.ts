import { Injectable } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Rol } from '../rol/rol.entity';
import { DetalleRol } from '../detalle-rol/detalle-rol.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,

    @InjectRepository(DetalleRol)
    private readonly detalleRolRepository: Repository<DetalleRol>,

    private dataSource: DataSource,
  ) {}

  // ✅ CREAR USUARIO CON SQL DIRECTO
  async create(data: Partial<Usuario>) {
    try {
      console.log('📝 Creando usuario:', data);

      // 1. Hash de contraseña
      let hashedPassword = data.password;
      if (data.password && !data.password.startsWith('$2')) {
        hashedPassword = await bcrypt.hash(data.password, 10);
      }

      // 2. Verificar si el correo ya existe
      const existente = await this.dataSource.query(
        'SELECT id_usuario FROM usuario WHERE correo_electronico = $1',
        [data.correo_electronico]
      );

      if (existente && existente.length > 0) {
        throw new Error('El correo electrónico ya está registrado');
      }

      // 3. Obtener próximo ID
      const maxIdResult = await this.dataSource.query(
        'SELECT COALESCE(MAX(id_usuario), 0) + 1 as next_id FROM usuario'
      );
      const nextId = maxIdResult[0].next_id;

      // 4. Insertar usuario
      await this.dataSource.query(
        `INSERT INTO usuario (id_usuario, nombre, apellido, correo_electronico, password, fecha_ingreso)
         VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)`,
        [nextId, data.nombre, data.apellido, data.correo_electronico, hashedPassword]
      );

      console.log('✅ Usuario creado con ID:', nextId);

      // 5. Buscar el rol "Estudiante"
      const rolEstudiante = await this.rolRepository.findOne({
        where: { nombre_rol: 'Estudiante' },
      });

      // 6. Crear relación en detalle_rol
      if (rolEstudiante) {
        const maxIdDetalleRol = await this.dataSource.query(
          'SELECT COALESCE(MAX(id_usuario), 0) FROM detalle_rol'
        );

        await this.dataSource.query(
          `INSERT INTO detalle_rol (id_usuario, id_rol)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [nextId, rolEstudiante.id_rol]
        );

        console.log('✅ Rol Estudiante asignado');
      }

      // 7. Retornar usuario completo
      return await this.findOne(nextId);

    } catch (error) {
      console.error('❌ Error creando usuario:', error);
      throw error;
    }
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
    
    if (data.password && !data.password.startsWith('$2')) {
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

    // Validación de permisos (si aplica)
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