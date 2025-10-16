import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsuarioService } from './usuario.service';

@Controller('usuarios')
export class UsuarioController {
  constructor(private svc: UsuarioService) {}

  @Post()
  create(@Body() body: any) {
    return this.svc.create(body);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.svc.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(Number(id));
  }
}
