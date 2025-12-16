import { Controller, Get, Param, Query, Post, Body  } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ActividadNuevosDto } from './actividad-nuevos.dto';

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

 // 1. Endpoint para nuevos estudiantes registrados en período determinado
  @Get('nuevos-estudiantes')
  async getNuevosEstudiantes(
    @Query('inicio') inicio: string,
    @Query('fin') fin: string
  ) {
    console.log(`🎯 GET /api/reportes/nuevos-estudiantes - Período: ${inicio} a ${fin}`);
    
    // Validación básica
    if (!inicio || !fin) {
      return {
        error: 'Fechas requeridas',
        mensaje: 'Debe proporcionar fecha de inicio y fin (formato: YYYY-MM-DD)',
        ejemplo: '/api/reportes/nuevos-estudiantes?inicio=2024-01-01&fin=2024-12-31'
      };
    }

    try {
      // Validar formato de fechas
      const fechaInicio = new Date(inicio);
      const fechaFin = new Date(fin);
      
      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        return {
          error: 'Formato de fecha inválido',
          mensaje: 'Use formato YYYY-MM-DD (ej: 2024-12-15)'
        };
      }

      if (fechaInicio > fechaFin) {
        return {
          error: 'Rango de fechas inválido',
          mensaje: 'La fecha de inicio debe ser anterior a la fecha de fin'
        };
      }

      return await this.reportesService.obtenerNuevosEstudiantes(inicio, fin);
      
    } catch (error) {
      console.error('❌ Error en endpoint nuevos-estudiantes:', error);
      return {
        error: 'Error interno del servidor',
        mensaje: error.message
      };
    }
  }

  // 2. Endpoint para actividad de usuarios nuevos
  @Post('actividad-nuevos')
  async getActividadNuevosEstudiantes(
    @Body() actividadNuevosDto: ActividadNuevosDto
  ) {
    console.log(`🎯 POST /api/reportes/actividad-nuevos - Usuarios: ${actividadNuevosDto.idsUsuarios?.length || 0}`);
    
    // Validación básica
    if (!actividadNuevosDto.idsUsuarios || actividadNuevosDto.idsUsuarios.length === 0) {
      return { 
        actividad: [],
        mensaje: 'No se proporcionaron IDs de usuarios'
      };
    }

    try {
      // Validar que todos los IDs sean números positivos
      const idsInvalidos = actividadNuevosDto.idsUsuarios.filter(id => 
        !Number.isInteger(id) || id <= 0
      );
      
      if (idsInvalidos.length > 0) {
        return {
          error: 'IDs inválidos',
          mensaje: 'Los IDs de usuarios deben ser números positivos',
          idsInvalidos
        };
      }

      // Limitar a un máximo de IDs para evitar consultas demasiado grandes
      const maxIds = 100;
      const idsProcesar = actividadNuevosDto.idsUsuarios.slice(0, maxIds);
      
      if (actividadNuevosDto.idsUsuarios.length > maxIds) {
        console.log(`⚠️  Se limitó la consulta a ${maxIds} de ${actividadNuevosDto.idsUsuarios.length} IDs`);
      }

      const resultado = await this.reportesService.obtenerActividadNuevosEstudiantes(idsProcesar);
      
      return {
        ...resultado,
        totalSolicitado: actividadNuevosDto.idsUsuarios.length,
        totalProcesado: idsProcesar.length,
        mensaje: actividadNuevosDto.idsUsuarios.length > maxIds 
          ? `Se procesaron los primeros ${maxIds} IDs de ${actividadNuevosDto.idsUsuarios.length} solicitados`
          : 'Consulta completada exitosamente'
      };
      
    } catch (error) {
      console.error('❌ Error en endpoint actividad-nuevos:', error);
      return {
        error: 'Error interno del servidor',
        mensaje: error.message
      };
    }
  }

  // 3. Versión GET para probar actividad (opcional)
  @Get('actividad-nuevos')
  async getActividadNuevosEstudiantesGET(
    @Query('ids') ids: string
  ) {
    console.log(`🎯 GET /api/reportes/actividad-nuevos - IDs: ${ids}`);
    
    if (!ids) {
      return { 
        error: 'IDs requeridos',
        mensaje: 'Proporcione IDs de usuarios separados por coma',
        ejemplo: '/api/reportes/actividad-nuevos?ids=1,2,3,4,5'
      };
    }

    try {
      const idsArray = ids.split(',').map(id => {
        const idNum = parseInt(id.trim());
        return isNaN(idNum) ? null : idNum;
      }).filter(id => id !== null);
      
      if (idsArray.length === 0) {
        return {
          error: 'IDs inválidos',
          mensaje: 'No se encontraron IDs válidos en la cadena proporcionada'
        };
      }

      const resultado = await this.reportesService.obtenerActividadNuevosEstudiantes(idsArray);
      
      return {
        ...resultado,
        totalIds: idsArray.length,
        mensaje: 'Consulta completada exitosamente'
      };
      
    } catch (error) {
      console.error('❌ Error en endpoint actividad-nuevos GET:', error);
      return {
        error: 'Error interno del servidor',
        mensaje: error.message
      };
    }
  }
}