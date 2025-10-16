import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { PermisoService } from './permiso.service';

@Controller('permisos')
export class PermisoController {
  constructor(private svc: PermisoService) {}
  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Get() findAll() { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(+id); }
  @Put(':id') update(@Param('id') id: string, @Body() b: any) { return this.svc.update(+id, b); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(+id); }
}
