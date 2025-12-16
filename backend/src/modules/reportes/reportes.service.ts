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
 async obtenerNuevosEstudiantes(inicio: string, fin: string): Promise<any> {
    try {
        console.log(`📊 Buscando nuevos estudiantes entre ${inicio} y ${fin}`);
        
        // CONSULTA FINAL - Filtrando solo estudiantes (usuarios con rol de estudiante)
        const queryNuevos = `
            SELECT DISTINCT
                u.id_usuario,
                u.nombre,
                u.apellido,
                CONCAT(u.nombre, ' ', u.apellido) as nombre_completo,
                u.correo_electronico as email,
                u.fecha_ingreso as fecha_registro
            FROM usuario u
            INNER JOIN detalle_rol dr ON u.id_usuario = dr.id_usuario
            INNER JOIN rol r ON dr.id_rol = r.id_rol
            WHERE u.fecha_ingreso BETWEEN $1 AND $2
                AND LOWER(r.nombre_rol) LIKE '%estudiante%'
            ORDER BY u.fecha_ingreso DESC
        `;
        
        const nuevosEstudiantes = await this.dataSource.query(queryNuevos, [inicio, fin]);

        // Calcular total del período anterior
        const fechaInicioAnterior = new Date(inicio);
        const fechaFinAnterior = new Date(fin);
        
        const duracionDias = Math.floor(
            (new Date(fin).getTime() - new Date(inicio).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        fechaInicioAnterior.setDate(fechaInicioAnterior.getDate() - duracionDias);
        fechaFinAnterior.setDate(fechaFinAnterior.getDate() - duracionDias);

        const queryAnterior = `
            SELECT COUNT(DISTINCT u.id_usuario) as total
            FROM usuario u
            INNER JOIN detalle_rol dr ON u.id_usuario = dr.id_usuario
            INNER JOIN rol r ON dr.id_rol = r.id_rol
            WHERE u.fecha_ingreso BETWEEN $1 AND $2
                AND LOWER(r.nombre_rol) LIKE '%estudiante%'
        `;
        
        const totalAnteriorResult = await this.dataSource.query(queryAnterior, [
            fechaInicioAnterior.toISOString().split('T')[0],
            fechaFinAnterior.toISOString().split('T')[0]
        ]);
        
        const totalAnterior = parseInt(totalAnteriorResult[0]?.total) || 0;
        const totalActual = nuevosEstudiantes.length;

        // Calcular variación
        let variacion = '0%';
        
        if (totalAnterior > 0) {
            const cambio = ((totalActual - totalAnterior) / totalAnterior) * 100;
            variacion = `${cambio >= 0 ? '+' : ''}${cambio.toFixed(1)}%`;
        } else if (totalActual > 0) {
            variacion = '+100%';
        }

        console.log(`✅ Encontrados ${totalActual} nuevos estudiantes (Variación: ${variacion})`);

        // Formatear resultados
        const estudiantesFormateados = nuevosEstudiantes.map(estudiante => ({
            id_usuario: estudiante.id_usuario,
            nombre_completo: estudiante.nombre_completo,
            email: estudiante.email,
            fecha_registro: estudiante.fecha_registro
        }));

        return {
            total: totalActual,
            variacion,
            nuevosEstudiantes: estudiantesFormateados
        };

    } catch (error) {
        console.error('❌ Error obteniendo nuevos estudiantes:', error);
        return {
            error: 'Error en la consulta',
            mensaje: error.message
        };
    }
}
async obtenerActividadNuevosEstudiantes(idsUsuarios: number[]): Promise<any> {
    try {
        console.log(`📊 Obteniendo actividad para ${idsUsuarios.length} usuarios`);
        
        if (!idsUsuarios || idsUsuarios.length === 0) {
            return { actividad: [] };
        }

        // Crear string de IDs para la consulta SQL
        const idsString = idsUsuarios.join(',');

        // CONSULTA FINAL - Ajustada a TU esquema exacto
        const queryActividad = `
            WITH usuario_info AS (
                SELECT 
                    u.id_usuario,
                    CONCAT(u.nombre, ' ', u.apellido) as nombre_completo,
                    u.correo_electronico as email
                FROM usuario u
                WHERE u.id_usuario IN (${idsString})
            ),
            inscripciones_info AS (
                SELECT 
                    i.id_usuario,
                    COUNT(DISTINCT i.id_curso) as cursos_inscritos,
                    MAX(i.fecha_inscripcion) as ultima_inscripcion
                FROM inscripcion i
                WHERE i.id_usuario IN (${idsString})
                GROUP BY i.id_usuario
            ),
            puntos_info AS (
                SELECT 
                    p.id_usuario,
                    COALESCE(MAX(p.total_saldo_puntos), 0) as puntos_obtenidos,
                    MAX(p.fecha_registro) as ultimos_puntos
                FROM puntaje p
                WHERE p.id_usuario IN (${idsString})
                GROUP BY p.id_usuario
            ),
            canjes_info AS (
                SELECT 
                    c.id_usuario,
                    COUNT(*) as recompensas_canjeadas,
                    MAX(c.fecha_canje) as ultimo_canje
                FROM canje c
                WHERE c.id_usuario IN (${idsString})
                GROUP BY c.id_usuario
            )
            SELECT 
                ui.id_usuario,
                ui.nombre_completo as nombre,
                ui.email,
                COALESCE(ii.cursos_inscritos, 0) as cursos_inscritos,
                COALESCE(pi.puntos_obtenidos, 0) as puntos_obtenidos,
                COALESCE(ci.recompensas_canjeadas, 0) as recompensas_canjeadas,
                GREATEST(
                    ii.ultima_inscripcion,
                    pi.ultimos_puntos,
                    ci.ultimo_canje
                ) as ultima_actividad
            FROM usuario_info ui
            LEFT JOIN inscripciones_info ii ON ui.id_usuario = ii.id_usuario
            LEFT JOIN puntos_info pi ON ui.id_usuario = pi.id_usuario
            LEFT JOIN canjes_info ci ON ui.id_usuario = ci.id_usuario
            ORDER BY ii.cursos_inscritos DESC NULLS LAST, pi.puntos_obtenidos DESC NULLS LAST
        `;

        const actividad = await this.dataSource.query(queryActividad);

        console.log(`✅ Actividad obtenida para ${actividad.length} usuarios`);

        return { actividad };

    } catch (error) {
        console.error('❌ Error obteniendo actividad de nuevos estudiantes:', error);
        throw error;
    }
}


}