import { useState, useEffect } from 'react';

export function useCanjes(idUsuario) {
  const [canjes, setCanjes] = useState([]);
  const [canjeando, setCanjeando] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCanjes = async () => {
      if (!idUsuario) return;

      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3000/api/canjes/usuario/${idUsuario}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar canjes');
        }
        
        const data = await response.json();
        console.log('🔍 Canjes crudos del backend:', data);
        
        // 🆕 FORMATEAR CANJES SIN 'tipo'
        const canjesFormateados = data.map(canje => ({
          ...canje,
          // Campos virtuales (si no vienen del backend)
          utilizado: canje.utilizado !== undefined ? canje.utilizado : false,
          estado: canje.estado || 'ACTIVO',
          nombre_recompensa: canje.nombre_recompensa || canje.recompensa?.nombre,
          criterio: canje.criterio || canje.recompensa?.criterio,
          // 🚫 Quitar 'tipo' ya que no existe
          // tipo: canje.tipo || canje.recompensa?.tipo
        }));
        
        console.log('✅ Canjes formateados:', canjesFormateados);
        setCanjes(canjesFormateados);
      } catch (err) {
        setError('Error al cargar canjes');
        console.error('Error fetching canjes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCanjes();
  }, [idUsuario]);

  // 🆕 FUNCIÓN MEJORADA: Filtrar canjes disponibles
  const canjesDisponibles = canjes.filter(canje => {
    // Verificar que el canje existe y no está utilizado
    const disponible = !canje.utilizado && canje.estado === 'ACTIVO';
    if (disponible) {
      console.log('✅ Canje disponible:', canje);
    }
    return disponible;
  });

  const canjearRecompensa = async (idRecompensa, puntosRequeridos, puntosUsuarioActual) => {
    if (!idUsuario) return { success: false, error: 'Usuario no identificado' };

    try {
      setCanjeando(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/canjes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          id_usuario: idUsuario,
          id_recompensa: idRecompensa
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.message || 'Error al canjear recompensa';
        
        if (errorMessage.includes('Puntaje insuficiente')) {
          errorMessage = `No tienes suficientes puntos. Tienes ${puntosUsuarioActual} puntos pero necesitas ${puntosRequeridos} puntos.`;
        } else if (errorMessage.includes('Ya has canjeado')) {
          errorMessage = 'Ya has canjeado esta recompensa anteriormente.';
        } else if (errorMessage.includes('no tiene puntos registrados')) {
          errorMessage = 'No tienes puntos registrados en el sistema.';
        }
        
        throw new Error(errorMessage);
      }

      const nuevoCanje = await response.json();
      
      // 🆕 Formatear el nuevo canje sin 'tipo'
      const nuevoCanjeFormateado = {
        ...nuevoCanje,
        utilizado: false,
        estado: 'ACTIVO',
        nombre_recompensa: nuevoCanje.recompensa?.nombre,
        criterio: nuevoCanje.recompensa?.criterio
        // 🚫 Quitar 'tipo'
      };
      
      setCanjes(prev => [...prev, nuevoCanjeFormateado]);
      
      return { 
        success: true, 
        data: nuevoCanjeFormateado,
        message: '¡Recompensa canjeada exitosamente!',
        puntosGastados: puntosRequeridos
      };
    } catch (err) {
      const errorMessage = err.message || 'Error al canjear recompensa';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        puntosInsuficientes: err.message.includes('No tienes suficientes puntos')
      };
    } finally {
      setCanjeando(false);
    }
  };

  // Función para recargar canjes
  const recargarCanjes = async () => {
    if (!idUsuario) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/api/canjes/usuario/${idUsuario}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar canjes');
      }
      
      const data = await response.json();
      
      // 🆕 Formatear los canjes recargados sin 'tipo'
      const canjesFormateados = data.map(canje => ({
        ...canje,
        utilizado: canje.utilizado !== undefined ? canje.utilizado : false,
        estado: canje.estado || 'ACTIVO',
        nombre_recompensa: canje.nombre_recompensa || canje.recompensa?.nombre,
        criterio: canje.criterio || canje.recompensa?.criterio
        // 🚫 Quitar 'tipo'
      }));
      
      setCanjes(canjesFormateados);
      setError(null);
      console.log('🔄 Canjes recargados y formateados:', canjesFormateados);
    } catch (err) {
      setError('Error al cargar canjes');
      console.error('Error fetching canjes:', err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarError = () => {
    setError(null);
  };

  return { 
    canjes, 
    canjesDisponibles,
    canjearRecompensa, 
    canjeando, 
    error,
    loading,
    recargarCanjes,
    limpiarError
  };
}