import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  Award,
  Trophy,
  Medal,
  User,
  Mail,
  BarChart3,
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { usePuntajeUsuario } from "../hooks/usePuntajeUsuario";

export default function Profile({ onNavigate }) {
  const { user } = useAuthContext();
  const idUsuario = user?.id_usuario;
  const { puntos, errorPuntos, loadingPuntos } = usePuntajeUsuario(idUsuario);
  
  // 🔹 Estado para las insignias del usuario
  const [usuarioInsignias, setUsuarioInsignias] = useState([]);
  const [loadingInsignias, setLoadingInsignias] = useState(false);

  // 🔹 Cargar insignias obtenidas por el usuario
  useEffect(() => {
    if (!idUsuario) return;

    setLoadingInsignias(true);
    fetch(`http://localhost:3000/api/usuario-insignia/${idUsuario}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("📦 Insignias cargadas en perfil:", data);
        const array = Array.isArray(data) ? data : [];
        setUsuarioInsignias(array);
      })
      .catch((err) => {
        console.error("❌ Error cargando insignias en perfil:", err);
        setUsuarioInsignias([]);
      })
      .finally(() => {
        setLoadingInsignias(false);
      });
  }, [idUsuario]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-600 text-lg">No has iniciado sesión.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <GraduationCap
                  className="w-6 h-6 text-white"
                  strokeWidth={1.5}
                />
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
                <Award className="w-5 h-5 text-green-600" />
                {loadingPuntos ? (
                  <span className="text-gray-600">Cargando...</span>
                ) : errorPuntos ? (
                  <span className="text-red-600">{errorPuntos}</span>
                ) : (
                  <span className="font-semibold text-gray-900">
                    {puntos} puntos
                  </span>
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
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-blue-600 mb-3">
            Mi Perfil
          </h1>
          <p className="text-lg text-gray-600">
            Gestiona tu información y revisa tu progreso
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-8">
                <User className="w-6 h-6 text-gray-900" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Información Personal
                </h2>
              </div>

              <div className="flex items-start gap-6 mb-8">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-bold text-white">
                    {user.nombre?.[0] || "U"}
                    {user.apellido?.[0] || "D"}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {user.nombre} {user.apellido}
                    </h3>
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {user.roles?.[0] || "Usuario"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{user.correo_electronico}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-sm text-gray-600 mb-2">
                    Cursos completados
                  </p>
                  <p className="text-4xl font-bold text-blue-600">
                    {user.cursosCompletados || 0}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <p className="text-sm text-gray-600 mb-2">Puntos totales</p>
                  <p className="text-4xl font-bold text-green-600">
                    {puntos || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* 🔹 SECCIÓN DE INSIGNIAS - ACTUALIZADA */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <Medal className="w-6 h-6 text-gray-900" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Mis Insignias
                </h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {usuarioInsignias.length} obtenidas
                </span>
              </div>

              {loadingInsignias ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Cargando insignias...</p>
                </div>
              ) : usuarioInsignias.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {usuarioInsignias.map((ui, index) => (
                    <div
                      key={ui.id_insignia || index}
                      className="aspect-square bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl flex flex-col items-center justify-center text-center p-4 border border-yellow-200 hover:shadow-md transition-shadow"
                    >
                      <Medal className="w-10 h-10 text-yellow-600 mb-2" />
                      <span className="text-sm font-semibold text-gray-800 mb-1">
                        {ui.insignia?.name || ui.insignia?.nombre || "Insignia"}
                      </span>
                      <span className="text-xs text-gray-600">
                        {ui.insignia?.description ||
                          ui.insignia?.descripcion ||
                          ""}
                      </span>
                      {ui.fecha_otorgada && (
                        <span className="text-xs text-gray-500 mt-2">
                          Obtenida:{" "}
                          {new Date(ui.fecha_otorgada).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <Medal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Aún no has obtenido insignias
                  </p>
                  <p className="text-sm text-gray-500">
                    Completa cursos y actividades para ganar insignias
                  </p>
                  <button
                    onClick={() => onNavigate("badges")}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Ver Insignias Disponibles
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-gray-900" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Análisis
                </h2>
              </div>

              <p className="text-gray-600 mb-6">
                Revisa tu progreso semanal y estadísticas de aprendizaje.
              </p>

              <button
                onClick={() => onNavigate("reporte-semanal")}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontSize: "1em",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  marginTop: "15px",
                }}
              >
                📊 Ver Reporte Semanal
              </button>

              {/* 🔹 ESTADÍSTICAS RÁPIDAS DE INSIGNIAS */}
              {usuarioInsignias.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Progreso de Insignias
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Insignias obtenidas:
                      </span>
                      <span className="font-semibold">
                        {usuarioInsignias.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Última insignia:</span>
                      <span className="font-semibold">
                        {usuarioInsignias.length > 0
                          ? new Date(
                              usuarioInsignias[
                                usuarioInsignias.length - 1
                              ].fecha_otorgada
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
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
