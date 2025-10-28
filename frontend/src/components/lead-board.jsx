import React, { useEffect, useState } from "react";
import { usePuntajeUsuario } from "../hooks/usePuntajeUsuario";
import { useAuthContext } from "../context/AuthContext";

export default function LeaderboardScreen({ onNavigate }) {
  const { user } = useAuthContext();
  const idUsuario = user?.id_usuario;
  const { puntos, errorPuntos, loadingPuntos } = usePuntajeUsuario(idUsuario);
  
  const [rankingPuntos, setRankingPuntos] = useState([]);
  const [rankingCalificaciones, setRankingCalificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener el texto del lugar
  const getLugarTexto = (posicion) => {
    switch(posicion) {
      case 1: return "Primer lugar";
      case 2: return "Segundo lugar";
      case 3: return "Tercer lugar";
      case 4: return "Cuarto lugar";
      case 5: return "Quinto lugar";
      case 6: return "Sexto lugar";
      case 7: return "Séptimo lugar";
      case 8: return "Octavo lugar";
      case 9: return "Noveno lugar";
      case 10: return "Décimo lugar";
      default: return `${posicion}° lugar`;
    }
  };

  // Función para obtener el texto corto del lugar
  const getLugarCorto = (posicion) => {
    switch(posicion) {
      case 1: return "1er lugar";
      case 2: return "2do lugar";
      case 3: return "3er lugar";
      default: return `${posicion}° lugar`;
    }
  };

  // Cargar ambos rankings al mismo tiempo
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Cargando ambos rankings...');

        // Cargar ranking de puntos
        const resPuntos = await fetch("http://localhost:3000/api/puntajes");
        if (!resPuntos.ok) throw new Error(`Error HTTP ${resPuntos.status}: No se pudieron cargar los puntajes`);
        const dataPuntos = await resPuntos.json();
        
        // Cargar ranking de calificaciones
        const resCalificaciones = await fetch("http://localhost:3000/api/ranking");
        if (!resCalificaciones.ok) throw new Error(`Error HTTP ${resCalificaciones.status}: No se pudieron cargar el ranking`);
        const dataCalificaciones = await resCalificaciones.json();

        // Transformar y ordenar datos de puntos
        const estudiantesPuntos = Array.isArray(dataPuntos) ? dataPuntos
          .filter(item => item.usuario && item.total_puntos_obtenidos !== undefined)
          .map((item) => ({
            id: `puntos-${item.usuario.id_usuario}`,
            name: `${item.usuario.nombre} ${item.usuario.apellido || ''}`.trim(),
            points: item.total_puntos_obtenidos || 0,
            puntosReales: true,
            totalObtenidos: item.total_puntos_obtenidos,
            totalUsados: item.total_puntos_usados,
            saldoActual: item.total_saldo_puntos,
            fechaActualizacion: item.fecha_registro,
            detalle: item.detalle,
            id_usuario: item.usuario.id_usuario,
            tipo: 'puntos',
            _raw: item
          }))
          .sort((a, b) => b.points - a.points) // Ordenar por puntos descendente
          .map((student, index) => ({
            ...student,
            rank: index + 1 // Asignar posición correcta después de ordenar
          }))
          .slice(0, 10)
          : [];

        // Transformar datos de calificaciones
        const estudiantesCalificaciones = Array.isArray(dataCalificaciones) ? dataCalificaciones
          .filter(item => item.tipo_ranking === 'global_calificaciones' && item.posicion)
          .sort((a, b) => a.posicion - b.posicion)
          .map((item) => {
            const nombreCompleto = item.usuario ? 
              `${item.usuario.nombre} ${item.usuario.apellido || ''}`.trim() : 
              `Usuario ${item.id_usuario}`;
            
            return {
              id: `calif-${item.id_usuario}`,
              name: nombreCompleto,
              rank: item.posicion,
              lugarTexto: getLugarTexto(item.posicion),
              lugarCorto: getLugarCorto(item.posicion),
              points: Math.max(100 - ((item.posicion - 1) * 10), 10),
              puntosReales: false,
              calificacionReal: true,
              posicionOriginal: item.posicion,
              fechaGenerado: item.fecha_generado,
              id_usuario: item.id_usuario,
              tipo: 'calificaciones',
              _raw: item
            };
          })
          .slice(0, 10)
          : [];

        console.log('📊 Ranking de puntos ordenado:', estudiantesPuntos);
        console.log('📊 Ranking de calificaciones:', estudiantesCalificaciones);

        setRankingPuntos(estudiantesPuntos);
        setRankingCalificaciones(estudiantesCalificaciones);
        
      } catch (err) {
        console.error('❌ Error cargando rankings:', err);
        setError(err.message);
        
        // Datos de ejemplo como fallback - CORREGIDOS
        const puntosEjemplo = [
          { id: 1, name: "Ana García", points: 200, rank: 1, puntosReales: false, tipo: 'puntos', id_usuario: 1 },
          { id: 2, name: "Carlos López", points: 180, rank: 2, puntosReales: false, tipo: 'puntos', id_usuario: 2 },
          { id: 3, name: "María Rodríguez", points: 150, rank: 3, puntosReales: false, tipo: 'puntos', id_usuario: 3 },
          { id: 4, name: "Pedro Martínez", points: 120, rank: 4, puntosReales: false, tipo: 'puntos', id_usuario: 4 },
          { id: 5, name: "Laura Sánchez", points: 90, rank: 5, puntosReales: false, tipo: 'puntos', id_usuario: 5 },
        ];
        
        const calificacionesEjemplo = [
          { 
            id: 1, 
            name: "Laura Martínez", 
            rank: 1,
            lugarTexto: "Primer lugar",
            lugarCorto: "1er lugar",
            points: 95, 
            calificacionReal: false, 
            tipo: 'calificaciones', 
            id_usuario: 6 
          },
          { 
            id: 2, 
            name: "Pedro Sánchez", 
            rank: 2,
            lugarTexto: "Segundo lugar",
            lugarCorto: "2do lugar",
            points: 85, 
            calificacionReal: false, 
            tipo: 'calificaciones', 
            id_usuario: 7 
          },
          { 
            id: 3, 
            name: "Elena Torres", 
            rank: 3,
            lugarTexto: "Tercer lugar",
            lugarCorto: "3er lugar",
            points: 75, 
            calificacionReal: false, 
            tipo: 'calificaciones', 
            id_usuario: 8 
          },
        ];
        
        setRankingPuntos(puntosEjemplo);
        setRankingCalificaciones(calificacionesEjemplo);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  // Encontrar posición del usuario en cada ranking
  const posicionUsuarioPuntos = user && rankingPuntos.length > 0 
    ? rankingPuntos.findIndex(student => student.id_usuario === idUsuario) + 1
    : null;

  const posicionUsuarioCalificaciones = user && rankingCalificaciones.length > 0 
    ? rankingCalificaciones.findIndex(student => student.id_usuario === idUsuario) + 1
    : null;

  // Estadísticas simplificadas
  const estadisticasPuntos = {
    totalPersonas: rankingPuntos.length,
  };

  const estadisticasCalificaciones = {
    totalPersonas: rankingCalificaciones.length,
  };

  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando rankings...</p>
          <p className="text-gray-500 text-sm mt-2">Obteniendo datos actualizados</p>
        </div>
      </div>
    );
  }

  // Si hay error crítico, mostrar página de error
  if (error && rankingPuntos.length === 0 && rankingCalificaciones.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">🏆</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar el ranking</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Componente para mostrar un estudiante en el ranking
  const StudentCard = ({ student, index, tipo }) => {
    const esUsuarioActual = student.id_usuario === idUsuario;
    const bg = index < 3 ? 
      index === 0 ? "bg-yellow-50 border-2 border-yellow-200" :
      index === 1 ? "bg-gray-50 border-2 border-gray-200" :
      "bg-orange-50 border-2 border-orange-200" :
      "bg-gray-50 border border-gray-100";

    const bordeUsuario = esUsuarioActual ? "ring-2 ring-blue-500 ring-opacity-50" : "";

    return (
      <div className={`flex items-center justify-between p-6 rounded-xl ${bg} ${bordeUsuario} hover:shadow-md transition-shadow group relative`}>
        {esUsuarioActual && (
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
            <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-r-full">
              TÚ
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 text-center">
              <span className={`text-lg font-bold ${
                student.rank === 1 ? "text-yellow-600" : 
                student.rank === 2 ? "text-gray-600" : 
                student.rank === 3 ? "text-orange-600" : "text-gray-500"
              }`}>
                #{student.rank}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm group-hover:scale-105 transition-transform ${
              student.rank === 1 ? "bg-yellow-100 border-yellow-300" :
              student.rank === 2 ? "bg-gray-100 border-gray-300" :
              student.rank === 3 ? "bg-orange-100 border-orange-300" :
              "bg-white border-gray-200"
            }`}>
              <span className={`text-lg ${
                student.rank === 1 ? "text-yellow-600" : 
                student.rank === 2 ? "text-gray-600" : 
                student.rank === 3 ? "text-orange-600" : "text-gray-500"
              }`}>
                {student.rank === 1 ? "🥇" : student.rank === 2 ? "🥈" : student.rank === 3 ? "🥉" : "👤"}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-semibold group-hover:text-blue-600 transition-colors ${
                esUsuarioActual ? "text-blue-700" : "text-gray-900"
              }`}>
                {student.name}
              </h3>
              {esUsuarioActual && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  Tú
                </span>
              )}
            </div>
            
            {tipo === 'puntos' && student.puntosReales && (
              <div className="flex gap-4 mt-2 text-xs">
                <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                  +{student.totalObtenidos} puntos obtenidos
                </span>
                {student.totalUsados > 0 && (
                  <span className="text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                    -{student.totalUsados} puntos usados
                  </span>
                )}
              </div>
            )}

            {tipo === 'calificaciones' && (
              <div className="flex gap-4 mt-2 text-xs">
                <span className="text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded">
                  {student.lugarTexto}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right min-w-[140px]">
          <div className={`text-2xl font-bold group-hover:text-blue-700 transition-colors ${
            esUsuarioActual ? "text-blue-600" : "text-blue-600"
          }`}>
            {tipo === 'puntos' ? student.points : student.lugarCorto}
          </div>
          <div className="text-sm text-gray-600">
            {tipo === 'puntos' ? 'puntos' : 'posición'}
          </div>
        </div>
      </div>
    );
  };

  // Componente para mostrar un ranking completo
  const RankingSection = ({ titulo, estudiantes, estadisticas, posicionUsuario, tipo }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-2xl">{tipo === 'puntos' ? "📈" : "🎓"}</span>
        <h2 className="text-xl font-semibold text-gray-900">{titulo}</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {estudiantes.length} personas
        </span>
      </div>

      {/* Estadísticas simplificadas - solo total de personas */}
      {estudiantes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600">{estadisticas.totalPersonas}</div>
            <div className="text-sm text-gray-600">Total Personas</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {tipo === 'puntos' ? (puntos !== null ? puntos : 0) : (posicionUsuario ? getLugarCorto(posicionUsuario) : 'No rankeado')}
            </div>
            <div className="text-sm text-gray-600">
              {tipo === 'puntos' ? 'Tus Puntos' : 'Tu Posición'}
            </div>
          </div>
        </div>
      )}

      {/* Posición del usuario */}
      {user && posicionUsuario && posicionUsuario > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <div className="flex items-center gap-2">
            <span>🏆</span>
            <p className="text-blue-800 text-sm">
              <strong>Tu posición en el ranking:</strong> {tipo === 'puntos' ? `#${posicionUsuario}` : getLugarTexto(posicionUsuario)} de {estudiantes.length} personas
            </p>
          </div>
        </div>
      )}

      {/* Lista de estudiantes */}
      {estudiantes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl text-gray-400 mb-4">🏆</div>
          <p className="text-gray-600 text-lg mb-2">No hay datos de ranking disponibles</p>
          <p className="text-gray-500 text-sm">
            {error ? "Error al cargar los datos" : "No se encontraron registros en el sistema"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {estudiantes.map((student, i) => (
            <StudentCard 
              key={student.id} 
              student={student} 
              index={i} 
              tipo={tipo}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🎓</span>
            </div>
            <a
              className="text-xl font-semibold text-gray-900 cursor-pointer"
              onClick={() => onNavigate("catalog")}
            >
              Training Academy
            </a>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
              <span>🏅</span>
              {loadingPuntos ? (
                <span className="text-gray-500 text-sm">Cargando...</span>
              ) : errorPuntos ? (
                <span className="text-red-600 text-sm">{errorPuntos}</span>
              ) : (
                <span className="font-semibold text-gray-900">{puntos !== null ? puntos : 0} puntos</span>
              )}
            </div>

            <button
              onClick={() => onNavigate("leaderboard")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg transition-colors"
            >
              <span>🏆</span>
              <span className="font-medium">Logros</span>
            </button>

            <button
              onClick={() => onNavigate("badges")}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>🎖️</span>
              <span className="font-medium text-gray-700">Insignias</span>
            </button>

            <button
              onClick={() => onNavigate("profile")}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>👤</span>
              <span className="font-medium text-gray-700">Ver Perfil</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-blue-600 mb-3">Rankings de la Academia</h1>
          <p className="text-lg text-gray-600">Compara tu desempeño con otras personas</p>
          
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">⚠️</span>
                <div>
                  <p className="text-yellow-800 font-medium">Modo demostración</p>
                  <p className="text-yellow-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ranking por Puntos */}
        <RankingSection
          titulo="Ranking por Puntos"
          estudiantes={rankingPuntos}
          estadisticas={estadisticasPuntos}
          posicionUsuario={posicionUsuarioPuntos}
          tipo="puntos"
        />

        {/* Ranking por Calificaciones */}
        <RankingSection
          titulo="Ranking por Calificaciones"
          estudiantes={rankingCalificaciones}
          estadisticas={estadisticasCalificaciones}
          posicionUsuario={posicionUsuarioCalificaciones}
          tipo="calificaciones"
        />

        {/* Información del usuario actual */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mt-8 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 text-lg mb-2">Tu Progreso General</h3>
              <p className="text-blue-700">
                {user?.nombre ? 
                  `¡Hola ${user.nombre}! Tu desempeño actual en la plataforma.` : 
                  'Inicia sesión para ver tu progreso y participar en el ranking.'
                }
              </p>
              
              {user?.nombre && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-blue-100">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-600">Posición en Puntos:</span>
                      <div className="font-semibold text-blue-600 text-lg">
                        {posicionUsuarioPuntos ? `#${posicionUsuarioPuntos}` : 'No rankeado'}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Posición en Calificaciones:</span>
                      <div className="font-semibold text-blue-600 text-lg">
                        {posicionUsuarioCalificaciones ? getLugarTexto(posicionUsuarioCalificaciones) : 'No rankeado'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 mb-2">{puntos !== null ? puntos : 0} puntos</p>
                    <button
                      onClick={() => onNavigate("catalog")}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Ganar más puntos
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
