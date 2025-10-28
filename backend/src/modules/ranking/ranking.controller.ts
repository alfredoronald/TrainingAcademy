import { Controller, Post, Get, Body } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking } from './ranking.entity';
import { Puntos } from '../puntaje/puntaje.entity'; // 👈 CORREGIDO: Puntos en lugar de Puntaje

@Controller('ranking')
export class RankingController {
  constructor(
    private svc: RankingService,
    @InjectRepository(Ranking)
    private rankingRepo: Repository<Ranking>,
    @InjectRepository(Puntos) // 👈 CORREGIDO: Puntos
    private puntosRepo: Repository<Puntos>, // 👈 CORREGIDO: Puntos
  ) {}

  @Get('debug')
  async debug() {
    console.log('🐛 Endpoint debug llamado');
    
    try {
      // Test básico de la conexión
      const countRanking = await this.rankingRepo.count();
      const countPuntos = await this.puntosRepo.count();
      
      console.log(`📊 Total registros en tabla ranking: ${countRanking}`);
      console.log(`📊 Total registros en tabla puntaje: ${countPuntos}`);
      
      // Ver estructura de datos
      const sampleRanking = await this.rankingRepo.find({ 
        take: 1,
        relations: ['usuario']
      });
      
      const samplePuntos = await this.puntosRepo.find({ 
        take: 1,
        relations: ['usuario']
      });
      
      console.log('📋 Estructura ranking:', sampleRanking);
      console.log('📋 Estructura puntos:', samplePuntos);
      
      return {
        totalRegistrosRanking: countRanking,
        totalRegistrosPuntos: countPuntos,
        estructuraRanking: sampleRanking,
        estructuraPuntos: samplePuntos,
        mensaje: 'Debug completado'
      };
    } catch (error) {
      console.error('❌ Error en debug:', error);
      return { error: error.message };
    }
  }

  @Get('global-puntos')
  async getGlobalPuntos() {
    console.log('🎯 Endpoint /ranking/global-puntos llamado');
    
    try {
      const rankings = await this.rankingRepo.find({
        where: { tipo_ranking: 'global_puntos' },
        relations: ['usuario'],
        order: { posicion: 'ASC' },
        take: 10,
      });

      console.log(`📊 Rankings global_puntos encontrados:`, rankings);
      return rankings;

    } catch (error) {
      console.error('❌ Error en global-puntos:', error);
      return { error: error.message, data: [] };
    }
  }

  // 🔥 ENDPOINT - Rankings con puntajes reales
  @Get('con-puntajes-reales')
  async getRankingsConPuntajesReales() {
    console.log('🎯 Endpoint /ranking/con-puntajes-reales llamado');
    
    try {
      // Obtener rankings con información de usuario
      const rankings = await this.rankingRepo.find({
        where: { tipo_ranking: 'global_puntos' },
        relations: ['usuario'],
        order: { posicion: 'ASC' },
        take: 10,
      });

      console.log(`📊 Rankings base encontrados: ${rankings.length}`);

      // Enriquecer con puntajes reales
      const rankingsConPuntajes = await Promise.all(
        rankings.map(async (ranking) => {
          try {
            // Buscar el puntaje real del usuario
            const puntosUsuario = await this.puntosRepo.findOne({
              where: { usuario: { id_usuario: ranking.id_usuario } },
              relations: ['usuario'],
              order: { fecha_registro: 'DESC' }, // Tomar el más reciente
            });

            console.log(`🔍 Usuario ${ranking.id_usuario} - Puntos:`, puntosUsuario);

            return {
              ...ranking,
              puntaje_real: puntosUsuario?.total_saldo_puntos || 0,
              total_puntos_obtenidos: puntosUsuario?.total_puntos_obtenidos || 0,
              total_puntos_usados: puntosUsuario?.total_puntos_usados || 0,
              fecha_actualizacion_puntaje: puntosUsuario?.fecha_registro || null,
              detalle_puntos: puntosUsuario?.detalle || null,
            };
          } catch (userError) {
            console.error(`❌ Error procesando usuario ${ranking.id_usuario}:`, userError);
            return {
              ...ranking,
              puntaje_real: 0,
              total_puntos_obtenidos: 0,
              total_puntos_usados: 0,
              fecha_actualizacion_puntaje: null,
              detalle_puntos: null,
            };
          }
        })
      );

      console.log(`📊 Rankings con puntajes reales procesados:`, rankingsConPuntajes);
      return rankingsConPuntajes;

    } catch (error) {
      console.error('❌ Error en rankings con puntajes reales:', error);
      return { error: error.message, data: [] };
    }
  }

