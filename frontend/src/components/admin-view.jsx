import React, { useEffect, useState } from "react"; 
import { 
  User, Book, Trash2, PlusCircle, GraduationCap, Edit, X, 
  TrendingUp, Users, DollarSign, Gift, CheckCircle, Clock, 
  Tag, RefreshCw 
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

export default function AdminDashboard({ onNavigate }) {
  const { user } = useAuthContext();

  const [courses, setCourses] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [canjes, setCanjes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nombre_curso: "",
    descripcion: "",
    costo: "",
    duracion: "",
    cupos: "",
    modalidad: "VIRTUAL",
    horarios: [],
    modulos: [],
  });

  useEffect(() => {
    fetchCourses();
    fetchInscripciones();
    fetchPagos();
    fetchCanjes();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("http://localhost:3000/api/cursos");
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudieron cargar los cursos`);
      }
      
      const data = await res.json();
      console.log("📚 Todos los cursos:", data);
      
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        console.error("❌ La respuesta no es un array:", data);
        setError("Error: La respuesta del servidor no es válida");
        setCourses([]);
      }
    } catch (err) {
      console.error("❌ Error al cargar cursos:", err);
      setError(err.message || "No se pudo conectar con el servidor");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInscripciones = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/inscripciones");
      
      if (res.ok) {
        const data = await res.json();
        console.log("📋 Todas las inscripciones:", data);
        setInscripciones(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("❌ Error al cargar inscripciones:", err);
    }
  };

  const fetchPagos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/pagos");
      
      if (res.ok) {
        const data = await res.json();
        console.log("💰 Todos los pagos:", data);
        setPagos(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("❌ Error al cargar pagos:", err);
    }
  };

  const fetchCanjes = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/canjes");
      
      if (res.ok) {
        const data = await res.json();
        console.log("🎁 Todos los canjes:", data);
        setCanjes(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("❌ Error al cargar canjes:", err);
    }
  };

  // 🆕 FUNCIÓN PARA CALCULAR ESTADÍSTICAS DE CURSOS CON PRECIO FINAL
  const calcularEstadisticasCursos = () => {
    if (!courses.length || !inscripciones.length) return [];

    return courses.map(curso => {
      const inscripcionesCurso = inscripciones.filter(
        insc => insc.id_curso === curso.id_curso
      );
      
      const totalInscripciones = inscripcionesCurso.length;
      
      // 🆕 CALCULAR INGRESOS CON PRECIO FINAL DE LAS INSCRIPCIONES
      const ingresosTotales = inscripcionesCurso.reduce((total, inscripcion) => {
        // Usar el precio_final de la inscripción si está disponible
        if (inscripcion.precio_final) {
          return total + parseFloat(inscripcion.precio_final);
        } else {
          // Si no hay precio final, usar el precio del curso como fallback
          return total + (curso.costo || 0);
        }
      }, 0);
      
      return {
        ...curso,
        totalInscripciones,
        ingresosTotales,
        promedioIngresos: ingresosTotales / Math.max(totalInscripciones, 1)
      };
    });
  };

  // 🆕 OBTENER CURSOS MÁS INSCRITOS (TOP 5)
  const getCursosMasInscritos = () => {
    const cursosConEstadisticas = calcularEstadisticasCursos();
    return cursosConEstadisticas
      .sort((a, b) => b.totalInscripciones - a.totalInscripciones)
      .slice(0, 5);
  };

  // 🆕 OBTENER CURSOS CON MÁS INGRESOS (TOP 5) - USANDO PRECIO FINAL
  const getCursosConMasIngresos = () => {
    const cursosConEstadisticas = calcularEstadisticasCursos();
    return cursosConEstadisticas
      .sort((a, b) => b.ingresosTotales - a.ingresosTotales)
      .slice(0, 5);
  };

  // 🟢 CREAR CURSO CON FORMULARIO MODAL
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const body = {
        nombre_curso: form.nombre_curso,
        descripcion: form.descripcion,
        costo: Number(form.costo),
        duracion: Number(form.duracion),
        cupos: Number(form.cupos),
        modalidad: form.modalidad,
        id_docente: user.id_usuario,
        estado_disponibilidad: 'ACTIVO',
        id_tipo_curso: 1,
      };

      const res = await fetch("http://localhost:3000/api/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const newCourse = await res.json();

      if (res.ok && newCourse.id_curso) {
        setCourses([...courses, newCourse]);
        setShowModal(false);
        setForm({
          nombre_curso: "",
          descripcion: "",
          costo: "",
          duracion: "",
          cupos: "",
          modalidad: "VIRTUAL",
          horarios: [],
          modulos: [],
        });
        alert("✅ Curso creado exitosamente!");
      } else {
        alert("❌ Error creando curso: " + (newCourse.message || "Error desconocido"));
      }
    } catch (err) {
      alert("❌ Error creando curso");
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar el curso "${nombre}"?\n\n⚠️ Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/cursos/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setCourses(courses.filter((c) => c.id_curso !== id));
        alert("✅ Curso eliminado correctamente");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al eliminar el curso");
      }
    } catch (err) {
      alert("❌ Error eliminando curso: " + err.message);
      console.error(err);
    }
  };

  // ➕ Horarios dinámicos
  const addHorario = () =>
    setForm({ ...form, horarios: [...form.horarios, { dia_semana: "", hora_inicio: "", hora_fin: "" }] });
  const removeHorario = (i) =>
    setForm({ ...form, horarios: form.horarios.filter((_, idx) => idx !== i) });
  const updateHorario = (i, key, value) => {
    const updated = [...form.horarios];
    updated[i][key] = value;
    setForm({ ...form, horarios: updated });
  };

  // ➕ Módulos dinámicos
  const addModulo = () =>
    setForm({ ...form, modulos: [...form.modulos, { nombre_modulo: "", descripcion_modulo: "", orden_modulo: form.modulos.length + 1 }] });
  const removeModulo = (i) =>
    setForm({ ...form, modulos: form.modulos.filter((_, idx) => idx !== i) });
  const updateModulo = (i, key, value) => {
    const updated = [...form.modulos];
    updated[i][key] = value;
    setForm({ ...form, modulos: updated });
  };

  // 🆕 COMPONENTE PARA TARJETAS DE ESTADÍSTICAS
  const EstadisticasCursos = () => {
    const cursosMasInscritos = getCursosMasInscritos();
    const cursosConMasIngresos = getCursosConMasIngresos();

    return (
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* CURSOS MÁS INSCRITOS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Cursos Más Inscritos</h3>
          </div>
          
          <div className="space-y-3">
            {cursosMasInscritos.map((curso, index) => (
              <div key={curso.id_curso} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {curso.nombre_curso}
                    </p>
                    <p className="text-xs text-gray-500">
                      {curso.modalidad}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600 text-sm">
                    {curso.totalInscripciones || 0}
                  </p>
                  <p className="text-xs text-gray-500">inscritos</p>
                </div>
              </div>
            ))}
          </div>

          {cursosMasInscritos.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">
              No hay datos de inscripciones disponibles
            </p>
          )}
        </div>

        {/* CURSOS CON MÁS INGRESOS (PRECIO FINAL) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Cursos con Más Ingresos</h3>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Precio final
            </span>
          </div>
          
          <div className="space-y-3">
            {cursosConMasIngresos.map((curso, index) => (
              <div key={curso.id_curso} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' : 'bg-green-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {curso.nombre_curso}
                    </p>
                    <p className="text-xs text-gray-500">
                      {curso.modalidad}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 text-sm">
                    ${(curso.ingresosTotales || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {curso.totalInscripciones || 0} ventas
                  </p>
                </div>
              </div>
            ))}
          </div>

          {cursosConMasIngresos.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">
              No hay datos de ingresos disponibles
            </p>
          )}
        </div>
      </div>
    );
  };

  // 🆕 COMPONENTE SIMPLIFICADO PARA ESTADÍSTICAS DE CANJES/CUPONES
  const EstadisticasCanjes = () => {
    const [loadingCanjes, setLoadingCanjes] = useState(false);

    // Filtrar canjes usados y disponibles
    const canjesUsados = canjes.filter(canje => 
      canje.utilizado === true || canje.utilizado === 1 || canje.utilizado === 'true'
    );
    
    const canjesDisponibles = canjes.filter(canje => 
      canje.utilizado === false || canje.utilizado === 0 || canje.utilizado === 'false'
    );

    // Canjes más populares (por tipo de recompensa)
    const canjesPorTipo = canjesUsados.reduce((acc, canje) => {
      const tipo = canje.nombre_recompensa || canje.nombre || 'Sin nombre';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    const canjesPopulares = Object.entries(canjesPorTipo)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([nombre, count]) => ({ nombre, count }));

    const handleRefreshCanjes = async () => {
      setLoadingCanjes(true);
      await fetchCanjes();
      setLoadingCanjes(false);
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">Estadísticas de Cupones</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {canjes.length} total
            </span>
            <button
              onClick={handleRefreshCanjes}
              disabled={loadingCanjes}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loadingCanjes ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>

        {loadingCanjes ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Cargando estadísticas de canjes...</p>
          </div>
        ) : canjes.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No hay cupones registrados en el sistema</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {/* RESUMEN DE CANJES */}
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Total Cupones</p>
                    <p className="text-2xl font-bold text-purple-800">{canjes.length}</p>
                  </div>
                  <Gift className="w-8 h-8 text-purple-600 opacity-70" />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Cupones Usados</p>
                    <p className="text-2xl font-bold text-green-800">{canjesUsados.length}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {canjes.length > 0 ? `${((canjesUsados.length / canjes.length) * 100).toFixed(1)}% de uso` : '0%'}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600 opacity-70" />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Cupones Disponibles</p>
                    <p className="text-2xl font-bold text-blue-800">{canjesDisponibles.length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600 opacity-70" />
                </div>
              </div>
            </div>

            {/* CANJES MÁS POPULARES */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Cupones Más Utilizados</h4>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {canjesPopulares.length} tipos
                </span>
              </div>
              
              {canjesPopulares.length > 0 ? (
                <div className="space-y-3">
                  {canjesPopulares.map((canje, index) => (
                    <div key={canje.nombre} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-600' : 'bg-purple-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {canje.nombre}
                          </p>
                          <p className="text-xs text-gray-500">
                            {canje.count} {canje.count === 1 ? 'uso' : 'usos'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-purple-600 text-sm">
                          {canjesUsados.length > 0 ? `${((canje.count / canjesUsados.length) * 100).toFixed(1)}%` : '0%'}
                        </p>
                        <p className="text-xs text-gray-500">del total</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    No hay cupones utilizados todavía
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Los cupones aparecerán aquí cuando sean usados
                  </p>
                </div>
              )}

              {/* EJEMPLOS DE CUPONES DISPONIBLES */}
              {canjesDisponibles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Algunos Cupones Disponibles</h4>
                  <div className="space-y-2">
                    {canjesDisponibles.slice(0, 3).map((canje, index) => (
                      <div key={canje.id_canje} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {canje.nombre_recompensa || 'Cupón sin nombre'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {canje.criterio && `Descuento: ${canje.criterio}%`}
                          </p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Disponible
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 🆕 COMPONENTE PARA RESUMEN DE ESTADÍSTICAS
  const ResumenEstadisticas = () => {
    const cursosConEstadisticas = calcularEstadisticasCursos();
    const totalInscripciones = cursosConEstadisticas.reduce((sum, curso) => sum + (curso.totalInscripciones || 0), 0);
    const totalIngresos = cursosConEstadisticas.reduce((sum, curso) => sum + (curso.ingresosTotales || 0), 0);
    const cursoMasPopular = getCursosMasInscritos()[0];
    const cursoMasRentable = getCursosConMasIngresos()[0];

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* TOTAL CURSOS */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Cursos</p>
              <p className="text-2xl font-bold text-blue-800">{courses.length}</p>
            </div>
            <Book className="w-8 h-8 text-blue-600 opacity-70" />
          </div>
        </div>

        {/* TOTAL INSCRIPCIONES */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Inscripciones</p>
              <p className="text-2xl font-bold text-green-800">{totalInscripciones}</p>
            </div>
            <Users className="w-8 h-8 text-green-600 opacity-70" />
          </div>
        </div>

        {/* INGRESOS TOTALES (PRECIO FINAL) */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Ingresos Totales</p>
              <p className="text-2xl font-bold text-purple-800">${totalIngresos.toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-1">Precio final aplicado</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600 opacity-70" />
          </div>
        </div>

        {/* CURSO MÁS RENTABLE */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Curso Más Rentable</p>
              <p className="text-sm font-semibold text-orange-800 truncate">
                {cursoMasRentable?.nombre_curso || 'N/A'}
              </p>
              <p className="text-xs text-orange-600">
                ${(cursoMasRentable?.ingresosTotales || 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600 opacity-70" />
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-600 text-lg">No has iniciado sesión.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-800 text-white border-b border-blue-900 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-800" strokeWidth={2} />
            </div>
            <span
              className="text-xl font-semibold cursor-pointer hover:text-blue-100 transition-colors"
              onClick={() => onNavigate("admin-dashboard")}
            >
              Panel del Administrador
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
  onClick={() => onNavigate("admin-permissions")}
  className=" flex items-center gap-2 px-4 py-2 bg-white font-medium text-indigo-700 rounded-lg shadow hover:bg-indigo-700 transition"
>
  <User className="w-4 h-4" />
  Gestionar Roles
</button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-800 rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-sm"
            >
              <PlusCircle className="w-5 h-5" />
              Crear Curso
            </button>
            <button
              onClick={() => onNavigate("profile")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <User className="w-5 h-5" />
              Perfil
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Bienvenido, {user.nombre} {user.apellido}
          </h1>
          <p className="text-lg text-gray-600">
            Administra todos los cursos registrados en el sistema.
          </p>
        </div>

        {/* 🆕 RESUMEN DE ESTADÍSTICAS */}
        <ResumenEstadisticas />

        {/* 🆕 ESTADÍSTICAS DE CURSOS POPULARES */}
        <EstadisticasCursos />

        {/* 🆕 ESTADÍSTICAS DE CANJES/CUPONES */}
        <EstadisticasCanjes />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-800 rounded-xl flex items-start gap-3 shadow-sm">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold mb-1">Error al cargar cursos</p>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchCourses}
                className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                🔄 Reintentar
              </button>
            </div>
          </div>
        )}

        {/* SECCIÓN DE TODOS LOS CURSOS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Todos los Cursos</h2>
            <p className="text-gray-600">
              <span className="font-semibold text-blue-800">{courses.length}</span> curso{courses.length !== 1 ? 's' : ''} registrado{courses.length !== 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Cargando cursos...</p>
              </div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-xl mb-2">
                {error ? "No se pudieron cargar los cursos" : "No hay cursos registrados"}
              </p>
              <p className="text-gray-500 mb-6">
                {error ? "Intenta recargar la página" : "¡Crea el primer curso para comenzar!"}
              </p>
              {!error && (
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <PlusCircle className="w-5 h-5" />
                  Crear Primer Curso
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const cursoConEstadisticas = calcularEstadisticasCursos().find(c => c.id_curso === course.id_curso);
                
                return (
                  <div
                    key={course.id_curso}
                    className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Book className="w-5 h-5 text-blue-800" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg truncate">
                            {course.nombre_curso}
                          </h3>
                          {course.tipo_curso && (
                            <p className="text-sm text-gray-500">
                              {course.tipo_curso.nombre_tipo_curso}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {course.descripcion && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {course.descripcion}
                      </p>
                    )}

                    <div className="space-y-2 mb-4 text-sm">
                      {course.modalidad && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Modalidad:</span>
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                            {course.modalidad}
                          </span>
                        </div>
                      )}
                      {course.duracion && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Duración:</span>
                          <span>{course.duracion}h</span>
                        </div>
                      )}
                      {course.costo !== undefined && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Precio base:</span>
                          <span className="text-gray-600 font-semibold">
                            ${parseFloat(course.costo).toFixed(2)}
                          </span>
                        </div>
                      )}
                      {course.cupos !== undefined && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Cupos:</span>
                          <span>{course.cupos}</span>
                        </div>
                      )}
                      {/* 🆕 ESTADÍSTICAS DEL CURSO CON PRECIO FINAL */}
                      {cursoConEstadisticas && (
                        <>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-medium">Inscritos:</span>
                            <span className="font-semibold text-blue-600">
                              {cursoConEstadisticas.totalInscripciones || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-medium">Ingresos reales:</span>
                            <span className="font-semibold text-green-600">
                              ${(cursoConEstadisticas.ingresosTotales || 0).toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {course.docente && (
                      <div className="mb-4 p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Docente</p>
                        <p className="text-sm font-medium text-gray-900">
                          {course.docente.nombre} {course.docente.apellido}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteCourse(course.id_curso, course.nombre_curso)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* MODAL PARA CREAR CURSO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative animate-fadeInScale overflow-y-auto max-h-[90vh]">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition" onClick={() => setShowModal(false)}>
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-semibold text-blue-700 mb-5 text-center">Crear Nuevo Curso</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              {/* CURSO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Curso</label>
                <input 
                  type="text" 
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none" 
                  value={form.nombre_curso} 
                  onChange={(e) => setForm({ ...form, nombre_curso: e.target.value })} 
                  placeholder="HTML Y CSS"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea 
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none" 
                  value={form.descripcion} 
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })} 
                  placeholder="Aprende a crear e interactuar con el desarrollo de paginas web"
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Costo ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none" 
                    value={form.costo} 
                    onChange={(e) => setForm({ ...form, costo: e.target.value })} 
                    placeholder="100"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cupos</label>
                  <input 
                    type="number" 
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none" 
                    value={form.cupos} 
                    onChange={(e) => setForm({ ...form, cupos: e.target.value })} 
                    placeholder="50"
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duración (h)</label>
                  <input 
                    type="number" 
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none" 
                    value={form.duracion} 
                    onChange={(e) => setForm({ ...form, duracion: e.target.value })} 
                    placeholder="60"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                  <select 
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none" 
                    value={form.modalidad} 
                    onChange={(e) => setForm({ ...form, modalidad: e.target.value })}
                  >
                    <option value="VIRTUAL">VIRTUAL</option>
                    <option value="PRESENCIAL">PRESENCIAL</option>
                    <option value="HIBRIDO">HIBRIDO</option>
                  </select>
                </div>
              </div>

              {/* HORARIOS */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Horarios</h3>
                {form.horarios.map((h, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                    <input 
                      type="text" 
                      placeholder="Día (ej: Lunes)" 
                      value={h.dia_semana} 
                      onChange={(e) => updateHorario(i, "dia_semana", e.target.value)} 
                      className="border rounded px-2 py-1" 
                    />
                    <input 
                      type="time" 
                      placeholder="Inicio" 
                      value={h.hora_inicio} 
                      onChange={(e) => updateHorario(i, "hora_inicio", e.target.value)} 
                      className="border rounded px-2 py-1" 
                    />
                    <input 
                      type="time" 
                      placeholder="Fin" 
                      value={h.hora_fin} 
                      onChange={(e) => updateHorario(i, "hora_fin", e.target.value)} 
                      className="border rounded px-2 py-1" 
                    />
                    <button type="button" onClick={() => removeHorario(i)} className="text-red-500 font-bold hover:text-red-700">X</button>
                  </div>
                ))}
                <button type="button" onClick={addHorario} className="text-blue-600 hover:text-blue-800 font-medium">
                  + Agregar Horario
                </button>
              </div>

              {/* MÓDULOS */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Módulos</h3>
                {form.modulos.map((m, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                    <input 
                      type="text" 
                      placeholder="Nombre del módulo" 
                      value={m.nombre_modulo} 
                      onChange={(e) => updateModulo(i, "nombre_modulo", e.target.value)} 
                      className="border rounded px-2 py-1" 
                    />
                    <input 
                      type="text" 
                      placeholder="Descripción" 
                      value={m.descripcion_modulo} 
                      onChange={(e) => updateModulo(i, "descripcion_modulo", e.target.value)} 
                      className="border rounded px-2 py-1" 
                    />
                    <button type="button" onClick={() => removeModulo(i)} className="text-red-500 font-bold hover:text-red-700">X</button>
                  </div>
                ))}
                <button type="button" onClick={addModulo} className="text-blue-600 hover:text-blue-800 font-medium">
                  + Agregar Módulo
                </button>
              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Crear Curso
                </button>
                

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}