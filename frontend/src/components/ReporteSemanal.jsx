import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import './ReporteSemanal.css';

const ReporteSemanal = ({ onNavigate }) => {
  const { user } = useAuthContext();
  const [reporteData, setReporteData] = useState(null);
  const [reporteGeneral, setReporteGeneral] = useState(null);
  const [reporteNuevosEstudiantes, setReporteNuevosEstudiantes] = useState(null);
  const [reporteActividadNuevos, setReporteActividadNuevos] = useState(null);
  const [actividadIndividual, setActividadIndividual] = useState(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('ultimo_mes');
  const [fechaInicio, setFechaInicio] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  );
  const [fechaFin, setFechaFin] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [mostrarEditoresFecha, setMostrarEditoresFecha] = useState(false);
  const [fechaInicioEditada, setFechaInicioEditada] = useState('');
  const [fechaFinEditada, setFechaFinEditada] = useState('');
  const [cargandoReportesNuevos, setCargandoReportesNuevos] = useState(false);
  const [cargandoActividadIndividual, setCargandoActividadIndividual] = useState(false);

  useEffect(() => {
    cargarReportes();
  }, []);

  // FUNCIÓN MEJORADA: Usa onNavigate si existe, de lo contrario intenta otras opciones
  const handleGoBack = () => {
    // Opción 1: Si existe onNavigate (como en AdminDashboard)
    if (onNavigate) {
      console.log('Usando onNavigate para volver a admin-dashboard');
      onNavigate('admin-dashboard');
      return;
    }
    
    // Opción 2: Intentar volver a la página anterior
    if (window.history.length > 1) {
      console.log('Usando history.back()');
      window.history.back();
      return;
    }
    
    // Opción 3: Redirigir a admin usando diferentes rutas posibles
    console.log('Redirigiendo directamente a /admin');
    
    // Prueba diferentes formatos de ruta
    const baseUrl = window.location.origin;
    const possiblePaths = [
      '/admin',
      '/#/admin',
      '/admin-dashboard',
      '/#/admin-dashboard'
    ];
    
    for (const path of possiblePaths) {
      try {
        const fullUrl = baseUrl + path;
        console.log('Intentando:', fullUrl);
        window.location.href = fullUrl;
        return;
      } catch (error) {
        console.log('Ruta no funcionó:', error);
      }
    }
    
    // Opción 4: Último recurso - recargar la página principal
    console.log('Recargando página principal');
    window.location.href = baseUrl;
  };

  const cargarReportes = async () => {
    try {
      setLoading(true);
      
      const responseSemanal = await fetch(`http://localhost:3000/api/reportes/semanal/${user.id_usuario}`);
      const dataSemanal = await responseSemanal.json();
      setReporteData(dataSemanal);

      const responseGeneral = await fetch('http://localhost:3000/api/reportes/general');
      const dataGeneral = await responseGeneral.json();
      setReporteGeneral(dataGeneral);

    } catch (error) {
      console.error('Error cargando reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarNuevosEstudiantes = async () => {
    try {
      setCargandoReportesNuevos(true);
      
      const response = await fetch(
        `http://localhost:3000/api/reportes/nuevos-estudiantes?inicio=${fechaInicio}&fin=${fechaFin}`
      );
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setReporteNuevosEstudiantes(data);
      
      if (data.nuevosEstudiantes && data.nuevosEstudiantes.length > 0) {
        await cargarActividadNuevosEstudiantes(data.nuevosEstudiantes.map(e => e.id_usuario));
      } else {
        setReporteActividadNuevos({ actividad: [] });
      }
      
    } catch (error) {
      console.error('Error cargando nuevos estudiantes:', error);
      setReporteNuevosEstudiantes({
        total: 0,
        variacion: '0%',
        nuevosEstudiantes: []
      });
      setReporteActividadNuevos({ actividad: [] });
    } finally {
      setCargandoReportesNuevos(false);
    }
  };

  const cargarActividadNuevosEstudiantes = async (idsUsuarios) => {
    try {
      console.log('🔍 [DEBUG] IDs enviados al backend:', idsUsuarios);
      
      if (!idsUsuarios || idsUsuarios.length === 0) {
        console.warn('⚠️  No hay IDs para enviar');
        setReporteActividadNuevos({ actividad: [] });
        return;
      }

      const idsString = idsUsuarios.join(',');
      console.log('📤 [DEBUG] IDs como string:', idsString);
      
      const response = await fetch(
        `http://localhost:3000/api/reportes/actividad-nuevos?ids=${idsString}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log('📤 [DEBUG] Estado de respuesta:', response.status);
      console.log('📤 [DEBUG] URL completa:', response.url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [DEBUG] Error en respuesta:', errorText);
        throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ [DEBUG] Datos recibidos:', data);
      console.log('✅ [DEBUG] Cantidad de actividades:', data.actividad?.length || 0);
      
      setReporteActividadNuevos(data);
      
    } catch (error) {
      console.error('❌ [DEBUG] Error completo:', error);
      setReporteActividadNuevos({ actividad: [] });
    }
  };

  const cargarActividadIndividual = async (idUsuario, estudiante) => {
    try {
      setCargandoActividadIndividual(true);
      setEstudianteSeleccionado(estudiante);
      
      const response = await fetch(
        `http://localhost:3000/api/reportes/actividad-nuevos?ids=${idUsuario}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      setActividadIndividual({
        ...data.actividad?.[0] || {},
        estudianteInfo: estudiante
      });
      
      setActiveTab('actividad-detalle');
      
    } catch (error) {
      console.error('Error cargando actividad individual:', error);
      setActividadIndividual(null);
    } finally {
      setCargandoActividadIndividual(false);
    }
  };

  const cargarInfoDetalladaEstudiante = async (idUsuario) => {
    try {
      const [cursosResponse, puntosResponse, recompensasResponse] = await Promise.all([
        fetch(`http://localhost:3000/api/inscripciones/usuario/${idUsuario}`),
        fetch(`http://localhost:3000/api/puntos/usuario/${idUsuario}`),
        fetch(`http://localhost:3000/api/canjes/usuario/${idUsuario}`)
      ]);
      
      return {
        cursos: cursosResponse.ok ? await cursosResponse.json() : [],
        puntos: puntosResponse.ok ? await puntosResponse.json() : [],
        recompensas: recompensasResponse.ok ? await recompensasResponse.json() : []
      };
      
    } catch (error) {
      console.error('Error cargando información detallada:', error);
      return { cursos: [], puntos: [], recompensas: [] };
    }
  };

  const handlePeriodoChange = (periodo) => {
    setPeriodoSeleccionado(periodo);
    
    setMostrarEditoresFecha(periodo === 'personalizado');

    const hoy = new Date();
    const nuevaFechaInicio = new Date();
    
    switch(periodo) {
      case 'ultima_semana':
        nuevaFechaInicio.setDate(hoy.getDate() - 7);
        break;
      case 'ultimo_mes':
        nuevaFechaInicio.setDate(hoy.getDate() - 30);
        break;
      case 'ultimos_3_meses':
        nuevaFechaInicio.setDate(hoy.getDate() - 90);
        break;
      case 'ultimo_anio':
        nuevaFechaInicio.setDate(hoy.getDate() - 365);
        break;
      case 'personalizado':
        setFechaInicioEditada(fechaInicio);
        setFechaFinEditada(fechaFin);
        return;
      default:
        nuevaFechaInicio.setDate(hoy.getDate() - 30);
    }
    
    setFechaInicio(nuevaFechaInicio.toISOString().split('T')[0]);
    setFechaFin(hoy.toISOString().split('T')[0]);
    
    if (activeTab === 'nuevos' || activeTab === 'actividad') {
      cargarNuevosEstudiantes();
    }
  };

  const aplicarFechasPersonalizadas = () => {
    if (!fechaInicioEditada || !fechaFinEditada) {
      alert('Por favor, selecciona ambas fechas');
      return;
    }
    
    if (new Date(fechaInicioEditada) > new Date(fechaFinEditada)) {
      alert('La fecha de inicio no puede ser mayor que la fecha final');
      return;
    }
    
    setFechaInicio(fechaInicioEditada);
    setFechaFin(fechaFinEditada);
    
    cargarNuevosEstudiantes();
    
    setMostrarEditoresFecha(false);
  };

  useEffect(() => {
    if (activeTab === 'nuevos' || activeTab === 'actividad') {
      if (!reporteNuevosEstudiantes) {
        cargarNuevosEstudiantes();
      }
    }
  }, [activeTab]);

  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'N/A';
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatearFechaHora = (fechaString) => {
    if (!fechaString) return 'N/A';
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calcularEstadisticasActividad = () => {
    if (!reporteActividadNuevos?.actividad || reporteActividadNuevos.actividad.length === 0) {
      return {
        totalEstudiantes: 0,
        totalCursos: 0,
        totalPuntos: 0,
        totalRecompensas: 0,
        promedioCursos: '0.0',
        promedioPuntos: '0.0',
        estudiantesActivos: 0,
        tasaActividad: '0.0'
      };
    }
    
    const actividad = reporteActividadNuevos.actividad;
    const totalEstudiantes = actividad.length;
    
    const totalCursos = actividad.reduce((sum, a) => {
      const cursos = parseInt(a.cursos_inscritos) || 0;
      return sum + cursos;
    }, 0);
    
    const totalPuntos = actividad.reduce((sum, a) => {
      const puntos = parseFloat(a.puntos_obtenidos) || 0;
      return sum + puntos;
    }, 0);
    
    const totalRecompensas = actividad.reduce((sum, a) => {
      const recompensas = parseInt(a.recompensas_canjeadas) || 0;
      return sum + recompensas;
    }, 0);
    
    const estudiantesActivos = actividad.filter(a => {
      const cursos = parseInt(a.cursos_inscritos) || 0;
      return cursos > 0;
    }).length;
    
    return {
      totalEstudiantes,
      totalCursos,
      totalPuntos,
      totalRecompensas,
      promedioCursos: (totalCursos / totalEstudiantes || 0).toFixed(1),
      promedioPuntos: (totalPuntos / totalEstudiantes || 0).toFixed(1),
      estudiantesActivos,
      tasaActividad: totalEstudiantes > 0 ? ((estudiantesActivos / totalEstudiantes) * 100).toFixed(1) : '0.0'
    };
  };

  if (loading) {
    return (
      <div className="reporte-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando reportes...</p>
        </div>
      </div>
    );
  }

  const statsActividad = calcularEstadisticasActividad();

  return (
    <div className="reporte-container">
      <div className="reporte-header">
        <div className="header-top-row">
          <button onClick={handleGoBack} className="btn-back">
            ← Volver a Panel de Admin
          </button>
          <button onClick={cargarReportes} className="btn-refresh">
            🔄 Actualizar Reportes
          </button>
        </div>
        <h1>📊 Reporte de Progreso</h1>
        <p>Estadísticas de tu aprendizaje y del sistema</p>
      </div>

      <div className="tabs-navigation">
        <button 
          className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          📈 Mi Progreso
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sistema' ? 'active' : ''}`}
          onClick={() => setActiveTab('sistema')}
        >
          🏆 Sistema
        </button>
        <button 
          className={`tab-btn ${activeTab === 'asistencia' ? 'active' : ''}`}
          onClick={() => setActiveTab('asistencia')}
        >
          👥 Asistencia
        </button>
        <button 
          className={`tab-btn ${activeTab === 'nuevos' ? 'active' : ''}`}
          onClick={() => setActiveTab('nuevos')}
        >
          🆕 Nuevos Estudiantes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'actividad' ? 'active' : ''}`}
          onClick={() => setActiveTab('actividad')}
        >
          📋 Actividad General
        </button>
        {actividadIndividual && (
          <button 
            className={`tab-btn ${activeTab === 'actividad-detalle' ? 'active' : ''}`}
            onClick={() => setActiveTab('actividad-detalle')}
          >
            👤 {estudianteSeleccionado?.nombre_completo?.split(' ')[0] || 'Detalle'}
          </button>
        )}
      </div>

      <div className="tab-content">
        {activeTab === 'personal' && reporteData && (
          <div className="seccion-reporte">
            <h2>🎯 Tu Progreso Académico</h2>
            
            <div className="stats-grid-personal">
              <div className="stat-card personal">
                <div className="stat-icon">📚</div>
                <div className="stat-value">{reporteData.cursosCompletados}</div>
                <div className="stat-label">Cursos Completados</div>
              </div>
              
              <div className="stat-card personal">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">{reporteData.puntosTotales}</div>
                <div className="stat-label">Puntos Totales</div>
              </div>
              
              <div className="stat-card personal">
                <div className="stat-icon">🔥</div>
                <div className="stat-value">{reporteData.actividadesCompletadas}</div>
                <div className="stat-label">Actividades Esta Semana</div>
              </div>
              
              <div className="stat-card personal">
                <div className="stat-icon">🎓</div>
                <div className="stat-value">{reporteData.promedioNotas.toFixed(1)}</div>
                <div className="stat-label">Promedio de Calificaciones</div>
              </div>
            </div>

            <div className="progreso-detalle">
              <h3>📅 Resumen Semanal</h3>
              <div className="detalle-grid">
                <div className="detalle-item">
                  <span className="detalle-label">Fecha de generación:</span>
                  <span className="detalle-valor">
                    {new Date(reporteData.fechaGeneracion).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="detalle-item">
                  <span className="detalle-label">Estado académico:</span>
                  <span className="detalle-valor estado-bueno">
                    {reporteData.promedioNotas >= 70 ? 'Excelente' : 'En progreso'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sistema' && reporteGeneral && (
          <div className="seccion-reporte">
            <h2>🏆 Estadísticas Generales del Sistema</h2>
            
            <div className="reporte-grupo">
              <h3>🎓 Cursos Más Populares</h3>
              <div className="lista-items">
                {reporteGeneral.cursosMasDemandados?.map((curso, index) => (
                  <div key={index} className="item-lista destacado">
                    <div className="item-ranking">#{index + 1}</div>
                    <div className="item-info">
                      <span className="item-nombre">{curso.nombre}</span>
                      <span className="item-desc">{curso.valor} inscripciones</span>
                    </div>
                    <div className="item-badge">{curso.valor}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reporte-grupo">
              <h3>🏅 Top Estudiantes - Mejor Promedio</h3>
              <div className="lista-items">
                {reporteGeneral.mejorDesempeno?.map((usuario, index) => (
                  <div key={index} className="item-lista">
                    <div className="item-ranking">#{index + 1}</div>
                    <div className="item-info">
                      <span className="item-nombre">{usuario.nombre}</span>
                      <span className="item-desc">Promedio: {parseFloat(usuario.valor).toFixed(1)}</span>
                    </div>
                    <div className={`item-puntaje ${index === 0 ? 'top-1' : ''}`}>
                      {parseFloat(usuario.valor).toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reporte-grupo">
              <h3>🎁 Recompensas Más Canjeadas</h3>
              <div className="lista-items">
                {reporteGeneral.recompensasMasUsadas?.map((recompensa, index) => (
                  <div key={index} className="item-lista recompensa">
                    <div className="item-ranking">#{index + 1}</div>
                    <div className="item-info">
                      <span className="item-nombre">{recompensa.nombre}</span>
                      <span className="item-desc">{recompensa.valor} canjes realizados</span>
                    </div>
                    <div className="item-badge recompensa">{recompensa.valor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'asistencia' && reporteGeneral && (
          <div className="seccion-reporte">
            <h2>👥 Estadísticas de Asistencia</h2>
            <div className="asistencia-header">
              <div className="total-usuarios">
                <span className="total-label">Total de Usuarios:</span>
                <span className="total-value">{reporteGeneral.totalUsuarios}</span>
              </div>
            </div>

            <div className="lista-asistencia">
              {reporteGeneral.estadisticasAsistencia?.map((asistencia, index) => (
                <div key={index} className="item-asistencia">
                  <div className="usuario-info">
                    <span className="usuario-nombre">{asistencia.usuario}</span>
                    <div className="asistencia-stats">
                      <span className="asistencia-presente">
                        ✅ {asistencia.total_presentes} presentes
                      </span>
                      <span className="asistencia-ausente">
                        ❌ {asistencia.total_ausentes} ausentes
                      </span>
                    </div>
                  </div>
                  <div className="asistencia-total">
                    <span className="porcentaje-asistencia">
                      {Math.round((asistencia.total_presentes / (asistencia.total_presentes + asistencia.total_ausentes || 1)) * 100)}%
                    </span>
                    <span className="asistencia-label">Asistencia</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'nuevos' && (
          <div className="seccion-reporte">
            <h2>🆕 Nuevos Estudiantes Registrados</h2>
            
            <div className="filtro-periodo">
              <h3>📅 Seleccionar Período</h3>
              <div className="filtro-periodo-opciones">
                <button 
                  className={`periodo-btn ${periodoSeleccionado === 'ultima_semana' ? 'active' : ''}`}
                  onClick={() => handlePeriodoChange('ultima_semana')}
                >
                  Última Semana
                </button>
                <button 
                  className={`periodo-btn ${periodoSeleccionado === 'ultimo_mes' ? 'active' : ''}`}
                  onClick={() => handlePeriodoChange('ultimo_mes')}
                >
                  Último Mes
                </button>
                <button 
                  className={`periodo-btn ${periodoSeleccionado === 'ultimos_3_meses' ? 'active' : ''}`}
                  onClick={() => handlePeriodoChange('ultimos_3_meses')}
                >
                  Últimos 3 Meses
                </button>
                <button 
                  className={`periodo-btn ${periodoSeleccionado === 'ultimo_anio' ? 'active' : ''}`}
                  onClick={() => handlePeriodoChange('ultimo_anio')}
                >
                  Último Año
                </button>
                <button 
                  className={`periodo-btn ${periodoSeleccionado === 'personalizado' ? 'active' : ''}`}
                  onClick={() => handlePeriodoChange('personalizado')}
                >
                  Personalizado
                </button>
              </div>
              
              {mostrarEditoresFecha && (
                <div className="selector-fechas-personalizado">
                  <div className="fecha-input-group">
                    <label htmlFor="fechaInicioPersonalizada">Desde:</label>
                    <input
                      type="date"
                      id="fechaInicioPersonalizada"
                      value={fechaInicioEditada}
                      onChange={(e) => setFechaInicioEditada(e.target.value)}
                      max={fechaFinEditada}
                    />
                  </div>
                  <div className="fecha-input-group">
                    <label htmlFor="fechaFinPersonalizada">Hasta:</label>
                    <input
                      type="date"
                      id="fechaFinPersonalizada"
                      value={fechaFinEditada}
                      onChange={(e) => setFechaFinEditada(e.target.value)}
                      min={fechaInicioEditada}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="fecha-botones-accion">
                    <button 
                      onClick={aplicarFechasPersonalizadas}
                      className="btn-aplicar-fechas"
                    >
                      Aplicar Fechas
                    </button>
                    <button 
                      onClick={() => setMostrarEditoresFecha(false)}
                      className="btn-cancelar-fechas"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
              
              <div className="fechas-seleccionadas">
                <div className="fecha-info">
                  <p>
                    <strong>Período actual:</strong> {formatearFecha(fechaInicio)} - {formatearFecha(fechaFin)}
                  </p>
                  <button 
                    className="btn-editar-fechas"
                    onClick={() => {
                      setFechaInicioEditada(fechaInicio);
                      setFechaFinEditada(fechaFin);
                      setMostrarEditoresFecha(true);
                      setPeriodoSeleccionado('personalizado');
                    }}
                  >
                    ✏️ Editar Fechas
                  </button>
                </div>
                
                <button 
                  onClick={cargarNuevosEstudiantes} 
                  className="btn-cargar-datos"
                  disabled={cargandoReportesNuevos}
                >
                  {cargandoReportesNuevos ? 'Cargando...' : '🔍 Buscar en este Período'}
                </button>
              </div>
            </div>

            {cargandoReportesNuevos ? (
              <div className="loading-interno">
                <div className="spinner pequeño"></div>
                <p>Cargando datos de nuevos estudiantes...</p>
              </div>
            ) : reporteNuevosEstudiantes ? (
              <>
                <div className="stats-grid-nuevos">
                  <div className="stat-card nuevo">
                    <div className="stat-icon">👥</div>
                    <div className="stat-value">{reporteNuevosEstudiantes.total || 0}</div>
                    <div className="stat-label">Total Nuevos Estudiantes</div>
                  </div>
                  
                  <div className="stat-card nuevo">
                    <div className="stat-icon">📈</div>
                    <div className="stat-value">{reporteNuevosEstudiantes.variacion || '0%'}</div>
                    <div className="stat-label">Variación vs Período Anterior</div>
                  </div>
                </div>

                <div className="reporte-grupo">
                  <h3>📋 Lista de Nuevos Estudiantes ({reporteNuevosEstudiantes.nuevosEstudiantes?.length || 0})</h3>
                  <p className="instruccion-click">
                    💡 Haz clic en cualquier estudiante para ver su actividad detallada
                  </p>
                  <div className="lista-items">
                    {reporteNuevosEstudiantes.nuevosEstudiantes?.length > 0 ? (
                      reporteNuevosEstudiantes.nuevosEstudiantes.map((estudiante, index) => (
                        <div 
                          key={index} 
                          className="item-lista nuevo-estudiante clickeable"
                          onClick={() => cargarActividadIndividual(estudiante.id_usuario, estudiante)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="item-ranking">#{index + 1}</div>
                          <div className="item-info">
                            <span className="item-nombre">{estudiante.nombre_completo}</span>
                            <span className="item-desc">
                              Email: {estudiante.email} • Registro: {formatearFecha(estudiante.fecha_registro)}
                            </span>
                          </div>
                          <div className="item-acciones">
                            <div className="item-badge nuevo">
                              Nuevo
                            </div>
                            <div className="item-fecha">
                              {formatearFecha(estudiante.fecha_registro)}
                            </div>
                            <div className="item-icono-click">
                              👁️ Ver actividad
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="item-lista vacio">
                        <div className="item-info">
                          <span className="item-nombre">No hay nuevos estudiantes en este período</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="sin-datos">
                <p>No hay datos de nuevos estudiantes disponibles</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'actividad' && (
          <div className="seccion-reporte">
            <h2>📋 Actividad de Usuarios Nuevos</h2>
            <p className="subtitulo-actividad">
              Estadísticas de actividad de estudiantes registrados en el período seleccionado
            </p>

            <div className="info-periodo-actividad">
              <span className="info-periodo-label">Período seleccionado:</span>
              <span className="info-periodo-valor">
                {formatearFecha(fechaInicio)} - {formatearFecha(fechaFin)}
              </span>
              <button 
                onClick={() => setActiveTab('nuevos')}
                className="btn-cambiar-periodo"
              >
                Cambiar Período
              </button>
            </div>

            {cargandoReportesNuevos ? (
              <div className="loading-interno">
                <div className="spinner pequeño"></div>
                <p>Cargando actividad de nuevos estudiantes...</p>
              </div>
            ) : reporteActividadNuevos ? (
              <>
                <div className="stats-grid-actividad">
                  <div className="stat-card actividad">
                    <div className="stat-icon">👥</div>
                    <div className="stat-value">{statsActividad.totalEstudiantes}</div>
                    <div className="stat-label">Total Estudiantes</div>
                    <div className="stat-sub">
                      {statsActividad.estudiantesActivos} activos
                    </div>
                  </div>
                  
                  <div className="stat-card actividad">
                    <div className="stat-icon">📚</div>
                    <div className="stat-value">{statsActividad.totalCursos}</div>
                    <div className="stat-label">Cursos Inscritos</div>
                    <div className="stat-sub">Promedio: {statsActividad.promedioCursos}</div>
                  </div>
                  
                  <div className="stat-card actividad">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-value">{statsActividad.totalPuntos}</div>
                    <div className="stat-label">Puntos Obtenidos</div>
                    <div className="stat-sub">Promedio: {statsActividad.promedioPuntos}</div>
                  </div>
                  
                  <div className="stat-card actividad">
                    <div className="stat-icon">🎁</div>
                    <div className="stat-value">{statsActividad.totalRecompensas}</div>
                    <div className="stat-label">Recompensas Canjeadas</div>
                  </div>
                </div>

                <div className="tasa-participacion">
                  <h3>📈 Tasa de Participación: {statsActividad.tasaActividad}%</h3>
                  <div className="barra-participacion">
                    <div 
                      className="barra-activos" 
                      style={{ width: `${statsActividad.tasaActividad}%` }}
                    >
                      <span className="barra-texto">
                        Activos: {statsActividad.estudiantesActivos}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="reporte-grupo">
                  <h3>📊 Actividad Detallada por Estudiante</h3>
                  <div className="tabla-actividad-container">
                    <div className="tabla-actividad">
                      <div className="tabla-header">
                        <div className="tabla-col">Estudiante</div>
                        <div className="tabla-col">Cursos Inscritos</div>
                        <div className="tabla-col">Puntos Obtenidos</div>
                        <div className="tabla-col">Recompensas</div>
                        <div className="tabla-col">Estado</div>
                        <div className="tabla-col">Acción</div>
                      </div>
                      <div className="tabla-body">
                        {reporteActividadNuevos.actividad?.length > 0 ? (
                          reporteActividadNuevos.actividad.map((actividad, index) => (
                            <div key={index} className={`tabla-fila ${(actividad.cursos_inscritos || 0) === 0 ? 'inactivo' : ''}`}>
                              <div className="tabla-col estudiante-info">
                                <span className="estudiante-nombre">{actividad.nombre}</span>
                                <span className="estudiante-email">{actividad.email}</span>
                              </div>
                              <div className="tabla-col">
                                <span className="badge-cursos">
                                  {actividad.cursos_inscritos || 0}
                                </span>
                              </div>
                              <div className="tabla-col">
                                <span className="badge-puntos">
                                  {actividad.puntos_obtenidos || 0}
                                </span>
                              </div>
                              <div className="tabla-col">
                                <span className="badge-recompensas">
                                  {actividad.recompensas_canjeadas || 0}
                                </span>
                              </div>
                              <div className="tabla-col">
                                <span className={`estado-actividad ${(actividad.cursos_inscritos || 0) > 0 ? 'activo' : 'inactivo'}`}>
                                  {(actividad.cursos_inscritos || 0) > 0 ? 'Activo' : 'Inactivo'}
                                </span>
                              </div>
                              <div className="tabla-col">
                                <button 
                                  className="btn-ver-detalle"
                                  onClick={() => {
                                    const estudianteInfo = {
                                      id_usuario: actividad.id_usuario,
                                      nombre_completo: actividad.nombre,
                                      email: actividad.email
                                    };
                                    cargarActividadIndividual(actividad.id_usuario, estudianteInfo);
                                  }}
                                >
                                  👁️ Ver
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="tabla-fila vacio">
                            <div className="tabla-col">
                              {reporteNuevosEstudiantes?.nuevosEstudiantes?.length > 0 
                                ? 'No hay actividad registrada para estos estudiantes'
                                : 'Primero carga estudiantes en la pestaña "Nuevos Estudiantes"'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="sin-datos">
                <p>Primero selecciona un período en la pestaña "Nuevos Estudiantes"</p>
                <button onClick={() => setActiveTab('nuevos')} className="btn-refresh secundario">
                  Ir a Nuevos Estudiantes
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'actividad-detalle' && (
          <div className="seccion-reporte">
            <div className="detalle-estudiante-header">
              <button 
                className="btn-volver"
                onClick={() => setActiveTab('actividad')}
              >
                ← Volver a Actividad General
              </button>
              
              <h2>👤 Actividad Detallada del Estudiante</h2>
              
              {estudianteSeleccionado && (
                <div className="info-estudiante">
                  <div className="info-estudiante-item">
                    <strong>Nombre:</strong> {estudianteSeleccionado.nombre_completo}
                  </div>
                  <div className="info-estudiante-item">
                    <strong>Email:</strong> {estudianteSeleccionado.email}
                  </div>
                  <div className="info-estudiante-item">
                    <strong>Fecha de Registro:</strong> {formatearFecha(estudianteSeleccionado.fecha_registro)}
                  </div>
                </div>
              )}
            </div>

            {cargandoActividadIndividual ? (
              <div className="loading-interno">
                <div className="spinner pequeño"></div>
                <p>Cargando actividad del estudiante...</p>
              </div>
            ) : actividadIndividual ? (
              <>
                <div className="stats-grid-detalle">
                  <div className="stat-card detalle">
                    <div className="stat-icon">📚</div>
                    <div className="stat-value">{actividadIndividual.cursos_inscritos || 0}</div>
                    <div className="stat-label">Cursos Inscritos</div>
                  </div>
                  
                  <div className="stat-card detalle">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-value">{actividadIndividual.puntos_obtenidos || 0}</div>
                    <div className="stat-label">Puntos Obtenidos</div>
                  </div>
                  
                  <div className="stat-card detalle">
                    <div className="stat-icon">🎁</div>
                    <div className="stat-value">{actividadIndividual.recompensas_canjeadas || 0}</div>
                    <div className="stat-label">Recompensas Canjeadas</div>
                  </div>
                  
                  <div className="stat-card detalle">
                    <div className="stat-icon">📅</div>
                    <div className="stat-value-fecha">
                      {actividadIndividual.ultima_actividad 
                        ? formatearFechaHora(actividadIndividual.ultima_actividad)
                        : 'Sin actividad'
                      }
                    </div>
                    <div className="stat-label">Última Actividad</div>
                  </div>
                </div>

                <div className="estado-general">
                  <h3>Estado de Participación</h3>
                  <div className={`badge-estado ${(actividadIndividual.cursos_inscritos || 0) > 0 ? 'activo' : 'inactivo'}`}>
                    {(actividadIndividual.cursos_inscritos || 0) > 0 ? '🎯 ESTUDIANTE ACTIVO' : '💤 ESTUDIANTE INACTIVO'}
                  </div>
                  <p className="mensaje-estado">
                    {(actividadIndividual.cursos_inscritos || 0) > 0 
                      ? 'Este estudiante ha mostrado participación activa en la plataforma.'
                      : 'Este estudiante aún no ha comenzado su participación en cursos.'
                    }
                  </p>
                </div>

                {actividadIndividual.detalles && (
                  <div className="info-adicional">
                    <h3>Información Adicional</h3>
                    <div className="info-adicional-grid">
                      {actividadIndividual.detalles.cursos.length > 0 && (
                        <div className="info-item">
                          <h4>Cursos Inscritos:</h4>
                          <ul>
                            {actividadIndividual.detalles.cursos.slice(0, 5).map((curso, index) => (
                              <li key={index}>{curso.nombre_curso || `Curso ${index + 1}`}</li>
                            ))}
                            {actividadIndividual.detalles.cursos.length > 5 && (
                              <li>... y {actividadIndividual.detalles.cursos.length - 5} más</li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      {actividadIndividual.detalles.recompensas.length > 0 && (
                        <div className="info-item">
                          <h4>Recompensas Canjeadas:</h4>
                          <ul>
                            {actividadIndividual.detalles.recompensas.slice(0, 3).map((recompensa, index) => (
                              <li key={index}>{recompensa.nombre || `Recompensa ${index + 1}`}</li>
                            ))}
                            {actividadIndividual.detalles.recompensas.length > 3 && (
                              <li>... y {actividadIndividual.detalles.recompensas.length - 3} más</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="sin-datos">
                <p>No se pudo cargar la actividad del estudiante</p>
                <button onClick={() => setActiveTab('nuevos')} className="btn-refresh secundario">
                  Seleccionar otro estudiante
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="reporte-footer">
        <p>Reporte generado el {new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>
    </div>
  );
};

export default ReporteSemanal;