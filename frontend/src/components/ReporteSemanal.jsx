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

  // NUEVOS ESTADOS PARA DETALLES
  const [detallesCursos, setDetallesCursos] = useState([]);
  const [detallesCanjes, setDetallesCanjes] = useState([]);
  const [mostrarDetallesCursos, setMostrarDetallesCursos] = useState(false);
  const [mostrarDetallesCanjes, setMostrarDetallesCanjes] = useState(false);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);

  useEffect(() => {
    cargarReportes();
  }, []);

  const handleGoBack = () => {
    if (onNavigate) {
      console.log('Usando onNavigate para volver a admin-dashboard');
      onNavigate('admin-dashboard');
      return;
    }
    
    if (window.history.length > 1) {
      console.log('Usando history.back()');
      window.history.back();
      return;
    }
    
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

// Función para probar múltiples rutas posibles
const probarEndpointsInscripciones = async (idUsuario) => {
  console.log('🔍 === PROBANDO TODOS LOS ENDPOINTS DE INSCRIPCIONES ===');
  
  const endpoints = [
    // Formato estándar
    `/api/inscripciones/usuario/${idUsuario}`,
    `/api/usuarios/${idUsuario}/inscripciones`,
    `/api/users/${idUsuario}/enrollments`,
    
    // Con query parameters
    `/api/inscripciones?userId=${idUsuario}`,
    `/api/inscripciones?usuario=${idUsuario}`,
    `/api/inscripciones?user_id=${idUsuario}`,
    `/api/inscripciones?idUsuario=${idUsuario}`,
    
    // Formato alternativo
    `/api/enrollments?userId=${idUsuario}`,
    `/api/matriculas?usuarioId=${idUsuario}`,
    `/api/cursos-inscritos/${idUsuario}`,
    
    // Para ver todas las inscripciones
    `/api/inscripciones`,
    `/api/todas-inscripciones`
  ];
  
  const resultados = [];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Probando: ${endpoint}`);
      const response = await fetch(`http://localhost:3000${endpoint}`);
      
      const resultado = {
        endpoint,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      };
      
      if (response.ok) {
        const data = await response.json();
        resultado.data = data;
        resultado.count = Array.isArray(data) ? data.length : 'No es array';
        
        // Verificar si contiene datos del usuario específico
        if (Array.isArray(data) && data.length > 0) {
          const primera = data[0];
          const clavesUsuario = Object.keys(primera).filter(key => 
            key.includes('usuario') || key.includes('user') || key.includes('id_usuario')
          );
          resultado.userFields = clavesUsuario;
          
          // Contar cuántas son del usuario
          const delUsuario = data.filter(item => {
            const usuarioId = 
              item.id_usuario || 
              item.usuario_id || 
              item.userId || 
              item.usuarioId;
            return usuarioId == idUsuario;
          });
          resultado.userCount = delUsuario.length;
        }
      }
      
      resultados.push(resultado);
      console.log(`   Status: ${resultado.status}, Count: ${resultado.count}`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      resultados.push({
        endpoint,
        error: error.message
      });
    }
    
    // Pequeña pausa
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📋 RESULTADOS COMPLETOS:', resultados);
  
  // Mostrar resumen
  const endpointsQueFuncionan = resultados.filter(r => r.ok);
  console.log('\n✅ ENDPOINTS QUE FUNCIONAN:');
  endpointsQueFuncionan.forEach(r => {
    console.log(`   ${r.endpoint} - ${r.count} items`);
    if (r.userCount !== undefined) {
      console.log(`     • Del usuario ${idUsuario}: ${r.userCount} items`);
    }
  });
  
  return resultados;
};





  // FUNCIÓN MEJORADA: Cargar cursos del estudiante
const cargarCursosEstudiante = async (idUsuario) => {
  try {
    setCargandoDetalles(true);
    console.log(`🔍 Cargando cursos para usuario: ${idUsuario}`);
    
    // 1. Usar el endpoint específico de progreso
    const responseProgreso = await fetch(`http://localhost:3000/api/inscripciones/progreso-curso/usuario/${idUsuario}`);
    
    if (!responseProgreso.ok) {
      throw new Error(`Error ${responseProgreso.status}: ${responseProgreso.statusText}`);
    }
    
    const datosProgreso = await responseProgreso.json();
    console.log('📊 Datos de progreso del usuario:', datosProgreso);
    
    if (!datosProgreso || datosProgreso.length === 0) {
      setDetallesCursos([]);
      setMostrarDetallesCursos(true);
      setMostrarDetallesCanjes(false);
      alert(`⚠️ No se encontró progreso de cursos para el usuario ${idUsuario}`);
      return;
    }
    
    // 2. Obtener información adicional de los cursos (para nombres y descripciones)
    const responseCursos = await fetch('http://localhost:3000/api/cursos');
    
    if (!responseCursos.ok) {
      throw new Error(`Error al obtener cursos: ${responseCursos.status}`);
    }
    
    const todosLosCursos = await responseCursos.json();
    
    // 3. Crear un mapa de IDs de curso a información
    const mapaCursos = {};
    todosLosCursos.forEach(curso => {
      const id = curso.id_curso || curso.id;
      if (id) {
        mapaCursos[id] = {
          nombre: curso.nombre_curso || curso.nombre || `Curso ${id}`,
          descripcion: curso.descripcion || curso.descripcion_curso || 'Sin descripción',
          duracion: curso.duracion,
          estado_disponibilidad: curso.estado_disponibilidad
        };
      }
    });
    
    // 4. Procesar los datos de progreso - SIN CALIFICACIÓN
    const cursosProcesados = datosProgreso.map((progreso, index) => {
      const idCurso = progreso.id_curso || progreso.curso_id;
      const infoCurso = mapaCursos[idCurso] || {
        nombre: `Curso ${idCurso || 'Desconocido'}`,
        descripcion: 'Información no disponible'
      };
      
      return {
        id: progreso.id_inscripcion || progreso.id || `prog-${index}`,
        nombre_curso: infoCurso.nombre,
        fecha_inscripcion: progreso.fecha_inscripcion || progreso.fecha_registro || 'Fecha no disponible',
        estado: progreso.estado_inscripcion || progreso.estado || 'ACTIVO',
        progreso: parseFloat(progreso.progreso || progreso.porcentaje_completado || 0),
        // CALIFICACIÓN ELIMINADA
        descripcion_curso: infoCurso.descripcion,
        duracion: infoCurso.duracion,
        estado_disponibilidad: infoCurso.estado_disponibilidad,
        id_curso: idCurso,
        id_usuario: progreso.id_usuario || idUsuario,
        
        // Campos específicos del progreso (si existen)
        ultimo_acceso: progreso.ultimo_acceso || progreso.last_access,
        fecha_completado: progreso.fecha_completado || progreso.completion_date,
        horas_estudiadas: progreso.horas_estudiadas || progreso.study_hours,
        
        // Para debug
        _raw: progreso
      };
    });
    
    console.log('🎯 Cursos con progreso procesados:', cursosProcesados);
    
    // 5. Calcular estadísticas - SIMPLIFICADO SIN "CURSOS ACTIVOS"
    const calcularEstadisticas = () => {
      const total = cursosProcesados.length;
      
      // CONTAR CURSOS COMPLETADOS (PROGRESO >= 100)
      const completados = cursosProcesados.filter(c => 
        c.progreso >= 100 || 
        c.estado === 'COMPLETADO' || 
        c.estado === 'completed' ||
        c.estado === 'FINALIZADO'
      ).length;
      
      const promedioProgreso = cursosProcesados.reduce((sum, c) => sum + c.progreso, 0) / total;
      
      return {
        total,
        completados,
        promedioProgreso,
        porcentajeCompletado: (completados / total * 100).toFixed(1)
      };
    };
    
    const estadisticas = calcularEstadisticas();
    console.log('📊 Estadísticas calculadas:', estadisticas);
    
    // 6. Comparar con estadísticas de reportes
    const cursosReportados = actividadIndividual?.cursos_inscritos || 0;
    
    if (estadisticas.total !== parseInt(cursosReportados)) {
      console.warn(`⚠️ Diferencia con reportes:
        Reportes: ${cursosReportados}
        Progreso API: ${estadisticas.total}
        Diferencia: ${estadisticas.total - parseInt(cursosReportados)}`);
    }
    
    // 7. Guardar datos
    setDetallesCursos(cursosProcesados);
    setMostrarDetallesCursos(true);
    setMostrarDetallesCanjes(false);
    
    // 8. Mostrar resumen SIMPLIFICADO
    console.log(`📋 RESUMEN FINAL:
      • Cursos encontrados: ${estadisticas.total}
      • Cursos completados: ${estadisticas.completados} (${estadisticas.porcentajeCompletado}%)
      • Progreso promedio: ${estadisticas.promedioProgreso.toFixed(1)}%`);
    
  } catch (error) {
    console.error('❌ Error cargando cursos con progreso:', error);
    
    // Fallback: intentar con el endpoint antiguo
    try {
      console.log('🔄 Intentando con endpoint alternativo...');
      await cargarCursosEstudianteFallback(idUsuario);
    } catch (fallbackError) {
      console.error('❌ Error en fallback:', fallbackError);
      
      // Mostrar información mínima
      const cursosReportados = actividadIndividual?.cursos_inscritos || 0;
      if (cursosReportados > 0) {
        setDetallesCursos([{
          id: 'error-progreso',
          nombre_curso: 'Error al cargar progreso',
          fecha_inscripcion: new Date().toISOString().split('T')[0],
          estado: 'ERROR',
          progreso: 0,
          // Sin calificación
          descripcion_curso: `Error: ${error.message}. Reportes indican ${cursosReportados} cursos.`
        }]);
      } else {
        setDetallesCursos([]);
      }
      setMostrarDetallesCursos(true);
      setMostrarDetallesCanjes(false);
    }
    
  } finally {
    setCargandoDetalles(false);
  }
};

// Función fallback por si el endpoint de progreso falla - SIMPLIFICADA
const cargarCursosEstudianteFallback = async (idUsuario) => {
  try {
    // Intentar con el endpoint original
    const response = await fetch(`http://localhost:3000/api/inscripciones?usuarioId=${idUsuario}`);
    const data = await response.json();
    
    const inscripcionesUsuario = data.filter(item => {
      const usuarioId = item.id_usuario || item.usuario_id;
      return usuarioId == idUsuario;
    });
    
    if (inscripcionesUsuario.length === 0) {
      setDetallesCursos([]);
      return;
    }
    
    // Obtener información de cursos
    const responseCursos = await fetch('http://localhost:3000/api/cursos');
    const todosLosCursos = await responseCursos.json();
    
    const mapaCursos = {};
    todosLosCursos.forEach(curso => {
      const id = curso.id_curso || curso.id;
      if (id) {
        mapaCursos[id] = {
          nombre: curso.nombre_curso || curso.nombre,
          descripcion: curso.descripcion || curso.descripcion_curso
        };
      }
    });
    
    const cursosProcesados = inscripcionesUsuario.map((ins, index) => {
      const idCurso = ins.id_curso;
      const infoCurso = mapaCursos[idCurso] || { nombre: `Curso ${idCurso}`, descripcion: 'Sin info' };
      
      return {
        id: ins.id_inscripcion || ins.id,
        nombre_curso: infoCurso.nombre,
        fecha_inscripcion: ins.fecha_inscripcion || 'No disponible',
        estado: ins.estado_inscripcion || 'ACTIVO',
        progreso: 0, // Sin información de progreso
        // Sin calificación
        descripcion_curso: infoCurso.descripcion
      };
    });
    
    setDetallesCursos(cursosProcesados);
    setMostrarDetallesCursos(true);
    setMostrarDetallesCanjes(false);
    
  } catch (error) {
    throw error; // Re-lanzar para manejo superior
  }
};


  // FUNCIÓN MEJORADA: Cargar canjes del estudiante
  const cargarCanjesEstudiante = async (idUsuario) => {
    try {
      setCargandoDetalles(true);
      console.log(`Cargando canjes para estudiante ID: ${idUsuario}`);
      
      const response = await fetch(`http://localhost:3000/api/canjes/usuario/${idUsuario}`);
      
      console.log('Respuesta de canjes:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Canjes obtenidos:', data);
        
        if (Array.isArray(data)) {
          // Procesar los datos para tener un formato consistente
          const canjesProcesados = data.map(canje => ({
            id: canje.id_canje || canje.id,
            nombre_recompensa: canje.nombre_recompensa || canje.recompensa?.nombre || 'Recompensa sin nombre',
            fecha_canje: canje.fecha_canje || canje.fecha_registro || 'Fecha no disponible',
            utilizado: canje.utilizado || canje.estado_utilizado || false,
            descripcion_recompensa: canje.descripcion_recompensa || canje.recompensa?.descripcion || 'Sin descripción',
            tipo_recompensa: canje.tipo_recompensa || canje.categoria || 'General',
            // Si hay puntos usados, incluirlos, sino dejar null
            puntos_usados: canje.puntos_usados || canje.costo_puntos || null
          }));
          
          setDetallesCanjes(canjesProcesados);
          setMostrarDetallesCanjes(true);
          setMostrarDetallesCursos(false);
        } else {
          console.error('Los datos de canjes no son un array:', data);
          setDetallesCanjes([]);
          setMostrarDetallesCanjes(true);
          setMostrarDetallesCursos(false);
        }
      } else {
        console.error('Error en la respuesta de canjes:', response.status);
        setDetallesCanjes([]);
        setMostrarDetallesCanjes(true);
        setMostrarDetallesCursos(false);
      }
    } catch (error) {
      console.error('Error cargando canjes:', error);
      // Si hay error, mostrar sección vacía
      setDetallesCanjes([]);
      setMostrarDetallesCanjes(true);
      setMostrarDetallesCursos(false);
    } finally {
      setCargandoDetalles(false);
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
      if (!idsUsuarios || idsUsuarios.length === 0) {
        setReporteActividadNuevos({ actividad: [] });
        return;
      }

      const idsString = idsUsuarios.join(',');
      
      const response = await fetch(
        `http://localhost:3000/api/reportes/actividad-nuevos?ids=${idsString}`,
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
      setReporteActividadNuevos(data);
      
    } catch (error) {
      console.error('Error cargando actividad nuevos estudiantes:', error);
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
      
      // Cerrar los detalles al cargar nueva actividad
      setMostrarDetallesCursos(false);
      setMostrarDetallesCanjes(false);
      
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
                {/* MODIFICADO: Estadísticas con botones clickeables */}
                <div className="stats-grid-detalle">
                  <div 
                    className="stat-card detalle clickeable"
                    onClick={() => {
                      if (actividadIndividual.estudianteInfo?.id_usuario) {
                        cargarCursosEstudiante(actividadIndividual.estudianteInfo.id_usuario);
                      } else {
                        alert('No se puede cargar los cursos: ID de estudiante no disponible');
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                    title="Haz clic para ver los cursos inscritos"
                  >
                    <div className="stat-icon">📚</div>
                    <div className="stat-value">{actividadIndividual.cursos_inscritos || 0}</div>
                    <div className="stat-label">Cursos Inscritos</div>
                    <div className="stat-hint">👆 Haz clic para ver detalles</div>
                  </div>
                  
                  <div className="stat-card detalle">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-value">{actividadIndividual.puntos_obtenidos || 0}</div>
                    <div className="stat-label">Puntos Obtenidos</div>
                  </div>
                  
                  <div 
                    className="stat-card detalle clickeable"
                    onClick={() => {
                      if (actividadIndividual.estudianteInfo?.id_usuario) {
                        cargarCanjesEstudiante(actividadIndividual.estudianteInfo.id_usuario);
                      } else {
                        alert('No se puede cargar los canjes: ID de estudiante no disponible');
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                    title="Haz clic para ver los canjes realizados"
                  >
                    <div className="stat-icon">🎁</div>
                    <div className="stat-value">{actividadIndividual.recompensas_canjeadas || 0}</div>
                    <div className="stat-label">Recompensas Canjeadas</div>
                    <div className="stat-hint">👆 Haz clic para ver detalles</div>
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

                {/* SECCIÓN DE DETALLES DE CURSOS - MEJORADA */}
                {mostrarDetallesCursos && (
                  <div className="detalles-seccion">
    <div className="detalles-header">
      <h3>📚 Cursos Inscritos del Estudiante</h3>
      <button 
        className="btn-cerrar-detalles"
        onClick={() => setMostrarDetallesCursos(false)}
      >
        ✕ Cerrar
      </button>
    </div>
    
    {cargandoDetalles ? (
      <div className="loading-detalles">
        <div className="spinner pequeño"></div>
        <p>Cargando cursos del estudiante...</p>
      </div>
    ) : detallesCursos.length > 0 ? (
      <div className="lista-detalles">
        {/* ESTADÍSTICAS SIMPLIFICADAS */}
        <div className="estadisticas-simples">
          <div className="estadistica-simple">
            <span className="estadistica-numero">{detallesCursos.length}</span>
            <span className="estadistica-texto">Cursos Totales</span>
          </div>
          <div className="estadistica-simple">
            <span className="estadistica-numero">
              {detallesCursos.filter(c => c.progreso >= 100).length}
            </span>
            <span className="estadistica-texto">Completados</span>
          </div>
          <div className="estadistica-simple">
            <span className="estadistica-numero">
              {(
                detallesCursos.reduce((sum, c) => sum + c.progreso, 0) / 
                detallesCursos.length || 0
              ).toFixed(1)}%
            </span>
            <span className="estadistica-texto">Progreso Promedio</span>
          </div>
        </div>
        
        {/* TABLA SIN COLUMNA DE CALIFICACIÓN */}
        <table className="tabla-detalles">
          <thead>
            <tr>
              <th>Curso</th>
              <th>Fecha Inscripción</th>
              <th>Estado</th>
              <th>Progreso</th>
              {/* CALIFICACIÓN ELIMINADA */}
            </tr>
          </thead>
          <tbody>
            {detallesCursos.map((curso, index) => (
              <tr key={index}>
                <td>
                  <strong>{curso.nombre_curso}</strong>
                  <div className="curso-desc">
                    {curso.descripcion_curso}
                  </div>
                </td>
                <td>{formatearFecha(curso.fecha_inscripcion)}</td>
                <td>
                  <span className={`badge-estado ${
                    curso.estado === 'ACTIVO' ? 'activo' : 
                    curso.estado === 'COMPLETADO' ? 'completado' : 
                    'inactivo'
                  }`}>
                    {curso.estado}
                  </span>
                </td>
                <td>
                  <div className="progreso-bar">
                    <div 
                      className="progreso-fill"
                      style={{ width: `${curso.progreso || 0}%` }}
                    ></div>
                    <span className="progreso-text">{curso.progreso || 0}%</span>
                  </div>
                </td>
                {/* CALIFICACIÓN ELIMINADA */}
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* RESUMEN SIMPLIFICADO */}
        <div className="resumen-cursos">
          <p><strong>Total de cursos:</strong> {detallesCursos.length}</p>
          <p><strong>Cursos completados:</strong> {detallesCursos.filter(c => c.progreso >= 100).length}</p>
          <p><strong>Porcentaje completado:</strong> {
            ((detallesCursos.filter(c => c.progreso >= 100).length / detallesCursos.length) * 100 || 0).toFixed(1)
          }%</p>
        </div>
      </div>
    ) : (
      <div className="sin-datos-detalles">
        <p>El estudiante no tiene cursos inscritos</p>
      </div>
    )}
  </div>
)}

                {/* SECCIÓN DE DETALLES DE CANJES - SIMPLIFICADA */}
                {mostrarDetallesCanjes && (
                  <div className="detalles-seccion">
                    <div className="detalles-header">
                      <h3>🎁 Canjes Realizados por el Estudiante</h3>
                      <button 
                        className="btn-cerrar-detalles"
                        onClick={() => setMostrarDetallesCanjes(false)}
                      >
                        ✕ Cerrar
                      </button>
                    </div>
                    
                    {cargandoDetalles ? (
                      <div className="loading-detalles">
                        <div className="spinner pequeño"></div>
                        <p>Cargando canjes del estudiante...</p>
                      </div>
                    ) : detallesCanjes.length > 0 ? (
                      <div className="lista-detalles">
                        <table className="tabla-detalles">
                          <thead>
                            <tr>
                              <th>Recompensa</th>
                              <th>Fecha Canje</th>
                              <th>Tipo</th>
                              <th>Estado</th>
                              <th>Descripción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detallesCanjes.map((canje, index) => (
                              <tr key={index}>
                                <td>
                                  <strong>{canje.nombre_recompensa}</strong>
                                </td>
                                <td>{formatearFecha(canje.fecha_canje)}</td>
                                <td>
                                  <span className="badge-tipo">
                                    {canje.tipo_recompensa}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge-estado ${canje.utilizado ? 'utilizado' : 'disponible'}`}>
                                    {canje.utilizado ? 'UTILIZADO' : 'DISPONIBLE'}
                                  </span>
                                </td>
                                <td>
                                  <div className="canje-desc">
                                    {canje.descripcion_recompensa}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="resumen-canjes">
                          <p><strong>Total de canjes:</strong> {detallesCanjes.length}</p>
                          <p><strong>Canjes utilizados:</strong> {detallesCanjes.filter(c => c.utilizado).length}</p>
                          <p><strong>Canjes disponibles:</strong> {detallesCanjes.filter(c => !c.utilizado).length}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="sin-datos-detalles">
                        <p>El estudiante no ha realizado canjes</p>
                      </div>
                    )}
                  </div>
                )}

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