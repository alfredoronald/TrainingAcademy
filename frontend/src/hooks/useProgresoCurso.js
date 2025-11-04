import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000/api';

export function useProgresoCurso(idUsuario, idCurso) {
  const [progreso, setProgreso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (idUsuario && idCurso) {
      fetchProgresoCurso();
    }
  }, [idUsuario, idCurso]);

  const fetchProgresoCurso = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(
        `${API_BASE_URL}/inscripciones/progreso-curso/usuario/${idUsuario}/curso/${idCurso}`,
        {
          method: 'GET',
          headers: headers
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProgreso(data);
    } catch (err) {
      setError(err.message || 'Error al cargar el progreso del curso');
      console.error('Error fetching course progress:', err);
    } finally {
      setLoading(false);
    }
  };

  return { progreso, loading, error, refetch: fetchProgresoCurso };
}

export function useProgresoCursosUsuario(idUsuario) {
  const [progresos, setProgresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (idUsuario) {
      fetchProgresos();
    }
  }, [idUsuario]);

  const fetchProgresos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(
        `${API_BASE_URL}/inscripciones/progreso-curso/usuario/${idUsuario}`,
        {
          method: 'GET',
          headers: headers
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProgresos(data);
    } catch (err) {
      setError(err.message || 'Error al cargar los progresos de los cursos');
      console.error('Error fetching courses progress:', err);
    } finally {
      setLoading(false);
    }
  };

  return { progresos, loading, error, refetch: fetchProgresos };
}