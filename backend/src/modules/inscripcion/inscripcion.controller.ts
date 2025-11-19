import { Controller, Post, Get, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';

@Controller('inscripciones')
export class InscripcionController {
  constructor(private svc: InscripcionService) {}

  // ✅ CREAR INSCRIPCIÓN CON PAGO, PROGRESO Y CANJE
  @Post()
  create(@Body() body: any) {
    return this.svc.crearInscripcionCompleta(body);
  }

  // ✅ OBTENER TODAS LAS INSCRIPCIONES
  @Get()
  findAll() {
    return this.svc.findAll();
  }

  // ✅ OBTENER INSCRIPCIONES CON PROGRESO POR USUARIO
  @Get('progreso-curso/usuario/:idUsuario')
  async obtenerInscripcionesConProgreso(
    @Param('idUsuario', ParseIntPipe) idUsuario: number
  ) {
    return this.svc.obtenerInscripcionesConProgreso(idUsuario);
  }

  // ✅ OBTENER PROGRESO ESPECÍFICO DE UN CURSO
  @Get('progreso-curso/usuario/:idUsuario/curso/:idCurso')
  async obtenerProgresoCurso(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Param('idCurso', ParseIntPipe) idCurso: number
  ) {
    return this.svc.obtenerProgresoCurso(idUsuario, idCurso);
  }

  // ✅ ACTUALIZAR PROGRESO DE UN CURSO
  @Put('progreso-curso/usuario/:idUsuario/curso/:idCurso')
  async actualizarProgreso(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Param('idCurso', ParseIntPipe) idCurso: number,
    @Body() body: { porcentajeAvance: number }
  ) {
    return this.svc.actualizarProgreso(idUsuario, idCurso, body.porcentajeAvance);
  }

  // ✅ OBTENER UNA INSCRIPCIÓN POR ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  // ✅ ACTUALIZAR INSCRIPCIÓN
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.svc.update(id, body);
  }

  // ✅ ELIMINAR INSCRIPCIÓN
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}