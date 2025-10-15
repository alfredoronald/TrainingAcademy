import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './curso.dto';

@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Post()
  create(@Body() dto: CreateCursoDto) {
    return this.cursoService.create(dto);
  }

  @Get()
  findAll() {
    return this.cursoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursoService.findOne(+id);
  }
}
