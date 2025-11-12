import React, { useState, useEffect } from "react";
import { GraduationCap, Award, Trophy, User, Users, Star, ShoppingCart, FileText, Medal, Gift } from "lucide-react";
import { useCursos } from "../hooks/useCursos";
import { usePuntajeUsuario } from "../hooks/usePuntajeUsuario";
import { useInscripciones } from "../hooks/useInscripciones";
import { useAuthContext } from "../context/AuthContext";

export default function CourseCatalogScreen({ onNavigate }) {
  const { user } = useAuthContext();
  const idUsuario = user?.id_usuario;
  const { courses, errorCursos, loadingCursos } = useCursos();
  const { puntos, errorPuntos, loadingPuntos } = usePuntajeUsuario(idUsuario);
  
  const { 
    inscripciones, 
    inscribirEnCurso, 
    inscribiendo,
    estaInscrito 
  } = useInscripciones(idUsuario);
  
  const [mostrarFactura, setMostrarFactura] = useState(null);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState('TARJETA');
  const [mostrarSeleccionPago, setMostrarSeleccionPago] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [cursosRenderizados, setCursosRenderizados] = useState([]);

  // Efecto para sincronizar cursos con validación
  useEffect(() => {
    if (courses && Array.isArray(courses)) {
      const cursosValidos = courses.filter(curso => 
        curso && curso.id_curso && typeof curso.id_curso === 'number'
      );
      setCursosRenderizados(cursosValidos);
    }
  }, [courses]);

  // MÉTODOS DE PAGO DISPONIBLES
  const metodosPago = [
    { id: 'TARJETA', nombre: 'Tarjeta de Crédito/Débito', icono: '💳' },
    { id: 'TRANSFERENCIA', nombre: 'Transferencia Bancaria', icono: '🏦' },
    { id: 'BILLETERA', nombre: 'Billetera', icono: '📱' }
  ];

  // FUNCIÓN PARA MOSTRAR SELECCIÓN DE PAGO
 // Dentro de handleSeleccionarPago
const handleSeleccionarPago = (curso) => {
  if (!idUsuario) {
    alert('Debes iniciar sesión para inscribirte');
    return;
  }

  if (estaInscrito(curso.id_curso)) {
    alert('Ya estás inscrito en este curso');
    return;
  }

  if (curso.estado_disponibilidad !== 'ACTIVO') {
    alert('Este curso no está disponible actualmente');
    return;
  }

  setCursoSeleccionado(curso);
  setMetodoPagoSeleccionado('TARJETA'); // Reiniciar selección al abrir un nuevo curso
  setMostrarSeleccionPago(true);
};


  // FUNCIÓN PARA CONFIRMAR INSCRIPCIÓN (MEJORADA)
  const handleConfirmarInscripcion = async () => {
    if (!cursoSeleccionado) return;

    const resultado = await inscribirEnCurso(cursoSeleccionado.id_curso, metodoPagoSeleccionado);
    
    if (resultado.success) {
      // Asegurar que la factura tenga valores numéricos válidos
      const facturaConValoresSeguros = {
        ...resultado.data,
        inscripcion: {
          precio_final: Number(resultado.data.inscripcion?.precio_final) || Number(cursoSeleccionado.costo) || 0,
          precio: Number(resultado.data.inscripcion?.precio) || Number(cursoSeleccionado.costo) || 0,
          id_inscripcion: resultado.data.inscripcion?.id_inscripcion || Date.now(),
          ...resultado.data.inscripcion
        },
        pago: {
          id_pago: resultado.data.pago?.id_pago || Date.now(),
          metodo_pago: resultado.data.pago?.metodo_pago || metodoPagoSeleccionado,
          ...resultado.data.pago
        },
        curso: cursoSeleccionado
      };
      
      setMostrarFactura(facturaConValoresSeguros);
      setMostrarSeleccionPago(false);
      setCursoSeleccionado(null);
    } else {
      alert(`Error: ${resultado.error}`);
      setMostrarSeleccionPago(false);
      setCursoSeleccionado(null);
    }
  };

  // COMPONENTE MODAL DE SELECCIÓN DE PAGO (fuera del render principal)
  const SeleccionPagoModal = ({ curso, onClose, onConfirm }) => {
    if (!curso) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Selecciona Método de Pago</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Curso: {curso.nombre_curso}</h3>
              <p className="text-lg font-bold text-blue-600">Total: ${curso.costo || 0}</p>
            </div>

            <div className="space-y-3 mb-6">
              {metodosPago.map((metodo) => (
                <div
                  key={metodo.id}
                  onClick={() => setMetodoPagoSeleccionado(metodo.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    metodoPagoSeleccionado === metodo.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{metodo.icono}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{metodo.nombre}</div>
                      {metodoPagoSeleccionado === metodo.id && (
                        <div className="text-sm text-green-600">✓ Seleccionado</div>
                      )}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      metodoPagoSeleccionado === metodo.id
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                disabled={inscribiendo}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400"
              >
                {inscribiendo ? 'Procesando...' : 'Confirmar Pago'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // COMPONENTE MODAL DE FACTURA CORREGIDO
 // Dentro de FacturaModal
const FacturaModal = ({ factura, onClose }) => {
  if (!factura) return null;

  const curso = factura.curso || {};
  const pago = factura.pago || {};
  const inscripcion = factura.inscripcion || {};

  const precio = Number(inscripcion.precio) || Number(curso.costo) || 0;
  const precioFinal = Number(inscripcion.precio_final) || precio;
  const nombreCurso = curso.nombre_curso || 'Curso';
  const metodoPago = pago.metodo_pago || metodoPagoSeleccionado;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-xl font-bold text-gray-900">¡Pago Exitoso!</h2>
            <p className="text-green-600 mt-1">Tu inscripción ha sido confirmada</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Curso:</span>
              <span className="font-semibold">{nombreCurso}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Método de pago:</span>
              <span className="font-medium capitalize">
                {metodosPago.find(m => m.id === metodoPago)?.icono} {metodoPago?.toLowerCase()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Fecha:</span>
              <span>{new Date().toLocaleDateString('es-ES')}</span>
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total pagado:</span>
                <span className="text-green-600">${precioFinal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Detalles de la Transacción</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">N° de Transacción:</span>
                <span className="font-mono">#{pago.id_pago || inscripcion.id_inscripcion || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Estado:</span>
                <span className="text-green-600 font-semibold">PAGADO ✓</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                onClose();
                onNavigate('my-courses');
              }}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Ver Mis Cursos
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300"
            >
              Seguir Explorando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


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
              className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              onClick={() => onNavigate("catalog")}
            >
              Training Academy
            </button>
          </div>

          <div className="flex items-center gap-6">
            {/* INSIGNIA DE PUNTOS - AHORA REDIRIGE A RECOMPENSAS */}
            <button 
              onClick={() => onNavigate("rewards")}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Award className="w-5 h-5 text-green-600" />
              {loadingPuntos ? (
                <span className="text-gray-500 text-sm">Cargando...</span>
              ) : errorPuntos ? (
                <span className="text-red-600 text-sm">{errorPuntos}</span>
              ) : (
                <span className="font-semibold text-gray-900">{puntos.saldo || 0} puntos</span>
              )}
            </button>

            {/* BOTÓN RECOMPENSAS - NUEVA PÁGINA SEPARADA */}
            <button
              onClick={() => onNavigate("rewards")}
              className="hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Gift className="w-5 h-5 text-purple-600" />
              <span className="text-gray-700 font-medium">Recompensas</span>
            </button>

            {/* BOTÓN MIS CURSOS */}
            <button
              onClick={() => onNavigate("my-courses")}
              className="hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FileText className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">Mis Cursos</span>
            </button>

            {/* BOTÓN VER DETALLES DEL CURSO */}
            <button
              onClick={() => onNavigate("course-detail", { courseId: 1 })}
              className="hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>👁️</span>
              <span className="text-gray-700 font-medium">Ver Curso</span>
            </button>

            {/* BOTÓN INSIGNIAS - REDIRIGE A BADGES */}
            <button
              onClick={() => onNavigate("badges")}
              className="hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Medal className="w-5 h-5 text-yellow-600" />
              <span className="text-gray-700 font-medium">Insignias</span>
            </button>

            {/* BOTÓN LOGROS */}
            <button
              onClick={() => onNavigate("leaderboard")}
              className="hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Trophy className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">Logros</span>
            </button>

            {/* BOTÓN VER PERFIL */}
            <button
              onClick={() => onNavigate("profile")}
              className="hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <User className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">Ver Perfil</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Catálogo de Cursos
          </h1>
          <p className="text-lg text-gray-600">
            Descubre los mejores cursos para tu desarrollo profesional
          </p>
        </div>

        {loadingCursos ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando cursos...</p>
          </div>
        ) : errorCursos ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700">{errorCursos}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursosRenderizados.length > 0 ? (
              cursosRenderizados.map((course) => {
                const inscrito = estaInscrito(course.id_curso);
                const disponible = course.estado_disponibilidad === 'ACTIVO';
                
                return (
                  <div
                    key={`curso-${course.id_curso}`}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        course.modalidad === 'VIRTUAL' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {course.modalidad || 'Curso'}
                      </span>
                      {inscrito && (
                        <span className="text-xs font-medium text-green-600">
                          ✓ Inscrito
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.nombre_curso}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {course.descripcion || "Sin descripción"}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div>Duración: {course.duracion || "N/A"} horas</div>
                      <div>Cupos: {course.cupos || "∞"}</div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.8</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">
                        ${course.costo || 0}
                      </span>
                    </div>

                    {/* BOTÓN DE INSCRIPCIÓN CON PAGO */}
                    <button
                      onClick={() => handleSeleccionarPago(course)}
                      disabled={inscrito || inscribiendo || !disponible}
                      className={`w-full mt-4 py-3 rounded-lg font-medium ${
                        inscrito 
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : !disponible
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : inscribiendo
                          ? 'bg-blue-500 text-white cursor-wait'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {inscribiendo ? (
                        'Procesando...'
                      ) : inscrito ? (
                        'Inscrito'
                      ) : !disponible ? (
                        'No disponible'
                      ) : (
                        'Inscribirse'
                      )}
                    </button>

                    {/* BOTÓN PARA VER DETALLES */}
                    <button
                      onClick={() => onNavigate("course-detail", { courseId: course.id_curso })}
                      className="w-full mt-2 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Ver Detalles
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <span className="text-4xl mb-4">📚</span>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No hay cursos disponibles
                </h3>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODALES - SOLO LOS DE PAGO Y FACTURA */}
      {mostrarSeleccionPago && (
        <SeleccionPagoModal 
          curso={cursoSeleccionado}
          onClose={() => {
            setMostrarSeleccionPago(false);
            setCursoSeleccionado(null);
          }}
          onConfirm={handleConfirmarInscripcion}
        />
      )}

      {mostrarFactura && (
        <FacturaModal 
          factura={mostrarFactura} 
          onClose={() => setMostrarFactura(null)} 
        />
      )}
    </div>
  );
}