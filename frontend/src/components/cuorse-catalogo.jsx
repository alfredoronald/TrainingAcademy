import React, { useEffect, useState } from 'react';
import { GraduationCap, Award, Trophy, Medal, User, Users, Star } from 'lucide-react';

export default function CourseCatalogScreen({ onNavigate }) {
  const [courses, setCourses] = useState([]);
  const [puntos, setPuntos] = useState(null);
  const [error, setError] = useState(null);

  // 🔹 ID del usuario (puedes obtenerlo de tu sesión o contexto)
  const idUsuario = 1; // Cambia esto dinámicamente según el usuario logueado

  // 🟦 Fetch de cursos
  useEffect(() => {
    fetch('http://localhost:3000/api/cursos')
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener los cursos');
        return res.json();
      })
      .then((data) => setCourses(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  // 🟩 Fetch de puntajes
  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/puntajes');
        if (!res.ok) throw new Error('Error al obtener datos de puntaje');

        const data = await res.json();

        // Buscar puntaje del usuario específico
        const usuarioPuntaje = data.find(
          (item) => item.usuario.id_usuario === idUsuario
        );

        if (usuarioPuntaje) {
          setPuntos(usuarioPuntaje.total_puntos_obtenidos);
        } else {
          setError('No se encontró el puntaje del usuario');
        }
      } catch (err) {
        setError('Error al cargar el puntaje');
        console.error(err);
      }
    };

    fetchPuntos();
  }, [idUsuario]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <button
              className="text-xl font-semibold text-gray-900"
              onClick={() => onNavigate('catalog')}
            >
              Training Academy
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
              <Award className="w-5 h-5 text-green-600" />
              {/* 🔹 Mostrar puntos dinámicos */}
              {error ? (
                <span className="text-red-600 text-sm">{error}</span>
              ) : puntos !== null ? (
                <span className="font-semibold text-gray-900">{puntos} puntos</span>
              ) : (
                <span className="text-gray-500 text-sm">Cargando...</span>
              )}
            </div>

            <button
              onClick={() => onNavigate('leaderboard')}
              className="hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Trophy className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">Logros</span>
            </button>

            <button
              onClick={() => onNavigate('badges')}
              className="hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Medal className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">Insignias</span>
            </button>

            <button
              onClick={() => onNavigate('profile')}
              className="hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <User className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">Ver Perfil</span>
            </button>
          </div>
        </div>
      </header>

      {/* CATÁLOGO */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-blue-600 mb-3">
            Catálogo de Cursos
          </h1>
          <p className="text-lg text-gray-600">
            Descubre los mejores cursos para tu desarrollo profesional
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course.id_curso}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {course.modalidad || 'Curso'}
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                      {course.estado_disponibilidad || 'Activo'}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {course.nombre_curso}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.descripcion || 'Sin descripción'}
                  </p>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-700">
                      Duración: {course.duracion || 'N/A'} horas
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.cupos || '∞'} cupos</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">
                        {(course.rating || 4.8).toFixed(1)}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">
                      ${course.costo}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hay cursos registrados.</p>
          )}
        </div>
      </main>
    </div>
  );
}
