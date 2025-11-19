import { Controller, Post, Get, Body, Req, Param } from '@nestjs/common';
import { ForoService } from './foro.service';
import { CrearMensajeDto } from './crear-foro.dto';

@Controller('foro')
export class ForoController {
  constructor(private readonly foroService: ForoService) {}

  @Get(':idCurso')
  async listar(@Param('idCurso') idCurso: number) {
    return this.foroService.obtenerForoCurso(Number(idCurso));
  }

@Post(':idCurso/mensaje')
async postMensaje(
  @Param('idCurso') idCurso: number,
  @Body() body: CrearMensajeDto,
  @Req() req
) {
  const usuarioId = req.user.id_usuario; // ✅ se obtiene del auth middleware
  return this.foroService.agregarMensaje(
    Number(idCurso),
    usuarioId,
    body.contenido
  );
}


}
