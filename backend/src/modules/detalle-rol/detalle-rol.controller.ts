import { Controller, Post, Get, Delete, Body, Query } from '@nestjs/common';
import { DetalleRolService } from './detalle-rol.service';

@Controller('detalle-rol')
export class DetalleRolController {
  constructor(private svc: DetalleRolService) {}

  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Get() findAll() { return this.svc.findAll(); }
  @Delete() remove(@Query('id_usuario') u: string, @Query('id_rol') r: string) {
    return this.svc.removeComposite(Number(u), Number(r));
  }
}
