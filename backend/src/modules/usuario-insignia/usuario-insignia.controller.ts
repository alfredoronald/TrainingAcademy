import { Controller, Post, Get, Delete, Body, Query, Param } from '@nestjs/common';
import { UsuarioInsigniaService } from './usuario-insignia.service';

@Controller('usuario-insignia')
export class UsuarioInsigniaController {
  constructor(private svc: UsuarioInsigniaService) {}

  @Post()
  create(@Body() b: any) {
    return this.svc.create(b);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  // ✅ AGREGAR ESTE ENDPOINT NUEVO
  @Get(':idUsuario')
  findByUsuario(@Param('idUsuario') idUsuario: string) {
    console.log('🔍 Buscando insignias para usuario:', idUsuario);
    return this.svc.findByUsuario(Number(idUsuario));
  }

  @Delete()
  remove(@Query('id_usuario') u: string, @Query('id_insignia') i: string) {
    return this.svc.remove(Number(u), Number(i));
  }
}
