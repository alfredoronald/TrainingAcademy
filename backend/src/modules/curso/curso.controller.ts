import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './curso.dto';
import { UpdateCursoDto } from './update-curso.dto';

@Controller('cursos')
export class CursoController {
  constructor(private readonly svc: CursoService) {}

  @Post()
  create(@Body() body: CreateCursoDto) {
    return this.svc.create(body);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateCursoDto) {
    return this.svc.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }
}
