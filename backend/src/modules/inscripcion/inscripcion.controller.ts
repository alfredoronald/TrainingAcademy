import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';

@Controller('inscripciones')
export class InscripcionController {
  constructor(private svc: InscripcionService) {}
  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Get() findAll() { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(+id); }
  @Put(':id') update(@Param('id') id: string, @Body() b: any) { return this.svc.update(+id,b); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(+id); }
}
