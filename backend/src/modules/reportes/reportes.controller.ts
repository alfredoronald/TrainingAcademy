import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReportesService } from './reportes.service';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('estadisticas/:tipo')
  async getReporteEstadistico(@Param('tipo') tipo: string) {
    return await this.reportesService.obtenerReporteEstadistico(tipo);
  }

  @Get('promedio-notas/:usuarioId')
  async getPromedioNotas(@Param('usuarioId') usuarioId: string) {
    return await this.reportesService.obtenerPromedioNotas(parseInt(usuarioId));
  }

  @Get('estadisticas-asistencia')
  async getEstadisticasAsistencia() {
    return await this.reportesService.obtenerEstadisticasAsistencia();
  }

  @Get('semanal/:usuarioId')
  async getReporteSemanal(@Param('usuarioId') usuarioId: string) {
    return await this.reportesService.obtenerReporteSemanal(parseInt(usuarioId));
  }

  @Get('general')
  async getReporteGeneral(@Query('limite') limite: string = '5') {
    const limiteNum = parseInt(limite);
    
    const [cursosDemandados, mejorDesempeno, recompensasUsadas, asistencia] = await Promise.all([
      this.reportesService.obtenerTopCursosDemandados(limiteNum),
      this.reportesService.obtenerTopMejorDesempeno(limiteNum),
      this.reportesService.obtenerTopRecompensasUsadas(limiteNum),
      this.reportesService.obtenerEstadisticasAsistencia()
    ]);

    return {
      cursosMasDemandados: cursosDemandados,
      mejorDesempeno: mejorDesempeno,
      recompensasMasUsadas: recompensasUsadas,
      estadisticasAsistencia: asistencia,
      totalUsuarios: asistencia.length
    };
  }

  @Get('top/cursos')
  async getTopCursos(@Query('limite') limite: string = '5') {
    return await this.reportesService.obtenerTopCursosDemandados(parseInt(limite));
  }

  @Get('top/desempeno')
  async getTopDesempeno(@Query('limite') limite: string = '5') {
    return await this.reportesService.obtenerTopMejorDesempeno(parseInt(limite));
  }

  @Get('top/recompensas')
  async getTopRecompensas(@Query('limite') limite: string = '5') {
    return await this.reportesService.obtenerTopRecompensasUsadas(parseInt(limite));
  }
}