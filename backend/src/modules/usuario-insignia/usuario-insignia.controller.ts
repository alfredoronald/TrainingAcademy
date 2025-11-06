import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { UsuarioInsigniaService } from './usuario-insignia.service';

@Controller('usuario-insignia')
export class UsuarioInsigniaController {
  constructor(private svc: UsuarioInsigniaService) {}
  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Get() findAll() { return this.svc.findAll(); }
  
  // ✅ ENDPOINT MEJORADO PARA OBTENER INSIGNIAS POR USUARIO
  @Get('usuario/:id')
  async findByUsuario(@Param('id') id: string) {
    return this.svc.findByUsuario(+id);
  }
  
  @Delete(':idUsuario/:idInsignia')
  remove(@Param('idUsuario') idUsuario: string, @Param('idInsignia') idInsignia: string) {
    return this.svc.remove(+idUsuario, +idInsignia);
  }
}