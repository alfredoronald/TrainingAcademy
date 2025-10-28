import React from "react";
import { GraduationCap, Award, Trophy, Medal, User } from "lucide-react";
import { useRankings } from "../hooks/useRankings";
import { usePuntajeUsuario } from "../hooks/usePuntajeUsuario";
import { useAuthContext } from "../context/AuthContext";

export default function LeaderboardScreen({ onNavigate }) {
  const { rankings: topStudents, loading, error } = useRankings();
  const { user } = useAuthContext();
  const idUsuario = user?.id_usuario;
   const { puntos, errorPuntos, loadingPuntos } = usePuntajeUsuario(idUsuario); // 👈 ID del usuario logueado

  if (loading) return <div className="p-10 text-gray-600">Cargando...</div>;
  if (error) return <div className="p-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔹 HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <a
              className="text-xl font-semibold text-gray-900 cursor-pointer"
              onClick={() => onNavigate("catalog")}
            >
              Training Academy
            </a>
          </div>

          {/* 🔹 Puntaje actual del usuario */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
              <Award className="w-5 h-5 text-green-600" />
              {loadingPuntos ? (
                <span className="text-gray-500 text-sm">Cargando...</span>
              ) : errorPuntos ? (
                <span className="text-red-600 text-sm">{errorPuntos}</span>
              ) : (
                <span className="font-semibold text-gray-900">{puntos} puntos</span>
              )}
            </div>

            <button
              onClick={() => onNavigate("leaderboard")}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Trophy className="w-5 h-5 text-gray-700" />
              <span className="font-medium text-gray-700">Logros</span>
            </button>

            <button
              onClick={() => onNavigate("badges")}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Medal className="w-5 h-5 text-gray-700" />
              <span className="font-medium text-gray-700">Insignias</span>
            </button>

            <button
              onClick={() => onNavigate("profile")}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <User className="w-5 h-5 text-gray-700" />
              <span className="font-medium text-gray-700">Ver Perfil</span>
            </button>
          </div>
        </div>
      </header>

      {/* 🔹 MAIN */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-blue-600 mb-3">Tabla de Logros</h1>
          <p className="text-lg text-gray-600">Los mejores estudiantes de la plataforma</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Top 10 Estudiantes</h2>
          </div>

          <div className="space-y-4">
            {topStudents.map((student, i) => {
              const Icon =
                i === 0 ? Trophy : i === 1 ? Medal : i === 2 ? Award : Medal;
              const color =
                i === 0
                  ? "text-yellow-500"
                  : i === 1
                  ? "text-gray-400"
                  : i === 2
                  ? "text-orange-500"
                  : "text-gray-300";
              const bg =
                i < 3
                  ? i === 0
                    ? "bg-yellow-50"
                    : i === 2
                    ? "bg-orange-50"
                    : "bg-gray-50"
                  : "bg-gray-50";

              return (
                <div
                  key={student.id}
                  className={`flex items-center justify-between p-6 rounded-xl ${bg} hover:shadow-md`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                      <Icon className={`w-7 h-7 ${color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {student.courses} cursos completados
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {student.points.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">puntos</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