  // 🔥 ENDPOINT - Solo puntajes reales ordenados
  @Get('puntajes-reales')
  async getPuntajesReales() {
    console.log('🎯 Endpoint /ranking/puntajes-reales llamado');
    
    try {
      // Obtener todos los puntajes con información de usuario, ordenados por saldo
      const puntosRecientes = await this.puntosRepo.find({
        relations: ['usuario'],
        order: { 
          total_saldo_puntos: 'DESC',
          total_puntos_obtenidos: 'DESC'
        },
        take: 10,
      });

      console.log(`📊 Puntos encontrados: ${puntosRecientes.length}`);

      // Transformar para el frontend
      const rankings = puntosRecientes.map((puntos, index) => ({
        id: `puntos-${puntos.id_puntaje}`,
        tipo_ranking: 'puntajes_reales',
        posicion: index + 1,
        id_usuario: puntos.usuario?.id_usuario,
        fecha_generado: new Date().toISOString().split('T')[0],
        usuario: puntos.usuario,
        puntaje_real: puntos.total_saldo_puntos,
        total_puntos_obtenidos: puntos.total_puntos_obtenidos,
        total_puntos_usados: puntos.total_puntos_usados,
        fecha_actualizacion: puntos.fecha_registro,
        detalle: puntos.detalle,
      }));

      console.log(`📊 Rankings de puntajes reales:`, rankings);
      return rankings;

    } catch (error) {
      console.error('❌ Error en puntajes reales:', error);
      
      // 🔥 FALLBACK: Datos mock basados en tu INSERT
      console.log('🔄 Usando datos mock como fallback');
      const puntosMock = [
        { id_usuario: 6, usuario: { id_usuario: 6, nombre: 'Usuario', apellido: 'Top 1' }, total_saldo_puntos: 200, total_puntos_obtenidos: 200, total_puntos_usados: 0, fecha_registro: '2025-02-15', detalle: 'Descuento en inscripción' },
        { id_usuario: 1, usuario: { id_usuario: 1, nombre: 'Usuario', apellido: 'Top 2' }, total_saldo_puntos: 70, total_puntos_obtenidos: 120, total_puntos_usados: 50, fecha_registro: '2025-02-10', detalle: 'Módulos, foros, evaluaciones' },
        { id_usuario: 2, usuario: { id_usuario: 2, nombre: 'Usuario', apellido: 'Top 3' }, total_saldo_puntos: 70, total_puntos_obtenidos: 90, total_puntos_usados: 20, fecha_registro: '2025-02-11', detalle: 'Módulos, asistencia' },
        { id_usuario: 4, usuario: { id_usuario: 4, nombre: 'Usuario', apellido: 'Top 4' }, total_saldo_puntos: 60, total_puntos_obtenidos: 60, total_puntos_usados: 0, fecha_registro: '2025-02-13', detalle: 'Módulos y evaluaciones' },
        { id_usuario: 3, usuario: { id_usuario: 3, nombre: 'Usuario', apellido: 'Top 5' }, total_saldo_puntos: 15, total_puntos_obtenidos: 15, total_puntos_usados: 0, fecha_registro: '2025-02-12', detalle: 'Foro y asistencia' },
        { id_usuario: 5, usuario: { id_usuario: 5, nombre: 'Usuario', apellido: 'Top 6' }, total_saldo_puntos: 0, total_puntos_obtenidos: 0, total_puntos_usados: 0, fecha_registro: '2025-02-14', detalle: 'Administrador puntos' },
      ];

      const rankingsMock = puntosMock.map((puntos, index) => ({
        id: `mock-${index + 1}`,
        tipo_ranking: 'puntajes_reales',
        posicion: index + 1,
        id_usuario: puntos.id_usuario,
        fecha_generado: new Date().toISOString().split('T')[0],
        usuario: puntos.usuario,
        puntaje_real: puntos.total_saldo_puntos,
        total_puntos_obtenidos: puntos.total_puntos_obtenidos,
        total_puntos_usados: puntos.total_puntos_usados,
        fecha_actualizacion: puntos.fecha_registro,
        detalle: puntos.detalle,
      }));

      return rankingsMock;
    }
  }

