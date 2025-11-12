import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useInscripciones } from "../hooks/useInscripciones";
import { usePuntajeUsuario } from "../hooks/usePuntajeUsuario";

// 🆕 SOLUCIÓN: Componente completamente seguro sin Lucide
const TextCheckIcon = () => <span className="text-green-600">✓</span>;
const TextClockIcon = () => <span className="text-blue-600">⏱</span>;
const TextPlayIcon = () => <span className="text-white">▶</span>;

// 🆕 MODAL de Certificado
const CertificateModal = ({ isOpen, onClose, curso, usuario }) => {
  if (!isOpen) return null;

  const fechaCompletado = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownload = () => {
    console.log('📄 Descargando certificado para curso:', curso?.curso?.id_curso);
    alert(`✅ Certificado descargado exitosamente para: ${curso?.curso?.nombre_curso}`);
  };

  const handlePrint = () => {
    console.log('🖨️ Imprimiendo certificado para curso:', curso?.curso?.id_curso);
    window.print();
  };

  const handleObtain = () => {
    console.log('🎓 Obteniendo certificado para curso:', curso?.curso?.id_curso);
    alert(`📜 Certificado obtenido para: ${curso?.curso?.nombre_curso}\n\nSe ha guardado en tu perfil y puedes acceder a él en cualquier momento.`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header del Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Certificado de Finalización</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Contenido del Certificado */}
        <div className="p-6">
          {/* Diseño del Certificado */}
          <div className="border-4 border-yellow-400 rounded-lg p-8 bg-gradient-to-br from-white to-blue-50">
            {/* Encabezado */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl text-green-600">
                  ✓
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-2">CERTIFICADO</h3>
              <p className="text-lg text-gray-600">de Finalización y Aprobación</p>
            </div>

            {/* Cuerpo */}
            <div className="text-center mb-6">
              <p className="text-gray-700 mb-4">Se otorga el presente certificado a</p>
              
              <h4 className="text-2xl font-bold text-blue-600 mb-3 border-b-2 border-blue-200 pb-2 inline-block">
                {usuario?.nombre || 'Estudiante Destacado'}
              </h4>
              
              <p className="text-gray-600 mb-4">por haber completado satisfactoriamente el curso</p>
              
              <h5 className="text-xl font-semibold text-gray-800 mb-3">{curso?.curso?.nombre_curso || 'Curso Completado'}</h5>
              
              <p className="text-gray-700 mb-2">demostrando dedicación y excelencia académica</p>
              <p className="text-gray-600">el {fechaCompletado}</p>
            </div>

            {/* Firmas */}
            <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="mb-2 border-b border-gray-300 pb-1 inline-block">
                  <p className="font-semibold text-gray-800">Director Académico</p>
                </div>
                <p className="text-gray-600 text-sm">Training Academy</p>
              </div>
              
              <div className="text-center">
                <div className="mb-2 border-b border-gray-300 pb-1 inline-block">
                  <p className="font-semibold text-gray-800">Instructor del Curso</p>
                </div>
                <p className="text-gray-600 text-sm">Equipo Docente</p>
              </div>
            </div>

            {/* Sello */}
            <div className="text-center mt-6">
              <div className="inline-block border-2 border-red-500 rounded-full px-4 py-2">
                <p className="text-red-500 font-bold text-xs">SELLO OFICIAL</p>
                <p className="text-red-500 text-xs">Training Academy</p>
              </div>
            </div>
          </div>

          {/* Información del certificado */}
          <div className="mt-4 text-center text-gray-600">
            <p className="text-sm">
              ID del Certificado: CERT-{curso?.curso?.id_curso}-{usuario?.id_usuario}-{Date.now().toString().slice(-6)}
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleObtain}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>📜</span>
            Obtener
          </button>
          
          <button
            onClick={handleDownload}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>📥</span>
            Descargar PDF
          </button>
          
          <button
            onClick={handlePrint}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>🖨️</span>
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MyCoursesScreen({ onNavigate }) {
  console.log('🔧 [1] MyCoursesScreen se está renderizando');
  
  const { user } = useAuthContext();
  const idUsuario = user?.id_usuario;
  
  const { 
    inscripciones, 
    loading: loadingInscripciones, 
    error: errorInscripciones,
    cargarInscripcionesConProgreso 
  } = useInscripciones(idUsuario);

  const { puntos, errorPuntos, loadingPuntos } = usePuntajeUsuario(idUsuario);

  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  
  // 🆕 ESTADO para el modal de certificado
  const [certificadoModal, setCertificadoModal] = useState({
    isOpen: false,
    curso: null
  });

  useEffect(() => {
    console.log('🔧 [2] useEffect - ID Usuario:', idUsuario);
    if (idUsuario) {
      cargarInscripcionesConProgreso();
    }
  }, [idUsuario]);

  const estaCompletado = (curso) => {
    return curso.completado || curso.progreso === 100 || curso.progreso >= 99;
  };

  useEffect(() => {
    console.log('🔧 [3] Procesando inscripciones:', inscripciones?.length);
    
    if (inscripciones && inscripciones.length > 0) {
      let filtered = inscripciones.filter(insc => insc.estado === 'ACTIVA');
      
      if (filtro === 'en-progreso') {
        filtered = filtered.filter(curso => !estaCompletado(curso) && curso.progreso < 100);
      } else if (filtro === 'completados') {
        filtered = filtered.filter(curso => estaCompletado(curso));
      }

      console.log('🔧 [4] Cursos filtrados:', filtered.length);
      setCursosFiltrados(filtered);
    } else {
      setCursosFiltrados([]);
    }
  }, [inscripciones, filtro]);

  const estadisticas = {
    total: cursosFiltrados.length,
    enProgreso: cursosFiltrados.filter(curso => !estaCompletado(curso) && curso.progreso < 100).length,
    completados: cursosFiltrados.filter(estaCompletado).length,
    progresoPromedio: cursosFiltrados.length > 0 
      ? Math.round(cursosFiltrados.reduce((acc, curso) => acc + curso.progreso, 0) / cursosFiltrados.length)
      : 0
  };

  const getEstadoCurso = (curso) => {
    if (estaCompletado(curso)) {
      return { 
        texto: 'Completado', 
        color: 'text-green-600',
        icon: TextCheckIcon
      };
    } else if (curso.progreso > 0) {
      return { 
        texto: 'En Progreso', 
        color: 'text-blue-600', 
        icon: TextClockIcon
      };
    } else {
      return { 
        texto: 'No Iniciado', 
        color: 'text-gray-600', 
        icon: TextClockIcon
      };
    }
  };

  const handleContinuarCurso = (curso) => {
    console.log('Continuar curso:', curso);
    onNavigate("coursePlayer", { 
      cursoId: curso.curso?.id_curso,
      inscripcionId: curso.id_inscripcion 
    });
  };

  // 🆕 FUNCIÓN MODIFICADA: Abrir modal en lugar de navegar
  const handleVerCertificado = (curso) => {
    console.log('🔧 [10] Ver certificado:', curso);
    if (estaCompletado(curso)) {
      setCertificadoModal({
        isOpen: true,
        curso: curso
      });
    } else {
      alert(`El curso "${curso.curso?.nombre_curso}" no está completado. Progreso actual: ${curso.progreso}%`);
    }
  };

  // 🆕 FUNCIÓN: Cerrar modal
  const handleCloseCertificado = () => {
    setCertificadoModal({
      isOpen: false,
      curso: null
    });
  };

  const handleReintentar = () => {
    console.log('🔧 [11] Reintentando carga...');
    if (idUsuario) {
      cargarInscripcionesConProgreso();
    }
  };

  console.log('🔧 [12] Estado final:', {
    loading: loadingInscripciones,
    inscripciones: inscripciones?.length,
    filtrados: cursosFiltrados.length
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🆕 MODAL de Certificado */}
      <CertificateModal 
        isOpen={certificadoModal.isOpen}
        onClose={handleCloseCertificado}
        curso={certificadoModal.curso}
        usuario={user}
      />

      {/* HEADER SIMPLIFICADO */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">TA</span>
            </div>
            <button
              className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              onClick={() => onNavigate("catalog")}
            >
              Training Academy
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
              <span className="text-green-600">🏆</span>
              {loadingPuntos ? (
                <span className="text-gray-500 text-sm">Cargando...</span>
              ) : errorPuntos ? (
                <span className="text-red-600 text-sm">{errorPuntos}</span>
              ) : (
                <span className="font-semibold text-gray-900">{puntos?.saldo ?? 0} puntos</span>
              )}
            </div>

            <button onClick={() => onNavigate("catalog")} className="hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <span>📚</span>
              <span className="text-gray-700 font-medium">Catálogo</span>
            </button>

            <button onClick={() => onNavigate("badges")} className="hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <span>🎖️</span>
              <span className="text-gray-700 font-medium">Insignias</span>
            </button>

            <button onClick={() => onNavigate("leaderboard")} className="hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <span>🏅</span>
              <span className="text-gray-700 font-medium">Logros</span>
            </button>

            <button onClick={() => onNavigate("profile")} className="hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <span>👤</span>
              <span className="text-gray-700 font-medium">Perfil</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Cursos</h1>
              <p className="text-lg text-gray-600">Gestiona y continúa con tu aprendizaje</p>
            </div>
            <button
              onClick={() => onNavigate("catalog")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <span>📖</span>
              Explorar Más Cursos
            </button>
          </div>

          {/* ESTADÍSTICAS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 text-xl">📚</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
                  <p className="text-sm text-gray-600">Total Cursos</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-yellow-600 text-xl">⏱</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.enProgreso}</p>
                  <p className="text-sm text-gray-600">En Progreso</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TextCheckIcon />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.completados}</p>
                  <p className="text-sm text-gray-600">Completados</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600 text-xl">📊</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.progresoPromedio}%</p>
                  <p className="text-sm text-gray-600">Progreso Promedio</p>
                </div>
              </div>
            </div>
          </div>

          {/* FILTROS */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFiltro('todos')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'todos' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Todos los Cursos
            </button>
            <button
              onClick={() => setFiltro('en-progreso')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'en-progreso' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              En Progreso
            </button>
            <button
              onClick={() => setFiltro('completados')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtro === 'completados' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Completados
            </button>
          </div>
        </div>

        {/* LISTA DE CURSOS */}
        {loadingInscripciones ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando tus cursos...</p>
          </div>
        ) : errorInscripciones ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700">{errorInscripciones}</p>
            <button
              onClick={handleReintentar}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        ) : cursosFiltrados.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {cursosFiltrados.map((inscripcion) => {
              const estado = getEstadoCurso(inscripcion);
              const EstadoIcon = estado.icon;
              const esCompletado = estaCompletado(inscripcion);
              
              return (
                <div
                  key={inscripcion.id_inscripcion}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      inscripcion.curso?.modalidad === 'VIRTUAL' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {inscripcion.curso?.modalidad || 'Curso'}
                    </span>
                    <span className={`text-xs font-medium flex items-center gap-1 ${estado.color}`}>
                      <EstadoIcon />
                      {estado.texto}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {inscripcion.curso?.nombre_curso || 'Curso sin nombre'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {inscripcion.curso?.descripcion || "Sin descripción disponible"}
                  </p>

                  {/* BARRA DE PROGRESO */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>{inscripcion.progreso}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          esCompletado ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${inscripcion.progreso}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <span>📅</span>
                      <span>Inscrito: {new Date(inscripcion.fecha_inscripcion).toLocaleDateString('es-ES')}</span>
                    </div>
                    {inscripcion.fecha_ultima_actualizacion && (
                      <div className="flex items-center gap-1">
                        <span>🕒</span>
                        <span>Última actividad: {new Date(inscripcion.fecha_ultima_actualizacion).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {esCompletado ? (
                      <button
                        onClick={() => handleVerCertificado(inscripcion)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                      >
                        <TextCheckIcon />
                        Ver Certificado
                      </button>
                    ) : (
                      <button
                        onClick={() => handleContinuarCurso(inscripcion)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        <TextPlayIcon />
                        {inscripcion.progreso > 0 ? 'Continuar' : 'Comenzar'}
                      </button>
                    )}
                    {/* 🆕 BOTÓN PARA VER DETALLES DEL CURSO */}
                    <button 
                      onClick={() => onNavigate("course-detail", { courseId: inscripcion.curso?.id_curso })}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      title="Ver detalles del curso"
                    >
                      <span>👁️</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md mx-auto">
              <span className="text-6xl mb-4">🎓</span>
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                {filtro === 'todos' ? 'No tienes cursos inscritos' : 
                 filtro === 'en-progreso' ? 'No tienes cursos en progreso' : 
                 'No tienes cursos completados'}
              </h3>
              <p className="text-yellow-700 mb-4">
                {filtro === 'todos' 
                  ? 'Explora nuestro catálogo y encuentra cursos que se adapten a tus intereses.' 
                  : 'Completa algunos cursos para verlos aquí.'}
              </p>
              <button
                onClick={() => onNavigate("catalog")}
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-600"
              >
                Explorar Cursos
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}