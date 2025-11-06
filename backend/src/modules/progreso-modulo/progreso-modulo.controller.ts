import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { ProgresoModuloService } from './progreso-modulo.service';

@Controller('progreso-modulo')
export class ProgresoModuloController {
  constructor(private svc: ProgresoModuloService) {}
  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Get() findAll() { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(+id); }
  @Put(':id') update(@Param('id') id: string, @Body() b: any) { return this.svc.update(+id, b); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(+id); }
  
  // ✅ NUEVO ENDPOINT PARA CONTAR MÓDULOS COMPLETADOS POR USUARIO
  @Get('usuario/:id/completados/count')
  async countCompletadosByUsuario(@Param('id') id: string) {
    return this.svc.countCompletadosByUsuario(+id);
  }
}