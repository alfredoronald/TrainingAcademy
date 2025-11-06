import React, { useEffect, useState } from "react";
import { GraduationCap, Award, Trophy, Medal, User, X, CheckCircle, Sparkles } from "lucide-react";
import { useInsignias } from "../hooks/useInsignia";
import { useAuthContext } from "../context/AuthContext";

export default function BadgesScreen({ onNavigate }) {
  const { insignias, loading, error } = useInsignias();
  const { user } = useAuthContext();
  const idUsuario = user?.id_usuario;

  const [usuarioInsignias, setUsuarioInsignias] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [acquiredBadge, setAcquiredBadge] = useState(null);
  const [reclamando, setReclamando] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    asistencias: 0,
    mensajes: 0,
    evaluacionesAprobadas: 0,
    modulosCompletados: 0
  });

  // 🔹 Cargar insignias obtenidas por el usuario logueado
  useEffect(() => {
    if (!idUsuario) {
      console.log("❌ No hay idUsuario disponible");
      return;
    }

    console.log("🔄 Cargando insignias para usuario:", idUsuario);

    fetch(`http://localhost:3000/api/usuario-insignia/usuario/${idUsuario}`)
      .then((res) => {
        console.log("📡 Response status:", res.status);
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("📦 Datos recibidos del backend:", data);
        const array = Array.isArray(data) ? data : [];
        setUsuarioInsignias(array);
      })
      .catch((err) => {
        console.error("❌ Error cargando insignias usuario:", err);
        setUsuarioInsignias([]);
      });

    // Cargar estadísticas del usuario
    cargarEstadisticasUsuario();
  }, [idUsuario]);

  // 🔹 Cargar estadísticas del usuario usando endpoints existentes
