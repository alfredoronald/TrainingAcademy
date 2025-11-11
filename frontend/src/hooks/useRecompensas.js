import { useState, useEffect } from 'react';

export function useRecompensas() {
  const [recompensas, setRecompensas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecompensas = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3000/api/recompensas', {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar recompensas');
        }
        
        const data = await response.json();
        
        // Agregar categoría a cada recompensa
        const recompensasConCategoria = data.map(recompensa => ({
          ...recompensa,
          categoria: getCategoria(recompensa.id_recompensa)
        }));
        
        setRecompensas(recompensasConCategoria);
      } catch (err) {
        setError('Error al cargar recompensas');
        console.error('Error fetching recompensas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecompensas();
  }, []);

  return { recompensas, loading, error };
}

// Función helper para determinar la categoría
function getCategoria(idRecompensa) {
  if (idRecompensa <= 4) return 'CURSOS';
  if (idRecompensa <= 8) return 'SEMINARIOS';
  if (idRecompensa <= 12) return 'TALLERES';
  return 'CERTIFICACIONES';
}