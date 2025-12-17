import React, { useState, useEffect } from "react";
import {
  FileText, Download, Calendar, Users, Book, DollarSign, 
  Award, TrendingUp, User, Clock, RefreshCw, ChevronDown, ChevronUp,
  BarChart3, PieChart, LineChart
} from "lucide-react";

export default function ReportesSistema({ onNavigate }) {
  // Estados principales
  const [tipoReporte, setTipoReporte] = useState("progreso-academico");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [reporteData, setReporteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vistaActual, setVistaActual] = useState("resumen"); // "resumen" o "detalle"
  const [expandedSections, setExpandedSections] = useState({});

  // Estados para cada tipo de reporte
  const [filtroEstudiante, setFiltroEstudiante] = useState("");
  const [filtroCurso, setFiltroCurso] = useState("");

  // Configuración de cada reporte
  const tiposReporte = [
    {
      id: "progreso-academico",
      nombre: "Progreso Académico",
      icono: <Users className="w-5 h-5" />,
      descripcion: "Progreso de estudiantes, cursos, evaluaciones y asistencia",
      color: "blue"
    },
    {
      id: "puntos-recompensas",
      nombre: "Puntos y Recompensas",
      icono: <Award className="w-5 h-5" />,
      descripcion: "Sistema de puntos, canjes y recompensas",
      color: "yellow"
    },
    {
      id: "cursos",
      nombre: "Cursos",
      icono: <Book className="w-5 h-5" />,
      descripcion: "Estadísticas de cursos e inscripciones",
      color: "indigo"
    },
    {
      id: "pagos",
      nombre: "Pagos",
      icono: <DollarSign className="w-5 h-5" />,
      descripcion: "Reporte financiero de pagos y transacciones",
      color: "green"
    },
    {
      id: "docente",
      nombre: "Docentes",
      icono: <User className="w-5 h-5" />,
      descripcion: "Desempeño y actividades de docentes",
      color: "purple"
    },
    {
      id: "gamificacion",
      nombre: "Gamificación",
      icono: <TrendingUp className="w-5 h-5" />,
      descripcion: "Puntos e insignias de estudiantes",
      color: "orange"
    },
    {
      id: "administrativo",
      nombre: "Administrativo",
      icono: <FileText className="w-5 h-5" />,
      descripcion: "Horarios, asistencia y nuevos estudiantes",
      color: "gray"
    }
  ];

  // Función para formatear fecha DD-MM-YYYY a YYYY-MM-DD (para input type="date")
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // Función para formatear YYYY-MM-DD a DD-MM-YYYY (para la API)
  const formatDateForAPI = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
  };

  // Función para obtener el reporte
  const fetchReporte = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Formatear fechas para la API
      const fechaInicioAPI = fechaInicio ? formatDateForAPI(fechaInicio) : null;
      const fechaFinAPI = fechaFin ? formatDateForAPI(fechaFin) : null;
      
      // Construir URL con parámetros
      let url = `http://localhost:3000/api/reportes-sistema/${tipoReporte}`;
      const params = new URLSearchParams();
      
      if (fechaInicioAPI) params.append("fecha_inicio", fechaInicioAPI);
      if (fechaFinAPI) params.append("fecha_fin", fechaFinAPI);
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      console.log("📡 Solicitando reporte:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("📊 Datos recibidos:", data);
      
      setReporteData(data);
      setVistaActual("resumen");
      
      // Expandir automáticamente la primera sección
      if (data && Object.keys(data).length > 0) {
        const firstKey = Object.keys(data)[0];
        setExpandedSections({ [firstKey]: true });
      }
      
    } catch (err) {
      console.error("❌ Error obteniendo reporte:", err);
      setError(err.message);
      setReporteData(null);
    } finally {
      setLoading(false);
    }
  };

  // Función para alternar sección expandida
  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Función para exportar datos a JSON
  const exportToJSON = () => {
    if (!reporteData) return;
    
    const dataStr = JSON.stringify(reporteData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `reporte-${tipoReporte}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Función para establecer fechas predefinidas
  const setRangoFechas = (rango) => {
    const today = new Date();
    let inicio, fin;
    
    switch(rango) {
      case "ultimo-mes":
        inicio = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        fin = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "este-mes":
        inicio = new Date(today.getFullYear(), today.getMonth(), 1);
        fin = today;
        break;
      case "ultimo-trimestre":
        inicio = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        fin = today;
        break;
      case "este-ano":
        inicio = new Date(today.getFullYear(), 0, 1);
        fin = today;
        break;
      default:
        return;
    }
    
    setFechaInicio(inicio.toISOString().split('T')[0]);
    setFechaFin(fin.toISOString().split('T')[0]);
  };

  // Componente para mostrar el resumen del reporte
  const RenderResumen = () => {
    if (!reporteData) return null;
    
    const reporteActual = tiposReporte.find(r => r.id === tipoReporte);
    
    return (
      <div className="space-y-6">
        {/* Encabezado del reporte */}
        <div className={`bg-${reporteActual.color}-50 border border-${reporteActual.color}-200 rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-${reporteActual.color}-100 rounded-lg`}>
                {reporteActual.icono}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{reporteActual.nombre}</h2>
                <p className="text-gray-600">{reporteActual.descripcion}</p>
              </div>
            </div>
            <button
              onClick={exportToJSON}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar JSON
            </button>
          </div>
          
          {/* Rango de fechas del reporte */}
          {reporteData.rango_fechas && (
            <div className="mb-4 p-3 bg-white rounded-lg border">
              <p className="text-sm text-gray-600 mb-1">Rango del Reporte:</p>
              <p className="font-medium">
                {reporteData.rango_fechas.fecha_inicio} 
                <span className="mx-2">→</span>
                {reporteData.rango_fechas.fecha_fin}
              </p>
            </div>
          )}
          
          {/* Estadísticas clave según el tipo de reporte */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {renderEstadisticasClave()}
          </div>
        </div>
        
        {/* Navegación entre vistas */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setVistaActual("resumen")}
            className={`px-4 py-2 font-medium ${vistaActual === "resumen" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Resumen
          </button>
          <button
            onClick={() => setVistaActual("detalle")}
            className={`px-4 py-2 font-medium ${vistaActual === "detalle" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Detalle Completo
          </button>
        </div>
        
        {/* Contenido según la vista */}
        {vistaActual === "resumen" ? renderResumenEspecifico() : renderDetalleCompleto()}
      </div>
    );
  };

  // Renderizar estadísticas clave según el tipo de reporte
  const renderEstadisticasClave = () => {
    if (!reporteData) return null;
    
    switch(tipoReporte) {
      case "progreso-academico":
        return (
          <>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Estudiantes</p>
              <p className="text-2xl font-bold text-blue-600">{reporteData.total_estudiantes || 0}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Certificaciones</p>
              <p className="text-2xl font-bold text-green-600">
                {reporteData.resumen_certificaciones?.total_certificaciones_completadas || 0}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Cursos Más Completados</p>
              <p className="text-2xl font-bold text-purple-600">
                {reporteData.cursos_mas_completados?.length || 0}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Estudiantes Certificados</p>
              <p className="text-2xl font-bold text-orange-600">
                {reporteData.resumen_certificaciones?.estudiantes_certificados || 0}
              </p>
            </div>
          </>
        );
        
      case "puntos-recompensas":
        return (
          <>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Puntos Acumulados</p>
              <p className="text-2xl font-bold text-yellow-600">
                {reporteData.resumen_global?.total_puntos_acumulados || 0}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Puntos Canjeados</p>
              <p className="text-2xl font-bold text-blue-600">
                {reporteData.resumen_global?.total_puntos_canjeados || 0}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Canjes</p>
              <p className="text-2xl font-bold text-green-600">
                {reporteData.resumen_canjes?.total_canjes || 0}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Estudiantes con Puntos</p>
              <p className="text-2xl font-bold text-purple-600">
                {reporteData.resumen_global?.total_estudiantes_con_puntos || 0}
              </p>
            </div>
          </>
        );
        
      case "cursos":
        return (
          <>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Cursos</p>
              <p className="text-2xl font-bold text-indigo-600">
                {reporteData.total_cursos || 0}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-600">
                ${reporteData.totales_generales?.ingresos_totales?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Inscripciones Activas</p>
              <p className="text-2xl font-bold text-blue-600">
                {reporteData.totales_generales?.total_inscripciones_activas || 0}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Pagos Totales</p>
              <p className="text-2xl font-bold text-purple-600">
                {reporteData.totales_generales?.cantidad_pagos_totales || 0}
              </p>
            </div>
          </>
        );
        
      // Agregar más casos según necesites...
      default:
        return null;
    }
  };

  // Renderizar resumen específico para cada tipo de reporte
  const renderResumenEspecifico = () => {
    // Esto lo implementaremos después de probar el primer reporte
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Selecciona un reporte y haz clic en "Generar Reporte"</p>
      </div>
    );
  };

  // Renderizar detalle completo
  const renderDetalleCompleto = () => {
    if (!reporteData) return null;
    
    return (
      <div className="space-y-4">
        {Object.entries(reporteData).map(([key, value]) => {
          if (key === "rango_fechas") return null;
          
          const isExpanded = expandedSections[key] || false;
          
          return (
            <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(key)}
                className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                  <span className="font-semibold text-gray-900">
                    {key.replace(/_/g, " ").toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {Array.isArray(value) ? `${value.length} items` : typeof value}
                  </span>
                </div>
              </button>
              
              {isExpanded && (
                <div className="p-6 bg-white">
                  <pre className="text-sm text-gray-800 overflow-x-auto">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Renderizar selector de rangos rápidos
  const RenderRangosRapidos = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => setRangoFechas("ultimo-mes")}
        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Último Mes
      </button>
      <button
        onClick={() => setRangoFechas("este-mes")}
        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Este Mes
      </button>
      <button
        onClick={() => setRangoFechas("ultimo-trimestre")}
        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Último Trimestre
      </button>
      <button
        onClick={() => setRangoFechas("este-ano")}
        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Este Año
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-700 text-white border-b border-green-800 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("admin-dashboard")}
              className="flex items-center gap-2 text-white hover:text-green-200 transition-colors"
            >
              ← Volver al Dashboard
            </button>
            <h1 className="text-xl font-semibold">Sistema de Reportes</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Panel de configuración */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Configurar Reporte</h2>
          
          {/* Selector de tipo de reporte */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Reporte
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tiposReporte.map((reporte) => (
                <button
                  key={reporte.id}
                  onClick={() => setTipoReporte(reporte.id)}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                    tipoReporte === reporte.id
                      ? `border-${reporte.color}-500 bg-${reporte.color}-50`
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className={`p-2 rounded-full mb-2 ${
                    tipoReporte === reporte.id ? `bg-${reporte.color}-100 text-${reporte.color}-600` : "bg-gray-100 text-gray-500"
                  }`}>
                    {reporte.icono}
                  </div>
                  <span className="font-medium text-gray-900 text-sm">{reporte.nombre}</span>
                  <span className="text-xs text-gray-500 mt-1 text-center">{reporte.descripcion}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Selector de fechas */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Rango de Fechas (DD-MM-YYYY)
              </label>
              <span className="text-xs text-gray-500">Formato: DD-MM-YYYY</span>
            </div>
            
            <RenderRangosRapidos />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {fechaInicio ? `Se enviará como: ${formatDateForAPI(fechaInicio)}` : "Opcional"}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {fechaFin ? `Se enviará como: ${formatDateForAPI(fechaFin)}` : "Opcional - usa hoy"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Botón de acción */}
          <div className="flex justify-end">
            <button
              onClick={fetchReporte}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generando...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Generar Reporte
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Mostrar error si existe */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-800 rounded-xl flex items-start gap-3 shadow-sm">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold mb-1">Error al generar reporte</p>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchReporte}
                className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                🔄 Reintentar
              </button>
            </div>
          </div>
        )}
        
        {/* Resultados del reporte */}
        {reporteData && <RenderResumen />}
        
        {!reporteData && !loading && !error && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay reporte generado
            </h3>
            <p className="text-gray-600 mb-6">
              Selecciona un tipo de reporte y configura las fechas para comenzar
            </p>
            <div className="inline-flex items-center gap-2 text-green-600">
              <Calendar className="w-4 h-4" />
              <span>Los reportes pueden filtrarse por fechas específicas</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}