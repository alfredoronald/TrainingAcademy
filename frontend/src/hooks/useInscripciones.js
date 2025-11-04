import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:3000/api';

export const useInscripciones = (idUsuario) => {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inscribiendo, setInscribiendo] = useState(false);

  // 🆕 FUNCIÓN: Eliminar duplicados basados en id_inscripcion
  const eliminarDuplicados = (inscripcionesArray) => {
    const unique = [];
    const seenIds = new Set();
    
    inscripcionesArray.forEach(insc => {
      if (insc.id_inscripcion && !seenIds.has(insc.id_inscripcion)) {
        seenIds.add(insc.id_inscripcion);
        unique.push(insc);
      } else if (!insc.id_inscripcion) {
        // Si no tiene ID, incluir igual pero con advertencia
        console.warn('⚠️ Inscripción sin id_inscripcion encontrada:', insc);
        unique.push(insc);
      } else {
        console.warn('🔄 Duplicado eliminado - id_inscripcion:', insc.id_inscripcion);
      }
    });
    
    console.log(`🔄 Eliminados ${inscripcionesArray.length - unique.length} duplicados`);
    return unique;
  };

  // 🆕 FUNCIÓN MEJORADA: Validar estructura de datos de inscripción
  const validarInscripcion = (inscripcion, index) => {
    const errores = [];
    
    if (!inscripcion) {
      errores.push(`Inscripción ${index} es null o undefined`);
      return { valida: false, errores };
    }

    // Validar campos obligatorios
    if (!inscripcion.id_inscripcion) {
      errores.push(`Inscripción ${index} no tiene id_inscripcion`);
    }
    
    if (!inscripcion.id_curso) {
      errores.push(`Inscripción ${index} no tiene id_curso`);
    }
    
    if (!inscripcion.id_usuario) {
      errores.push(`Inscripción ${index} no tiene id_usuario`);
    }

    // Validar objeto curso
    if (!inscripcion.curso) {
      errores.push(`Inscripción ${index} no tiene objeto curso`);
    } else {
      if (!inscripcion.curso.id_curso) {
        errores.push(`Inscripción ${index} - curso no tiene id_curso`);
      }
      if (!inscripcion.curso.nombre_curso) {
        errores.push(`Inscripción ${index} - curso no tiene nombre_curso`);
      }
    }

    // 🆕 CORRECCIÓN: Manejar progreso null/undefined de forma más robusta
    let progresoValidado = 0;
    if (inscripcion.progreso === undefined || inscripcion.progreso === null) {
      console.warn(`⚠️ Inscripción ${index} tiene progreso null/undefined, usando 0`);
    } else {
      progresoValidado = Number(inscripcion.progreso);
      if (isNaN(progresoValidado)) {
        errores.push(`Inscripción ${index} - progreso no es número válido: ${inscripcion.progreso}`);
        progresoValidado = 0;
      } else if (progresoValidado < 0 || progresoValidado > 100) {
        errores.push(`Inscripción ${index} - progreso fuera de rango: ${progresoValidado}`);
        progresoValidado = Math.max(0, Math.min(100, progresoValidado));
      }
    }

    // Validar estado
    if (!inscripcion.estado) {
      console.warn(`⚠️ Inscripción ${index} no tiene estado, usando 'ACTIVA' por defecto`);
    }

    return {
      valida: errores.length === 0,
      errores,
      inscripcion: {
        ...inscripcion,
        // 🆕 CORRECCIÓN: Asegurar tipos correctos con valores por defecto
        progreso: progresoValidado,
        completado: Boolean(inscripcion.completado) || progresoValidado === 100,
        estado: inscripcion.estado || 'ACTIVA',
        estado_curso: inscripcion.estado_curso || (progresoValidado === 100 ? 'COMPLETADO' : 'EN_PROGRESO'),
        fecha_ultima_actualizacion: inscripcion.fecha_ultima_actualizacion || inscripcion.fecha_inscripcion || new Date().toISOString()
      }
    };
  };

  // 🆕 FUNCIÓN MEJORADA: Procesar y validar array de inscripciones
  const procesarInscripciones = (data) => {
    console.log('🔍 Procesando inscripciones recibidas del backend:', data);
    
    if (!Array.isArray(data)) {
      console.error('❌ Los datos no son un array:', data);
      return [];
    }

    // 🆕 CORRECCIÓN: Mostrar conteo inicial de datos
    console.log(`📥 Datos recibidos del backend: ${data.length} elementos`);

    const inscripcionesValidadas = [];
    const errores = [];

    data.forEach((item, index) => {
      try {
        // 🆕 CORRECCIÓN: Manejar diferentes estructuras de respuesta más robustamente
        let inscripcion;
        
        if (item.inscripcion) {
          // Estructura: { inscripcion: {...}, progreso: {...} }
          console.log(`📥 Procesando estructura con objeto inscripción en índice ${index}`, {
            id_inscripcion: item.inscripcion.id_inscripcion,
            id_curso: item.inscripcion.id_curso,
            progreso: item.progreso?.porcentaje_avance
          });
          
          inscripcion = {
            ...item.inscripcion,
            // 🆕 CORRECCIÓN: Manejar progreso null del backend
            progreso: item.progreso ? Number(item.progreso.porcentaje_avance) || 0 : 0,
            estado_curso: item.progreso?.estado_curso || 'EN_PROGRESO',
            completado: item.progreso ? 
              (Number(item.progreso.porcentaje_avance) === 100 || item.progreso.estado_curso === 'COMPLETADO') : 
              false,
            fecha_ultima_actualizacion: item.progreso?.fecha_actualizacion || item.inscripcion.fecha_inscripcion
          };
        } else if (item.id_inscripcion) {
          // Estructura directa de inscripción
          console.log(`📥 Procesando estructura directa en índice ${index}`, {
            id_inscripcion: item.id_inscripcion,
            id_curso: item.id_curso,
            progreso: item.progreso
          });
          
          inscripcion = {
            ...item,
            // 🆕 CORRECCIÓN: Asegurar progreso incluso si es null
            progreso: Number(item.progreso) || 0,
            completado: Boolean(item.completado) || item.progreso === 100,
            estado_curso: item.estado_curso || 'EN_PROGRESO',
            fecha_ultima_actualizacion: item.fecha_ultima_actualizacion || item.fecha_inscripcion
          };
        } else {
          console.warn(`❓ Estructura desconocida en índice ${index}:`, item);
          return; // Saltar este elemento
        }

        // Validar la inscripción procesada
        const validacion = validarInscripcion(inscripcion, index);
        
        if (validacion.valida) {
          inscripcionesValidadas.push(validacion.inscripcion);
          console.log(`✅ Inscripción ${index} válida:`, validacion.inscripcion.curso?.nombre_curso, `Progreso: ${validacion.inscripcion.progreso}%`);
        } else {
          console.warn(`⚠️ Inscripción ${index} tiene problemas:`, validacion.errores);
          errores.push(...validacion.errores);
        }

      } catch (error) {
        console.error(`💥 Error crítico procesando inscripción ${index}:`, error, item);
        errores.push(`Error procesando inscripción ${index}: ${error.message}`);
      }
    });

    // 🆕 CORRECCIÓN: Eliminar duplicados antes de retornar
    const inscripcionesSinDuplicados = eliminarDuplicados(inscripcionesValidadas);

    // Log de resultados de validación
    if (errores.length > 0) {
      console.warn('⚠️ Errores de validación encontrados:', errores);
    } else {
      console.log('🎉 Procesamiento completado sin errores críticos');
    }
    
    console.log(`📊 Resumen final: ${inscripcionesSinDuplicados.length} inscripciones únicas de ${data.length} elementos recibidos`);
    console.log('📦 Inscripciones finales para el frontend:', inscripcionesSinDuplicados.map(insc => ({
      id: insc.id_inscripcion,
      curso: insc.curso?.nombre_curso,
      progreso: insc.progreso,
      completado: insc.completado
    })));

    return inscripcionesSinDuplicados;
  };

  // 🆕 CORREGIDO: Usar useCallback para cargarInscripcionesConProgreso
  const cargarInscripcionesConProgreso = useCallback(async () => {
    if (!idUsuario) {
      setInscripciones([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 [INICIO] Cargando inscripciones con progreso para usuario:', idUsuario);
      
      const res = await fetch(`${API_BASE_URL}/inscripciones/progreso-curso/usuario/${idUsuario}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('✅ [BACKEND] Inscripciones con progreso cargadas:', data);
      
      // 🆕 PROCESAR Y VALIDAR DATOS CON PROGRESO
      const inscripcionesProcesadas = procesarInscripciones(Array.isArray(data) ? data : []);
      setInscripciones(inscripcionesProcesadas);
      
      console.log('🎯 [FRONTEND] Inscripciones establecidas en estado:', inscripcionesProcesadas.length);
      
    } catch (err) {
      console.error('❌ Error cargando inscripciones con progreso:', err);
      setError(err.message || 'Error al cargar inscripciones con progreso');
      setInscripciones([]);
    } finally {
      setLoading(false);
    }
  }, [idUsuario]);

  // 🆕 CORREGIDO: useEffect con dependencias correctas
  useEffect(() => {
    if (idUsuario) {
      cargarInscripcionesConProgreso();
    }
  }, [idUsuario, cargarInscripcionesConProgreso]);

  // 🆕 CORREGIDO: Usar useCallback para cargarProgresoCurso
  const cargarProgresoCurso = useCallback(async (idCurso) => {
    if (!idUsuario || !idCurso) return 0;
    
    try {
      console.log('🔄 Cargando progreso específico - Curso:', idCurso, 'Usuario:', idUsuario);
      
      const res = await fetch(
        `${API_BASE_URL}/inscripciones/progreso-curso/usuario/${idUsuario}/curso/${idCurso}`
      );
      
      if (!res.ok) {
        console.warn(`⚠️ No se pudo cargar progreso para curso ${idCurso}, usando 0`);
        return 0;
      }
      
      const data = await res.json();
      console.log('✅ Progreso cargado:', data);
      return Number(data.porcentaje_avance) || 0;
    } catch (err) {
      console.error('❌ Error cargando progreso, usando 0 por defecto:', err);
      return 0;
    }
  }, [idUsuario]);

  // 🆕 CORREGIDO: Usar useCallback para actualizarProgreso
  const actualizarProgreso = useCallback(async (idCurso, nuevoProgreso) => {
    if (!idUsuario || !idCurso) {
      return { success: false, error: 'Datos incompletos' };
    }

    // Validar progreso
    if (typeof nuevoProgreso !== 'number' || nuevoProgreso < 0 || nuevoProgreso > 100) {
      return { success: false, error: 'Progreso debe ser un número entre 0 y 100' };
    }

    try {
      console.log('🔄 Actualizando progreso - Curso:', idCurso, 'Progreso:', nuevoProgreso);
      
      const res = await fetch(
        `${API_BASE_URL}/inscripciones/progreso-curso/usuario/${idUsuario}/curso/${idCurso}`,
        {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            porcentajeAvance: nuevoProgreso
          })
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}`);
      }

      const data = await res.json();
      console.log('✅ Progreso actualizado:', data);
      
      // Actualizar el estado local con validación
      setInscripciones(prev => prev.map(insc => {
        if (insc.id_curso === idCurso) {
          return {
            ...insc,
            progreso: nuevoProgreso,
            completado: nuevoProgreso === 100,
            estado_curso: nuevoProgreso === 100 ? 'COMPLETADO' : 'EN_PROGRESO',
            fecha_ultima_actualizacion: new Date().toISOString()
          };
        }
        return insc;
      }));
      
      return { success: true, data };
    } catch (err) {
      console.error('❌ Error actualizando progreso:', err);
      return { success: false, error: err.message };
    }
  }, [idUsuario]);

  // Resto de funciones permanecen igual...
  const marcarTemaCompletado = useCallback(async (idTemario) => {
    if (!idUsuario || !idTemario) {
      return { success: false, error: 'Datos incompletos' };
    }

    try {
      console.log('🔄 Marcando tema como completado:', idTemario);
      
      const res = await fetch(`${API_BASE_URL}/progreso-tema`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_temario: idTemario,
          id_usuario: idUsuario,
          estado: 'COMPLETO'
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}`);
      }

      const data = await res.json();
      console.log('✅ Tema marcado como completado:', data);
      
      await cargarInscripcionesConProgreso();
      
      return { success: true, data };
    } catch (err) {
      console.error('❌ Error marcando tema como completado:', err);
      return { success: false, error: err.message };
    }
  }, [idUsuario, cargarInscripcionesConProgreso]);

  const inscribirEnCurso = useCallback(async (idCurso, metodoPago = 'TARJETA') => {
    if (!idUsuario || !idCurso) {
      return { 
        success: false, 
        error: 'Datos incompletos para la inscripción' 
      };
    }

    const metodosValidos = ['TARJETA', 'TRANSFERENCIA', 'BILLETERA'];
    if (!metodosValidos.includes(metodoPago)) {
      return {
        success: false,
        error: 'Método de pago no válido'
      };
    }

    setInscribiendo(true);
    setError(null);
    
    try {
      console.log('🎯 Iniciando inscripción - Curso:', idCurso, 'Usuario:', idUsuario, 'Método:', metodoPago);
      
      const res = await fetch(`${API_BASE_URL}/inscripciones`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_curso: Number(idCurso),
          id_usuario: Number(idUsuario),
          metodo_pago: metodoPago
        })
      });

      console.log('📨 Respuesta del servidor - Status:', res.status);
      
      let data;
      try {
        data = await res.json();
        console.log('📊 Datos de respuesta:', data);
      } catch (parseError) {
        console.error('❌ Error parseando respuesta JSON:', parseError);
        throw new Error('Error en la respuesta del servidor');
      }

      if (!res.ok) {
        throw new Error(data?.message || `Error ${res.status}: ${res.statusText}`);
      }

      console.log('✅ Inscripción exitosa:', data);
      
      await cargarInscripcionesConProgreso();
      
      return { 
        success: true, 
        data,
        message: 'Inscripción realizada correctamente'
      };
      
    } catch (err) {
      console.error('❌ Error en inscripción:', err);
      const errorMessage = err.message || 'Error al realizar la inscripción';
      setError(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setInscribiendo(false);
    }
  }, [idUsuario, cargarInscripcionesConProgreso]);

  const estaInscrito = (idCurso) => {
    return inscripciones.some(insc => 
      insc.id_curso === idCurso && insc.estado === 'ACTIVA'
    );
  };

  const obtenerInscripcion = (idCurso) => {
    return inscripciones.find(insc => insc.id_curso === idCurso);
  };

  const obtenerProgresoCurso = useCallback(async (idCurso) => {
    const inscripcion = obtenerInscripcion(idCurso);
    if (inscripcion && inscripcion.progreso !== undefined) {
      return inscripcion.progreso;
    }
    
    return await cargarProgresoCurso(idCurso);
  }, [cargarProgresoCurso, obtenerInscripcion]);

  const estaCompletado = (idCurso) => {
    const inscripcion = obtenerInscripcion(idCurso);
    return inscripcion ? 
      (inscripcion.progreso === 100 || inscripcion.estado_curso === 'COMPLETADO') : 
      false;
  };

  return { 
    inscripciones, 
    loading, 
    error, 
    inscribiendo,
    inscribirEnCurso, 
    cargarInscripciones: cargarInscripcionesConProgreso,
    cargarInscripcionesConProgreso,
    cargarProgresoCurso,
    actualizarProgreso,
    marcarTemaCompletado,
    estaInscrito,
    obtenerInscripcion,
    obtenerProgresoCurso,
    estaCompletado
  };
};