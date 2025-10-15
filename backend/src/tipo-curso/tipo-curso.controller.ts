import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TipoCursoService } from './tipo_curso.service';
import { CreateTipoCursoDto } from './tipo_curso.dto';

@Controller('tipo-curso')
export class TipoCursoController {
  constructor(private readonly tipoCursoService: TipoCursoService) {}

  @Post()
  create(@Body() dto: CreateTipoCursoDto) {
    return this.tipoCursoService.create(dto);
  }

  @Get()
  findAll() {
    return this.tipoCursoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoCursoService.findOne(+id);
  }
}