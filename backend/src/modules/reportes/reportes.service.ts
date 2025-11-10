import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async obtenerReporteEstadistico(tipo: string): Promise<any[]> {
    const query = `SELECT * FROM fn_reporte_estadistico($1)`;
    const result = await this.dataSource.query(query, [tipo]);
    return result;
  }

  async obtenerPromedioNotas(usuarioId: number): Promise<number> {
    const query = `SELECT fn_promedio_notas($1) as promedio`;
    const result = await this.dataSource.query(query, [usuarioId]);
    return parseFloat(result[0].promedio);
  }

  async obtenerEstadisticasAsistencia(): Promise<any[]> {
    const query = `SELECT * FROM fn_estadisticas_asistencia()`;
    const result = await this.dataSource.query(query);
    return result;
  }

  async obtenerReporteSemanal(usuarioId: number): Promise<any> {
    // Estadísticas semanales para el usuario
    const cursosCompletados = await this.dataSource.query(
      `SELECT COUNT(*) as total FROM progreso_curso WHERE id_usuario = $1 AND estado_curso = 'COMPLETADO'`,
      [usuarioId]
    );

    const puntosTotales = await this.dataSource.query(
      `SELECT COALESCE(total_saldo_puntos, 0) as puntos FROM puntaje WHERE id_usuario = $1`,
      [usuarioId]
    );

    const progresoSemanal = await this.dataSource.query(
      `SELECT COUNT(*) as actividades_completadas 
       FROM progreso_tema 
       WHERE id_usuario = $1 AND estado = 'COMPLETO' 
       AND fecha_actualizacion >= CURRENT_DATE - INTERVAL '7 days'`,
      [usuarioId]
    );

    const promedioNotas = await this.dataSource.query(
      `SELECT fn_promedio_notas($1) as promedio_notas`,
      [usuarioId]
    );

    return {
      cursosCompletados: parseInt(cursosCompletados[0]?.total) || 0,
      puntosTotales: parseInt(puntosTotales[0]?.puntos) || 0,
      actividadesCompletadas: parseInt(progresoSemanal[0]?.actividades_completadas) || 0,
      promedioNotas: parseFloat(promedioNotas[0]?.promedio_notas) || 0,
      fechaGeneracion: new Date().toISOString()
    };
  }

  async obtenerTopCursosDemandados(limite: number = 5): Promise<any[]> {
    const result = await this.dataSource.query(
      `SELECT * FROM fn_reporte_estadistico('cursos_mas_demandados') LIMIT $1`,
      [limite]
    );
    return result;
  }

  async obtenerTopMejorDesempeno(limite: number = 5): Promise<any[]> {
    const result = await this.dataSource.query(
      `SELECT * FROM fn_reporte_estadistico('mejor_desempeno') LIMIT $1`,
      [limite]
    );
    return result;
  }

  async obtenerTopRecompensasUsadas(limite: number = 5): Promise<any[]> {
    const result = await this.dataSource.query(
      `SELECT * FROM fn_reporte_estadistico('recompensas_mas_usadas') LIMIT $1`,
      [limite]
    );
    return result;
  }
}