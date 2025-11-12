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

  const getLugarCorto = (posicion) => {
    switch(posicion) {
      case 1: return "1er lugar";
      case 2: return "2do lugar";
      case 3: return "3er lugar";
      default: return `${posicion}° lugar`;
    }
  };

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        setError(null);

        const resPuntos = await fetch("http://localhost:3000/api/puntajes");
        if (!resPuntos.ok) throw new Error(`Error HTTP ${resPuntos.status}: No se pudieron cargar los puntajes`);
        const dataPuntos = await resPuntos.json();

        const resCalificaciones = await fetch("http://localhost:3000/api/ranking");
        if (!resCalificaciones.ok) throw new Error(`Error HTTP ${resCalificaciones.status}: No se pudieron cargar el ranking`);
        const dataCalificaciones = await resCalificaciones.json();

        const estudiantesPuntos = Array.isArray(dataPuntos) ? dataPuntos
          .filter(item => item.usuario && item.total_puntos_obtenidos !== undefined)
          .map((item) => ({
            id: `puntos-${item.usuario.id_usuario}`,
            name: `${item.usuario.nombre} ${item.usuario.apellido || ''}`.trim(),
            points: item.total_puntos_obtenidos || 0,
            puntosReales: true,
            totalObtenidos: item.total_puntos_obtenidos || 0,
            totalUsados: item.total_puntos_usados || 0,
            saldoActual: item.total_saldo_puntos || 0,
            fechaActualizacion: item.fecha_registro,
            detalle: item.detalle,
            id_usuario: item.usuario.id_usuario,
            tipo: 'puntos',
            _raw: item
          }))
          .sort((a, b) => b.points - a.points)
          .map((student, index) => ({ ...student, rank: index + 1 }))
          .slice(0, 10)
          : [];

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

        setRankingPuntos(estudiantesPuntos);
        setRankingCalificaciones(estudiantesCalificaciones);
      } catch (err) {
        console.error('Error cargando rankings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const posicionUsuarioPuntos = user && rankingPuntos.length > 0 
    ? rankingPuntos.findIndex(student => student.id_usuario === idUsuario) + 1
    : null;

  const posicionUsuarioCalificaciones = user && rankingCalificaciones.length > 0 
    ? rankingCalificaciones.findIndex(student => student.id_usuario === idUsuario) + 1
    : null;

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
            <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-r-full">TÚ</div>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 text-center">
              <span className={`text-lg font-bold ${
                student.rank === 1 ? "text-yellow-600" : 
                student.rank === 2 ? "text-gray-600" : 
                student.rank === 3 ? "text-orange-600" : "text-gray-500"
              }`}>#{student.rank}</span>
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
              <h3 className={`text-lg font-semibold group-hover:text-blue-600 transition-colors ${esUsuarioActual ? "text-blue-700" : "text-gray-900"}`}>{student.name}</h3>
              {esUsuarioActual && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">Tú</span>
              )}
            </div>
            
            {tipo === 'puntos' && student.puntosReales && puntos && (
              <div className="flex gap-4 mt-2 text-xs">
                <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded">+{puntos.totalObtenidos} puntos obtenidos</span>
                {puntos.totalUsados > 0 && (
                  <span className="text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">-{puntos.totalUsados} puntos usados</span>
                )}
                <span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">Saldo actual: {puntos.saldo}</span>
              </div>
            )}

            {tipo === 'calificaciones' && (
              <div className="flex gap-4 mt-2 text-xs">
                <span className="text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded">{student.lugarTexto}</span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right min-w-[140px]">
          <div className={`text-2xl font-bold group-hover:text-blue-700 transition-colors ${esUsuarioActual ? "text-blue-600" : "text-blue-600"}`}>
            {tipo === 'puntos' ? student.points : student.lugarCorto}
          </div>
          <div className="text-sm text-gray-600">{tipo === 'puntos' ? 'puntos' : 'posición'}</div>
        </div>
      </div>
    );
  };

  const RankingSection = ({ titulo, estudiantes, posicionUsuario, tipo }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-2xl">{tipo === 'puntos' ? "📈" : "🎓"}</span>
        <h2 className="text-xl font-semibold text-gray-900">{titulo}</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{estudiantes.length} personas</span>
      </div>

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

      {estudiantes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl text-gray-400 mb-4">🏆</div>
          <p className="text-gray-600 text-lg mb-2">No hay datos de ranking disponibles</p>
        </div>
      ) : (
        <div className="space-y-4">
          {estudiantes.map((student, i) => (
            <StudentCard key={student.id} student={student} index={i} tipo={tipo} />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) return <div className="text-center mt-20">Cargando rankings...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🎓</span>
            </div>
            <a className="text-xl font-semibold text-gray-900 cursor-pointer" onClick={() => onNavigate("catalog")}>
              Training Academy
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold text-blue-600 mb-3">Rankings de la Academia</h1>
        <p className="text-lg text-gray-600 mb-8">Compara tu desempeño con otras personas</p>

        <RankingSection titulo="Ranking por Puntos" estudiantes={rankingPuntos} posicionUsuario={posicionUsuarioPuntos} tipo="puntos" />
        <RankingSection titulo="Ranking por Calificaciones" estudiantes={rankingCalificaciones} posicionUsuario={posicionUsuarioCalificaciones} tipo="calificaciones" />
      </main>
    </div>
  );
}
