import { Controller, Get, Query } from '@nestjs/common';
import { ReportesSistemaService } from './reportes-sistema.service';

@Controller('reportes-sistema')
export class ReportesSistemaController {
  constructor(private readonly reportesService: ReportesSistemaService) {}

  // 1. PROGRESO ACADÉMICO
  @Get('progreso-academico')
  getProgresoAcademico(
    @Query('fecha_inicio') fechaInicio?: string,
    @Query('fecha_fin') fechaFin?: string,
  ) {
    return this.reportesService.getProgresoAcademico(fechaInicio, fechaFin);
  }

  // 2. PUNTOS Y RECOMPENSAS
  @Get('puntos-recompensas')
  getPuntosRecompensas(
    @Query('fecha_inicio') fechaInicio?: string,
    @Query('fecha_fin') fechaFin?: string,
  ) {
    return this.reportesService.getPuntosRecompensas(fechaInicio, fechaFin);
  }

  // 3. CURSOS
  @Get('cursos')
  getReporteCursos(
    @Query('fecha_inicio') fechaInicio?: string,
    @Query('fecha_fin') fechaFin?: string,
  ) {
    return this.reportesService.getReporteCursos(fechaInicio, fechaFin);
  }

  // 4. PAGOS
  @Get('pagos')
  getReportePagos(
    @Query('fecha_inicio') fechaInicio?: string,
    @Query('fecha_fin') fechaFin?: string,
  ) {
    return this.reportesService.getReportePagos(fechaInicio, fechaFin);
  }

  // 5. DOCENTE
  @Get('docente')
  getReporteDocente(
    @Query('fecha_inicio') fechaInicio?: string,
    @Query('fecha_fin') fechaFin?: string,
  ) {
    return this.reportesService.getReporteDocente(fechaInicio, fechaFin);
  }

  // 6. GAMIFICACIÓN
  @Get('gamificacion')
  getReporteGamificacion(
    @Query('fecha_inicio') fechaInicio?: string,
    @Query('fecha_fin') fechaFin?: string,
  ) {
    return this.reportesService.getReporteGamificacion(fechaInicio, fechaFin);
  }

  // 7. ADMINISTRATIVO
  @Get('administrativo')
  getReporteAdministrativo(
    @Query('fecha_inicio') fechaInicio?: string,
    @Query('fecha_fin') fechaFin?: string,
  ) {
    return this.reportesService.getReporteAdministrativo(fechaInicio, fechaFin);
  }

  // ENDPOINT PARA LISTAR TODOS LOS REPORTES DISPONIBLES
  @Get('lista')
  getListaReportes() {
    return {
      reportes: [
        { nombre: 'Progreso Académico', ruta: '/reportes-sistema/progreso-academico' },
        { nombre: 'Puntos y Recompensas', ruta: '/reportes-sistema/puntos-recompensas' },
        { nombre: 'Cursos', ruta: '/reportes-sistema/cursos' },
        { nombre: 'Pagos', ruta: '/reportes-sistema/pagos' },
        { nombre: 'Docente', ruta: '/reportes-sistema/docente' },
        { nombre: 'Gamificación', ruta: '/reportes-sistema/gamificacion' },
        { nombre: 'Administrativo', ruta: '/reportes-sistema/administrativo' },
      ],
      formato_fechas: 'DD-MM-YYYY (ej: 01-03-2025)',
      uso: 'Agregar parámetros ?fecha_inicio=DD-MM-YYYY&fecha_fin=DD-MM-YYYY'
    };
  }
}