import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { CreateInscripcionDto } from './inscripcion.dto';

@Controller('inscripciones')
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @Post()
  async create(@Body() createInscripcionDto: CreateInscripcionDto) {
    return await this.inscripcionService.create(createInscripcionDto);
  }

  @Get('usuario/:idUsuario')
  async findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return await this.inscripcionService.findByUsuario(idUsuario);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.inscripcionService.findOne(id);
  }

  // 🆕 ENDPOINTS PARA PROGRESO - CORREGIDOS
   @Get('progreso-curso/usuario/:idUsuario')
  async getProgresoCursosUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return await this.inscripcionService.getProgresoCursosUsuario(idUsuario);
  }

  @Get('progreso-curso/usuario/:idUsuario/curso/:idCurso')
  async getProgresoCursoUsuario(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Param('idCurso', ParseIntPipe) idCurso: number
  ) {
    return await this.inscripcionService.getProgresoCursoUsuario(idUsuario, idCurso);
  }

  @Get('debug/progreso-curso')
  async debugProgresoCurso() {
    return await this.inscripcionService.debugProgresoCurso();
  }
}