import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { CreateInscripcionDto } from './inscripcion.dto';

@Controller('inscripcion')
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @Post()
  create(@Body() dto: CreateInscripcionDto) {
    return this.inscripcionService.create(dto);
  }

  @Get()
  findAll() {
    return this.inscripcionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inscripcionService.findOne(+id);
  }
}
