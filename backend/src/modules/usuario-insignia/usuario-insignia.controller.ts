import { Controller, Post, Get, Delete, Body, Query } from '@nestjs/common';
import { UsuarioInsigniaService } from './usuario-insignia.service';

@Controller('usuario-insignia')
export class UsuarioInsigniaController {
  constructor(private svc: UsuarioInsigniaService) {}
  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Get() findAll() { return this.svc.findAll(); }
  @Delete() remove(@Query('id_usuario') u: string, @Query('id_insignia') i: string) {
    return this.svc.remove(Number(u), Number(i));
  }
}
