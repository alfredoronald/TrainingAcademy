import React, { useState, useEffect } from "react";
import { Gift, Award, ArrowLeft, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { usePuntajeUsuario } from "../hooks/usePuntajeUsuario";
import { useRecompensas } from "../hooks/useRecompensas";
import { useCanjes } from "../hooks/useCanjes";

export default function RewardsScreen({ onNavigate }) {
  const { user } = useAuthContext();
  const idUsuario = user?.id_usuario;
  const { puntos, errorPuntos, loadingPuntos } = usePuntajeUsuario(idUsuario);
  const { recompensas, loadingRecompensas, errorRecompensas } = useRecompensas();
  const { canjes, canjearRecompensa, canjeando, errorCanjes } = useCanjes(idUsuario);
  
  const [categoriaActiva, setCategoriaActiva] = useState('TODAS');
  const [mensajeExito, setMensajeExito] = useState('');

  // Función para canjear recompensa
  const handleCanjearRecompensa = async (recompensa) => {
    if (!idUsuario) {
      alert('Debes iniciar sesión para canjear recompensas');
      return;
    }

    if (puntos.saldo < recompensa.puntos_requeridos) {
      alert(`No tienes suficientes puntos. Necesitas ${recompensa.puntos_requeridos} puntos.`);
      return;
    }

    if (!window.confirm(`¿Estás seguro de que quieres canjear "${recompensa.nombre}" por ${recompensa.puntos_requeridos} puntos?`)) {
      return;
    }

    const resultado = await canjearRecompensa(recompensa.id_recompensa);
    
    if (resultado.success) {
      setMensajeExito(`¡Felicidades! Has canjeado: ${recompensa.nombre}`);
      setTimeout(() => setMensajeExito(''), 5000);
    } else {
      alert(`Error: ${resultado.error}`);
    }
  };

  // Filtrar recompensas por categoría
  const recompensasFiltradas = categoriaActiva === 'TODAS' 
    ? recompensas 
    : recompensas.filter(r => r.categoria === categoriaActiva);

  // Agrupar por categoría para el sidebar
  const categorias = [
    { id: 'TODAS', nombre: 'Todas las Recompensas', count: recompensas.length },
    { id: 'CURSOS', nombre: 'Cursos', count: recompensas.filter(r => r.categoria === 'CURSOS').length },
    { id: 'SEMINARIOS', nombre: 'Seminarios', count: recompensas.filter(r => r.categoria === 'SEMINARIOS').length },
    { id: 'TALLERES', nombre: 'Talleres', count: recompensas.filter(r => r.categoria === 'TALLERES').length },
    { id: 'CERTIFICACIONES', nombre: 'Certificaciones', count: recompensas.filter(r => r.categoria === 'CERTIFICACIONES').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate("catalog")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al Catálogo</span>
            </button>
            
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Recompensas</h1>
                  <p className="text-gray-600">Canjea tus puntos por beneficios exclusivos</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <div>
                      <div className="text-sm">Tus Puntos</div>
                      <div className="text-2xl font-bold">
                        {loadingPuntos ? <RefreshCw className="w-5 h-5 animate-spin" /> : puntos.saldo || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MENSAJE DE ÉXITO */}
      {mensajeExito && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span>{mensajeExito}</span>
            </div>
          </div>
        </div>
      )}

      {/* MENSAJES DE ERROR */}
      {errorRecompensas && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span>{errorRecompensas}</span>
            </div>
          </div>
        </div>
      )}

      {errorCanjes && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span>{errorCanjes}</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR DE CATEGORÍAS */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Categorías</h3>
              <div className="space-y-2">
                {categorias.map((categoria) => (
                  <button
                    key={categoria.id}
                    onClick={() => setCategoriaActiva(categoria.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      categoriaActiva === categoria.id
                        ? 'bg-purple-100 text-purple-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{categoria.nombre}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        categoriaActiva === categoria.id
                          ? 'bg-purple-200 text-purple-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {categoria.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="lg:col-span-3">
            {loadingRecompensas ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando recompensas...</p>
              </div>
            ) : errorRecompensas ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-700">{errorRecompensas}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {recompensasFiltradas.map((recompensa) => {
                  const yaCanjeada = canjes.some(canje => canje.id_recompensa === recompensa.id_recompensa);
                  const puedeCanjear = puntos.saldo >= recompensa.puntos_requeridos && !yaCanjeada;

                  return (
                    <div
                      key={recompensa.id_recompensa}
                      className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${
                        yaCanjeada
                          ? 'border-green-200 bg-green-50'
                          : puedeCanjear
                          ? 'border-purple-200 bg-white hover:shadow-md cursor-pointer'
                          : 'border-gray-200 bg-gray-50 opacity-75'
                      }`}
                      onClick={() => puedeCanjear && handleCanjearRecompensa(recompensa)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {recompensa.nombre}
                          </h3>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            recompensa.categoria === 'CURSOS' ? 'bg-blue-100 text-blue-800' :
                            recompensa.categoria === 'SEMINARIOS' ? 'bg-green-100 text-green-800' :
                            recompensa.categoria === 'TALLERES' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {recompensa.categoria}
                          </span>
                        </div>
                        
                        {yaCanjeada ? (
                          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        ) : (
                          <div className={`w-6 h-6 rounded-full border-2 ${
                            puedeCanjear ? 'border-purple-500' : 'border-gray-300'
                          }`}></div>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-4">
                        {recompensa.descripcion}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-purple-600" />
                          <span className="text-lg font-bold text-purple-600">
                            {recompensa.puntos_requeridos} pts
                          </span>
                        </div>
                        
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {recompensa.criterio}% descuento
                        </span>
                      </div>

                      {/* ESTADO DE LA RECOMPENSA */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        {yaCanjeada ? (
                          <div className="flex items-center gap-2 text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Canjeada ✓</span>
                          </div>
                        ) : !puedeCanjear ? (
                          <div className="flex items-center gap-2 text-red-500 text-sm">
                            <XCircle className="w-4 h-4" />
                            <span>Necesitas {recompensa.puntos_requeridos - puntos.saldo} puntos más</span>
                          </div>
                        ) : (
                          <button
                            disabled={canjeando}
                            className={`w-full py-2 rounded-lg font-medium text-white transition-colors ${
                              canjeando
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                          >
                            {canjeando ? 'Procesando...' : 'Canjear Ahora'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {recompensasFiltradas.length === 0 && !loadingRecompensas && (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No hay recompensas en esta categoría
                </h3>
                <p className="text-gray-500">
                  Prueba seleccionando otra categoría
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}