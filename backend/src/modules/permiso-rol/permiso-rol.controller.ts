import { Controller, Post, Get, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PermisoRolService } from './permiso-rol.service';

@Controller('roles')
export class PermisoRolController {
  constructor(private svc: PermisoRolService) {}

  // Endpoint original para crear relación
  @Post()
  create(@Body() b: any) {
    return this.svc.create(b);
  }

  // Endpoint original para obtener todas las relaciones
  @Get()
  findAll() {
    return this.svc.findAll();
  }

  // Endpoint original para eliminar relación
  @Delete()
  remove(@Query('id_rol') r: string, @Query('id_permiso') p: string) {
    return this.svc.remove(Number(r), Number(p));
  }

  // NUEVOS ENDPOINTS PARA EL FRONTEND

  // Obtener permisos de un rol específico
  @Get(':id_rol/permisos')
  async obtenerPermisosPorRol(@Param('id_rol', ParseIntPipe) id_rol: number) {
    try {
      const permisos = await this.svc.obtenerPermisosPorRol(id_rol);
      return {
        success: true,
        data: permisos
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Asignar permiso a un rol
  @Post(':id_rol/permisos/:id_permiso')
  async asignarPermiso(
    @Param('id_rol', ParseIntPipe) id_rol: number,
    @Param('id_permiso', ParseIntPipe) id_permiso: number,
  ) {
    try {
      const resultado = await this.svc.asignarPermiso(id_rol, id_permiso);
      return {
        success: true,
        message: 'Permiso asignado correctamente',
        data: resultado
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Remover permiso de un rol
  @Delete(':id_rol/permisos/:id_permiso')
  async removerPermiso(
    @Param('id_rol', ParseIntPipe) id_rol: number,
    @Param('id_permiso', ParseIntPipe) id_permiso: number,
  ) {
    try {
      await this.svc.remove(id_rol, id_permiso);
      return {
        success: true,
        message: 'Permiso removido correctamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Verificar si un rol tiene un permiso específico
  @Get(':id_rol/permisos/:id_permiso/verificar')
  async verificarPermiso(
    @Param('id_rol', ParseIntPipe) id_rol: number,
    @Param('id_permiso', ParseIntPipe) id_permiso: number,
  ) {
    try {
      const tienePermiso = await this.svc.tienePermiso(id_rol, id_permiso);
      return {
        success: true,
        data: { tienePermiso }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Obtener todos los permisos con su estado para un rol
  @Get(':id_rol/permisos-con-estado')
  async obtenerPermisosConEstado(@Param('id_rol', ParseIntPipe) id_rol: number) {
    try {
      const permisos = await this.svc.obtenerTodosLosPermisosConEstado(id_rol);
      return {
        success: true,
        data: permisos
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}
