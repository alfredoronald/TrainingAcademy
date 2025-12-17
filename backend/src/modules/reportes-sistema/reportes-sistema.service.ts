import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportesSistemaService {
  constructor(private dataSource: DataSource) {}

  // 1. REPORTE DE PROGRESO ACADÉMICO
  async getProgresoAcademico(fechaInicio?: string, fechaFin?: string) {
    try {
      console.log('📊 Ejecutando reporte_progreso_academico:', { fechaInicio, fechaFin });
      
      const query = `
        SELECT reporte_progreso_academico($1, $2) as data
      `;
      
      const result = await this.dataSource.query(query, [fechaInicio, fechaFin]);
      
      // La función PostgreSQL devuelve un JSON, lo extraemos
      return result[0]?.data || null;
      
    } catch (error) {
      console.error('❌ Error en getProgresoAcademico:', error);
      throw error;
    }
  }

  // 2. REPORTE DE PUNTOS Y RECOMPENSAS
  async getPuntosRecompensas(fechaInicio?: string, fechaFin?: string) {
    try {
      console.log('🎮 Ejecutando reporte_puntos_recompensas:', { fechaInicio, fechaFin });
      
      const query = `
        SELECT reporte_puntos_recompensas($1, $2) as data
      `;
      
      const result = await this.dataSource.query(query, [fechaInicio, fechaFin]);
      return result[0]?.data || null;
      
    } catch (error) {
      console.error('❌ Error en getPuntosRecompensas:', error);
      throw error;
    }
  }

  // 3. REPORTE DE CURSOS
  async getReporteCursos(fechaInicio?: string, fechaFin?: string) {
    try {
      console.log('📚 Ejecutando reporte_cursos:', { fechaInicio, fechaFin });
      
      const query = `
        SELECT reporte_cursos($1, $2) as data
      `;
      
      const result = await this.dataSource.query(query, [fechaInicio, fechaFin]);
      return result[0]?.data || null;
      
    } catch (error) {
      console.error('❌ Error en getReporteCursos:', error);
      throw error;
    }
  }

  // 4. REPORTE DE PAGOS
  async getReportePagos(fechaInicio?: string, fechaFin?: string) {
    try {
      console.log('💰 Ejecutando reporte_pagos:', { fechaInicio, fechaFin });
      
      const query = `
        SELECT reporte_pagos($1, $2) as data
      `;
      
      const result = await this.dataSource.query(query, [fechaInicio, fechaFin]);
      return result[0]?.data || null;
      
    } catch (error) {
      console.error('❌ Error en getReportePagos:', error);
      throw error;
    }
  }

  // 5. REPORTE DOCENTE
  async getReporteDocente(fechaInicio?: string, fechaFin?: string) {
    try {
      console.log('👨‍🏫 Ejecutando reporte_docente:', { fechaInicio, fechaFin });
      
      const query = `
        SELECT reporte_docente($1, $2) as data
      `;
      
      const result = await this.dataSource.query(query, [fechaInicio, fechaFin]);
      return result[0]?.data || null;
      
    } catch (error) {
      console.error('❌ Error en getReporteDocente:', error);
      throw error;
    }
  }

  // 6. REPORTE GAMIFICACIÓN
  async getReporteGamificacion(fechaInicio?: string, fechaFin?: string) {
    try {
      console.log('🏆 Ejecutando reporte_gamificacion:', { fechaInicio, fechaFin });
      
      const query = `
        SELECT reporte_gamificacion($1, $2) as data
      `;
      
      const result = await this.dataSource.query(query, [fechaInicio, fechaFin]);
      return result[0]?.data || null;
      
    } catch (error) {
      console.error('❌ Error en getReporteGamificacion:', error);
      throw error;
    }
  }

  // 7. REPORTE ADMINISTRATIVO
  async getReporteAdministrativo(fechaInicio?: string, fechaFin?: string) {
    try {
      console.log('🏢 Ejecutando reporte_administrativos:', { fechaInicio, fechaFin });
      
      const query = `
        SELECT reporte_administrativos($1, $2) as data
      `;
      
      const result = await this.dataSource.query(query, [fechaInicio, fechaFin]);
      return result[0]?.data || null;
      
    } catch (error) {
      console.error('❌ Error en getReporteAdministrativo:', error);
      throw error;
    }
  }
}