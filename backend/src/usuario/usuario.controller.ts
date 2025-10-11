// src/usuario/usuario.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() usuario: Usuario) {
    return this.usuarioService.create(usuario);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

 // @Get(':id')
 // findOne(@Param('id') id: number) {
 //   return this.usuarioService.findOne(id);
 // }

  @Put(':id')
  update(@Param('id') id: number, @Body() usuario: Partial<Usuario>) {
    return this.usuarioService.update(id, usuario);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usuarioService.remove(id);
  }
}