const cargarEstadisticasUsuario = async () => {
  if (!idUsuario) return;

  try {
    console.log("🔄 Cargando estadísticas para usuario:", idUsuario);

    // Usar endpoints existentes y filtrar en el frontend
    const [asistenciasRes, mensajesRes, evaluacionesRes, modulosRes] = await Promise.all([
      fetch('http://localhost:3000/api/asistencias').then(res => res.ok ? res.json() : []),
      fetch('http://localhost:3000/api/mensajes').then(res => res.ok ? res.json() : []),
      fetch('http://localhost:3000/api/evaluaciones').then(res => res.ok ? res.json() : []),
      fetch('http://localhost:3000/api/progreso-modulo').then(res => res.ok ? res.json() : [])
    ]);

    console.log("📦 Datos recibidos:", {
      asistencias: asistenciasRes,
      mensajes: mensajesRes,
      evaluaciones: evaluacionesRes,
      modulos: modulosRes
    });

    // Filtrar por usuario en el frontend
    const asistenciasUsuario = Array.isArray(asistenciasRes) 
      ? asistenciasRes.filter(a => a.usuario?.id_usuario === idUsuario && a.estado === 'PRESENTE').length 
      : 0;

    const mensajesUsuario = Array.isArray(mensajesRes)
      ? mensajesRes.filter(m => m.usuario?.id_usuario === idUsuario).length
      : 0;

    const evaluacionesAprobadas = Array.isArray(evaluacionesRes)
      ? evaluacionesRes.filter(e => e.usuario?.id_usuario === idUsuario && e.estado === 'APROBADO').length
      : 0;

    const modulosCompletados = Array.isArray(modulosRes)
      ? modulosRes.filter(m => m.usuario?.id_usuario === idUsuario && m.porcentaje_avance === 100).length
      : 0;

    setEstadisticas({
      asistencias: asistenciasUsuario,
      mensajes: mensajesUsuario,
      evaluacionesAprobadas: evaluacionesAprobadas,
      modulosCompletados: modulosCompletados
    });

    console.log("📊 Estadísticas finales:", {
      asistencias: asistenciasUsuario,
      mensajes: mensajesUsuario,
      evaluacionesAprobadas: evaluacionesAprobadas,
      modulosCompletados: modulosCompletados
    });

  } catch (error) {
    console.error("❌ Error cargando estadísticas:", error);
    // Establecer valores por defecto en caso de error
    setEstadisticas({
      asistencias: 0,
      mensajes: 0,
      evaluacionesAprobadas: 0,
      modulosCompletados: 0
    });
  }
};

  // 🔹 Verifica si el usuario ya obtuvo la insignia
  const esObtenida = (idInsignia) =>
    Array.isArray(usuarioInsignias) &&
    usuarioInsignias.some(
      (ui) => (ui.id_insignia === idInsignia) || (ui.insignia?.id_insignia === idInsignia)
    );

  // 🔹 Verificar si el usuario cumple los criterios para la insignia
  const cumpleCriterios = async (badge) => {
    console.log(`🎯 Verificando criterios para insignia: ${badge.name}`);
    console.log(`📊 Estadísticas actuales:`, estadisticas);

    // Mapear ID de insignia a criterio específico
    switch(badge.id) {
      case 1: // Constancia - 50 asistencias
        const cumpleAsistencias = estadisticas.asistencias >= 50;
        console.log(`✅ Asistencias: ${estadisticas.asistencias}/50 - ${cumpleAsistencias ? 'CUMPLE' : 'NO CUMPLE'}`);
        return cumpleAsistencias;
      
      case 2: // Participativo - 100 comentarios
        const cumpleMensajes = estadisticas.mensajes >= 100;
        console.log(`✅ Mensajes: ${estadisticas.mensajes}/100 - ${cumpleMensajes ? 'CUMPLE' : 'NO CUMPLE'}`);
        return cumpleMensajes;
      
      case 3: // Aprendiz Aplicado - 10 evaluaciones aprobadas
        const cumpleEvaluaciones = estadisticas.evaluacionesAprobadas >= 10;
        console.log(`✅ Evaluaciones: ${estadisticas.evaluacionesAprobadas}/10 - ${cumpleEvaluaciones ? 'CUMPLE' : 'NO CUMPLE'}`);
        return cumpleEvaluaciones;
      
      case 4: // Experto en Módulos - 20 módulos completados
        const cumpleModulos = estadisticas.modulosCompletados >= 20;
        console.log(`✅ Módulos: ${estadisticas.modulosCompletados}/20 - ${cumpleModulos ? 'CUMPLE' : 'NO CUMPLE'}`);
        return cumpleModulos;
      
      default:
        console.log(`❌ Insignia no reconocida: ${badge.id}`);
        return false;
    }
  };

  // 🔹 Función para reclamar insignia
  const reclamarInsignia = async (badge) => {
    if (reclamando) return;
    
    setReclamando(true);
    
    try {
      // Verificar si cumple criterios
      const puedeReclamar = await cumpleCriterios(badge);
      
      if (!puedeReclamar) {
        // Mostrar modal de "Aún no cumples"
        setAcquiredBadge({
          ...badge,
          tipo: 'no_cumple',
          progresoActual: obtenerProgresoActual(badge.id)
        });
        setShowSuccessModal(true);
        setReclamando(false);
        return;
      }

      // Reclamar la insignia - LLAMADA REAL AL BACKEND
      const response = await fetch('http://localhost:3000/api/usuario-insignia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario: idUsuario,
          id_insignia: badge.id
        }),
      });

      if (response.ok) {
        // Mostrar el modal de éxito
        setAcquiredBadge({
          ...badge,
          tipo: 'exito'
        });
        setShowSuccessModal(true);
        
        // Actualizar lista de insignias del usuario
        const nuevaInsignia = {
          id_insignia: badge.id,
          insignia: badge
        };
        setUsuarioInsignias(prev => [...prev, nuevaInsignia]);
        
        // Recargar estadísticas
        await cargarEstadisticasUsuario();
      } else {
        // Mostrar modal de error
        setAcquiredBadge({
          ...badge,
          tipo: 'error'
        });
        setShowSuccessModal(true);
      }
      
    } catch (error) {
      console.error("Error al reclamar insignia:", error);
      setAcquiredBadge({
        name: "Error de conexión",
        criterio: "No se pudo conectar con el servidor",
        tipo: 'error'
      });
      setShowSuccessModal(true);
    } finally {
      setReclamando(false);
    }
  };

  // 🔹 Obtener progreso actual para mostrar en el modal
  const obtenerProgresoActual = (idInsignia) => {
    switch(idInsignia) {
      case 1: return `${estadisticas.asistencias}/50 asistencias`;
      case 2: return `${estadisticas.mensajes}/100 mensajes`;
      case 3: return `${estadisticas.evaluacionesAprobadas}/10 evaluaciones aprobadas`;
      case 4: return `${estadisticas.modulosCompletados}/20 módulos completados`;
      default: return "Progreso no disponible";
    }
  };

  // 🔹 Obtener criterio específico para cada insignia
  const obtenerCriterioEspecifico = (badge) => {
    switch(badge.id) {
      case 1: return "50 asistencias en cursos";
      case 2: return "100 comentarios en foros";
      case 3: return "10 evaluaciones aprobadas";
      case 4: return "20 módulos completados al 100%";
      default: return badge.criterio;
    }
  };

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
              <button
                onClick={() => onNavigate("leaderboard")}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Trophy className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-700">Logros</span>
              </button>

              <button
                onClick={() => onNavigate("badges")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg transition-colors"
              >
                <Medal className="w-5 h-5" />
                <span className="font-medium">Insignias</span>
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
          <h1 className="text-4xl font-semibold text-blue-600 mb-3">Logros e Insignias</h1>
          <p className="text-lg text-gray-600">Gana insignias completando acciones y demostrando tu progreso académico</p>
          
          {/* ESTADÍSTICAS DEL USUARIO */}
<div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
    <div className="text-2xl font-bold text-blue-600">
      {typeof estadisticas.asistencias === 'number' ? estadisticas.asistencias : 0}
    </div>
    <div className="text-sm text-gray-600">Asistencias</div>
  </div>
  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
    <div className="text-2xl font-bold text-green-600">
      {typeof estadisticas.mensajes === 'number' ? estadisticas.mensajes : 0}
    </div>
    <div className="text-sm text-gray-600">Mensajes</div>
  </div>
  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
    <div className="text-2xl font-bold text-purple-600">
      {typeof estadisticas.evaluacionesAprobadas === 'number' ? estadisticas.evaluacionesAprobadas : 0}
    </div>
    <div className="text-sm text-gray-600">Evaluaciones Aprobadas</div>
  </div>
  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
    <div className="text-2xl font-bold text-orange-600">
      {typeof estadisticas.modulosCompletados === 'number' ? estadisticas.modulosCompletados : 0}
    </div>
    <div className="text-sm text-gray-600">Módulos Completados</div>
  </div>
</div>
        </div>

        {/* GRID DE INSIGNIAS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insignias.map((badge) => {
            const obtenido = esObtenida(badge.id);
            const criterioEspecifico = obtenerCriterioEspecifico(badge);

            let buttonColor = "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200";
            let buttonText = "🎯 Reclamar Insignia";
            let disabled = false;

            if (obtenido) {
              buttonColor = "bg-green-500 text-white cursor-default hover:bg-green-500";
              buttonText = "✅ Obtenido";
              disabled = true;
            } else if (reclamando) {
              buttonColor = "bg-gray-400 text-white cursor-not-allowed";
              buttonText = "⏳ Verificando...";
              disabled = true;
            }

            return (
              <div
                key={badge.id}
                className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300 ${
                  obtenido 
                    ? "border-green-300 shadow-green-100" 
                    : "border-blue-200 shadow-blue-100 hover:shadow-lg"
                }`}
              >
                <div className="flex justify-center mb-6">
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                      obtenido
                        ? "bg-gradient-to-br from-green-100 to-green-200 shadow-lg"
                        : "bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                    }`}
                  >
                    <Medal
                      className={`w-12 h-12 transition-all duration-300 ${
                        obtenido
                          ? "text-green-600 drop-shadow-sm"
                          : "text-blue-500 drop-shadow-sm"
                      }`}
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 text-center mb-3">
                  {badge.name}
                </h3>

                <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
                  {badge.description}
                </p>
                <p className="text-sm text-gray-500 text-center italic mb-6 px-2 bg-gray-50 py-2 rounded-lg">
                  🎯 {criterioEspecifico}
                </p>

                <button
                  className={`w-full px-4 py-3 rounded-xl font-bold transition-all duration-300 ${buttonColor}`}
                  disabled={disabled}
                  onClick={() => !obtenido && reclamarInsignia(badge)}
                >
                  {buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL DINÁMICO - Para éxito, error y "aún no cumples" */}
      {showSuccessModal && acquiredBadge && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative animate-fadeInScale">
            {/* Botón cerrar */}
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowSuccessModal(false)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Contenido del modal - Dinámico según el tipo */}
            <div className="text-center">
              
              {/* ICONO SEGÚN TIPO */}
              <div className="relative mb-6">
                {acquiredBadge.tipo === 'exito' ? (
                  // ✅ ÉXITO - Insignia obtenida
                  <>
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                      <CheckCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
                    </div>
                    <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
                  </>
                ) : acquiredBadge.tipo === 'no_cumple' ? (
                  // ⏳ AÚN NO CUMPLES
                  <>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Medal className="w-12 h-12 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center absolute -top-2 -right-2 animate-pulse">
                      <span className="text-white font-bold text-sm">!</span>
                    </div>
                  </>
                ) : (
                  // ❌ ERROR
                  <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <X className="w-12 h-12 text-white" strokeWidth={1.5} />
                  </div>
                )}
              </div>

              {/* TÍTULO SEGÚN TIPO */}
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {acquiredBadge.tipo === 'exito' ? (
                  <>¡Insignia Obtenida! 🎉</>
                ) : acquiredBadge.tipo === 'no_cumple' ? (
                  <>¡Sigue Esforzándote! 💪</>
                ) : (
                  <>Algo salió mal 😔</>
                )}
              </h2>

              {/* MENSAJE PRINCIPAL SEGÚN TIPO */}
              {acquiredBadge.tipo === 'exito' ? (
                <>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Has demostrado tu esfuerzo y conseguiste
                  </p>
                  
                  {/* INSIGNIA DESTACADA */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 mb-6 border-2 border-green-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                      <Medal className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {acquiredBadge.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {acquiredBadge.description}
                    </p>
                  </div>

                  <p className="text-sm text-gray-500 mb-6 italic">
                    ¡Felicidades! Esta insignia reconoce tu dedicación y progreso.
                  </p>
                </>
              ) : acquiredBadge.tipo === 'no_cumple' ? (
                <>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Aún no cumples los requisitos para esta insignia
                  </p>
                  
                  {/* INFO DE LA INSIGNIA */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-2xl p-6 mb-6 border-2 border-blue-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                      <Medal className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {acquiredBadge.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {acquiredBadge.description}
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-yellow-800 mb-1">
                        🎯 Progreso actual:
                      </p>
                      <p className="text-sm text-yellow-700">
                        {acquiredBadge.progresoActual}
                      </p>
                      <p className="text-sm font-semibold text-yellow-800 mt-2 mb-1">
                        📋 Requisito:
                      </p>
                      <p className="text-sm text-yellow-700">
                        {obtenerCriterioEspecifico(acquiredBadge)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-6 italic">
                    ¡No te rindas! Sigue participando y pronto la obtendrás.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {acquiredBadge.criterio || "Ocurrió un error inesperado"}
                  </p>
                  
                  <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-6 mb-6 border-2 border-red-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                      <X className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {acquiredBadge.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Intenta nuevamente en unos momentos
                    </p>
                  </div>

                  <p className="text-sm text-gray-500 mb-6 italic">
                    Si el problema persiste, contacta con soporte.
                  </p>
                </>
              )}

              {/* BOTÓN DE ACCIÓN SEGÚN TIPO */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className={`w-full py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  acquiredBadge.tipo === 'exito' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                    : acquiredBadge.tipo === 'no_cumple'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                    : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
                }`}
              >
                {acquiredBadge.tipo === 'exito' 
                  ? '¡Continuar!'
                  : acquiredBadge.tipo === 'no_cumple'
                  ? 'Entendido, ¡seguiré intentando!'
                  : 'Reintentar'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}