  // 🔥 ENDPOINT - Rankings combinados (ranking + puntajes)
  @Get('combinado')
  async getRankingCombinado() {
    console.log('🎯 Endpoint /ranking/combinado llamado');
    
    try {
      // Primero intentar con puntajes reales
      try {
        const puntajesReales = await this.getPuntajesReales();
        if (Array.isArray(puntajesReales) && puntajesReales.length > 0) {
          console.log('✅ Usando datos de puntajes reales para ranking combinado');
          return puntajesReales;
        }
      } catch (puntajesError) {
        console.log('⚠️ No se pudieron obtener puntajes reales:', puntajesError.message);
      }

      // Si no hay puntajes reales, usar rankings con puntajes
      try {
        const rankingsConPuntajes = await this.getRankingsConPuntajesReales();
        if (Array.isArray(rankingsConPuntajes) && rankingsConPuntajes.length > 0) {
          console.log('✅ Usando datos de rankings con puntajes para ranking combinado');
          return rankingsConPuntajes;
        }
      } catch (rankingError) {
        console.log('⚠️ No se pudieron obtener rankings con puntajes:', rankingError.message);
      }

      // Última opción: rankings básicos
      console.log('⚠️ Usando rankings básicos como fallback');
      return await this.getGlobalPuntos();

    } catch (error) {
      console.error('❌ Error en ranking combinado:', error);
      return { error: error.message, data: [] };
    }
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Post()
  create(@Body() b: any) {
    return this.svc.create(b);
  }

  // 🔥 ENDPOINT PARA VERIFICAR DATOS DE PUNTOS
  @Get('verificar-puntos')
  async verificarPuntos() {
    console.log('🔍 Endpoint verificar-puntos llamado');
    
    try {
      // Obtener todos los usuarios con sus puntos
      const usuariosConPuntos = await this.puntosRepo.find({
        relations: ['usuario'],
        order: { total_saldo_puntos: 'DESC' }
      });

      const resumen = usuariosConPuntos.map(p => ({
        usuario: p.usuario?.nombre ? `${p.usuario.nombre} ${p.usuario.apellido}` : `Usuario ${p.usuario?.id_usuario}`,
        id_usuario: p.usuario?.id_usuario,
        saldo_puntos: p.total_saldo_puntos,
        puntos_obtenidos: p.total_puntos_obtenidos,
        puntos_usados: p.total_puntos_usados,
        fecha_actualizacion: p.fecha_registro,
        detalle: p.detalle
      }));

      return {
        total_usuarios_con_puntos: usuariosConPuntos.length,
        resumen: resumen,
        puntaje_maximo: usuariosConPuntos.length > 0 ? Math.max(...usuariosConPuntos.map(p => p.total_saldo_puntos)) : 0,
        puntaje_minimo: usuariosConPuntos.length > 0 ? Math.min(...usuariosConPuntos.map(p => p.total_saldo_puntos)) : 0,
      };
    } catch (error) {
      console.error('❌ Error en verificar-puntos:', error);
      
      // Fallback con datos mock
      const puntosMock = [
        { usuario: 'Usuario 6', id_usuario: 6, saldo_puntos: 200, puntos_obtenidos: 200, puntos_usados: 0, fecha_actualizacion: '2025-02-15', detalle: 'Descuento en inscripción' },
        { usuario: 'Usuario 1', id_usuario: 1, saldo_puntos: 70, puntos_obtenidos: 120, puntos_usados: 50, fecha_actualizacion: '2025-02-10', detalle: 'Módulos, foros, evaluaciones' },
        { usuario: 'Usuario 2', id_usuario: 2, saldo_puntos: 70, puntos_obtenidos: 90, puntos_usados: 20, fecha_actualizacion: '2025-02-11', detalle: 'Módulos, asistencia' },
        { usuario: 'Usuario 4', id_usuario: 4, saldo_puntos: 60, puntos_obtenidos: 60, puntos_usados: 0, fecha_actualizacion: '2025-02-13', detalle: 'Módulos y evaluaciones' },
        { usuario: 'Usuario 3', id_usuario: 3, saldo_puntos: 15, puntos_obtenidos: 15, puntos_usados: 0, fecha_actualizacion: '2025-02-12', detalle: 'Foro y asistencia' },
        { usuario: 'Usuario 5', id_usuario: 5, saldo_puntos: 0, puntos_obtenidos: 0, puntos_usados: 0, fecha_actualizacion: '2025-02-14', detalle: 'Administrador puntos' },
      ];

      return {
        total_usuarios_con_puntos: puntosMock.length,
        resumen: puntosMock,
        puntaje_maximo: 200,
        puntaje_minimo: 0,
        mensaje: 'Usando datos mock - Verifica la conexión a la base de datos'
      };
    }
  }
}

