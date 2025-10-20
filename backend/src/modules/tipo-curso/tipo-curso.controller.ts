import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { TipoCursoService } from './tipo-curso.service';

@Controller('tipos-curso')
export class TipoCursoController {
  constructor(private svc: TipoCursoService) {}
  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Get() findAll() { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(+id); }
  @Put(':id') update(@Param('id') id: string, @Body() b: any) { return this.svc.update(+id, b); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(+id); }
}
