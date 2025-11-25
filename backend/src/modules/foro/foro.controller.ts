import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ForoService } from './foro.service';

@Controller('foro')
export class ForoController {
  constructor(private readonly foroService: ForoService) {}

  @Get(':idCurso')
  async obtenerForoCurso(@Param('idCurso') idCurso: string) {
    return await this.foroService.obtenerForoPorCurso(parseInt(idCurso));
  }

  @Get(':idCurso/mensajes')
  async obtenerMensajes(@Param('idCurso') idCurso: string) {
    try {
      const foro = await this.foroService.obtenerForoPorCurso(parseInt(idCurso));
      return await this.foroService.obtenerMensajesForo(foro.id_foro);
    } catch (error) {
      return [];
    }
  }

  @Post(':idCurso/mensaje')
  async crearMensaje(
    @Param('idCurso') idCurso: string,
    @Body() body: { contenido: string; id_usuario: number; id_mensaje_respuesta?: number },
  ) {
    try {
      const foro = await this.foroService.obtenerForoPorCurso(parseInt(idCurso));
      
      if (!body.id_usuario) {
        throw new Error('ID de usuario es requerido');
      }
      
      return await this.foroService.crearMensaje(
        foro.id_foro,
        body.id_usuario,
        body.contenido,
        body.id_mensaje_respuesta
      );
    } catch (error) {
      throw new Error(`Error al crear mensaje: ${error.message}`);
    }
  }

  @Get('mensaje/:idMensaje')
  async obtenerMensaje(@Param('idMensaje') idMensaje: string) {
    return await this.foroService.obtenerMensajePorId(parseInt(idMensaje));
  }
}