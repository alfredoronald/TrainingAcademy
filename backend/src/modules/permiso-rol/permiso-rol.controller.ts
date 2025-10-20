import { Controller, Post, Get, Delete, Body, Query } from '@nestjs/common';
import { PermisoRolService } from './permiso-rol.service';

@Controller('permiso-rol')
export class PermisoRolController {
  constructor(private svc: PermisoRolService) {}
  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Get() findAll() { return this.svc.findAll(); }
  @Delete() remove(@Query('id_rol') r: string, @Query('id_permiso') p: string) {
    return this.svc.remove(Number(r), Number(p));
  }
}
