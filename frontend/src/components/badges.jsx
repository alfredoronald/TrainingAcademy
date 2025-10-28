import React from "react";
import { GraduationCap, Award, Trophy, Medal, User } from "lucide-react";
import { useInsignias } from "../hooks/useInsignia";
import { usePuntajeUsuario } from "../hooks/usePuntajeUsuario"; // 👈 opcional si ya lo tienes
import { useAuthContext } from "../context/AuthContext";

export default function BadgesScreen({ onNavigate }) {
  const { insignias, loading, error } = useInsignias();
  const { user } = useAuthContext();
  const idUsuario = user?.id_usuario;
  const { puntos, errorPuntos, loadingPuntos } = usePuntajeUsuario(idUsuario); // 🔹 puedes reemplazar 1 por el id del usuario autenticado

  if (loading) return <div className="p-10 text-gray-600">Cargando insignias...</div>;
  if (error) return <div className="p-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo y título */}
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

            {/* Menú superior */}
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
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-blue-600 mb-3">Tienda de Insignias</h1>
          <p className="text-lg text-gray-600">Intercambia tus puntos por insignias especiales</p>
        </div>

        {/* GRID DE INSIGNIAS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insignias.map((badge) => (
            <div
              key={badge.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                  <Medal className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 text-center mb-3">
                {badge.name}
              </h3>

              <p className="text-sm text-gray-600 text-center mb-4">
                {badge.description}
              </p>

              <p className="text-sm text-gray-500 text-center italic mb-6">
                {badge.criterio}
              </p>

              <div className="flex items-center justify-center gap-2 mb-4">
                <Award className="w-5 h-5 text-green-600" />
                <span className="text-lg font-semibold text-green-600">{badge.points}</span>
                <span className="text-sm text-gray-600">puntos</span>
              </div>

              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Adquirir
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
