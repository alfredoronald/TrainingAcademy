import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  MapPin,
  AlertCircle,
  BarChart3,
  User,
  Book,
  Trash2,
  PlusCircle,
  GraduationCap,
  Edit,
  X,
  TrendingUp,
  Users,
  DollarSign,
  Gift,
  CheckCircle,
  Clock,
  Tag,
  RefreshCw,
  LogOut,
  Award,
  Star,
  FileText,
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

export default function AdminDashboard({ onNavigate }) {
  const { user, logout } = useAuthContext();

  const [courses, setCourses] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [canjes, setCanjes] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingEvaluaciones, setLoadingEvaluaciones] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  const [rankingInsignias, setRankingInsignias] = useState([]);
  const [rankingEstudiantes, setRankingEstudiantes] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(false);
  const [usuarioInsignias, setUsuarioInsignias] = useState([]);
  const [rankingPuntos, setRankingPuntos] = useState([]);
  const [puntajesData, setPuntajesData] = useState([]); // Nuevo estado para almacenar los datos crudos
  const [loadingPuntos, setLoadingPuntos] = useState(false);
  const [showGestionInsignias, setShowGestionInsignias] = useState(false);
  const [insignias, setInsignias] = useState([]);
  const [editingInsignia, setEditingInsignia] = useState(null);
  const [loadingInsignias, setLoadingInsignias] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

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

  const [badgeForm, setBadgeForm] = useState({
    nombre_insignia: "",
    descripcion: "",
    imagen_url: "",
    criterio_obtencion: "",
    puntos_requeridos: 0,
    categoria: "LOGROS",
  });

  // Actualiza estos estados
  const [puntosData, setPuntosData] = useState({
    totalAcumulados: 0,
    totalCanjeados: 0,
    disponibles: 0,
    estudiantesConPuntos: 0,
    promedioPuntos: 0,
  });

  // Función simplificada para obtener puntajes
  const fetchPuntajes = async () => {
    setLoadingPuntos(true);
    try {
      const res = await fetch("http://localhost:3000/api/puntajes");
      if (res.ok) {
        const data = await res.json();
        console.log("📊 Puntajes obtenidos:", data);
        setPuntajesData(Array.isArray(data) ? data : []);

        // Calcular estadísticas
        calcularEstadisticasDesdePuntajes(data);
      } else {
        console.error("❌ Error al cargar puntajes:", res.status);
        setPuntajesData([]);
      }
    } catch (err) {
      console.error("❌ Error al cargar puntajes:", err);
      setPuntajesData([]);
    } finally {
      setLoadingPuntos(false);
    }
  };

  // Función para calcular estadísticas desde los puntajes
  const calcularEstadisticasDesdePuntajes = (puntajes) => {
    if (!Array.isArray(puntajes) || puntajes.length === 0) {
      setPuntosData({
        totalAcumulados: 0,
        totalCanjeados: 0,
        disponibles: 0,
        estudiantesConPuntos: 0,
        promedioPuntos: 0,
      });
      setRankingPuntos([]);
      return;
    }

    // Calcular totales
    let totalAcumulados = 0;
    let totalCanjeados = 0;
    let totalDisponibles = 0;

    // Filtrar solo estudiantes con puntos (excluir administradores con 0 puntos)
    const estudiantesConPuntos = puntajes.filter(
      (p) => p.total_puntos_obtenidos > 0 || p.total_saldo_puntos > 0
    );

    estudiantesConPuntos.forEach((puntaje) => {
      totalAcumulados += puntaje.total_puntos_obtenidos || 0;
      totalCanjeados += puntaje.total_puntos_usados || 0;
      totalDisponibles += puntaje.total_saldo_puntos || 0;
    });

    // Crear ranking ordenado por saldo de puntos
    const ranking = estudiantesConPuntos
      .map((puntaje) => ({
        ...puntaje.usuario,
        puntos_acumulados: puntaje.total_puntos_obtenidos,
        puntos_canjeados: puntaje.total_puntos_usados,
        puntos_disponibles: puntaje.total_saldo_puntos,
        fecha_registro: puntaje.fecha_registro,
        detalle: puntaje.detalle,
        id_puntaje: puntaje.id_puntaje,
      }))
      .sort((a, b) => b.puntos_disponibles - a.puntos_disponibles);

    // Calcular promedio
    const promedioPuntos =
      estudiantesConPuntos.length > 0
        ? totalDisponibles / estudiantesConPuntos.length
        : 0;

    setPuntosData({
      totalAcumulados,
      totalCanjeados,
      disponibles: totalDisponibles,
      estudiantesConPuntos: estudiantesConPuntos.length,
      promedioPuntos: Math.round(promedioPuntos),
    });

    setRankingPuntos(ranking);

    console.log("🏆 Ranking calculado:", ranking);
  };

  // Actualiza el useEffect principal
  useEffect(() => {
    fetchCourses();
    fetchInscripciones();
    fetchPagos();
    fetchCanjes();
    fetchEvaluaciones();
    calcularRankings();
    fetchPuntajes();
  }, []);
  useEffect(() => {
    if (showGestionInsignias) {
      fetchInsigniasCompletas();
    }
  }, [showGestionInsignias]);
  // Función para cargar las relaciones usuario-insignia
  const fetchUsuarioInsignias = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/usuario-insignia");
      if (res.ok) {
        const data = await res.json();
        console.log("🔗 Relaciones usuario-insignia:", data);
        setUsuarioInsignias(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("❌ Error al cargar relaciones usuario-insignia:", err);
      setUsuarioInsignias([]);
    }
  };

  // Función para cargar todas las insignias (para obtener nombres y descripciones)
  const fetchInsignias = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/insignias");
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error("❌ Error al cargar insignias:", err);
    }
    return [];
  };

  // Función para cargar todos los usuarios (para filtrar estudiantes)
  const fetchUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/usuarios");
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error("❌ Error al cargar usuarios:", err);
    }
    return [];
  };

  // Función principal para calcular rankings
  const calcularRankings = async () => {
    setLoadingRankings(true);

    try {
      // 1. Cargar datos necesarios
      await fetchUsuarioInsignias();
      const insignias = await fetchInsignias();
      const usuarios = await fetchUsuarios();

      // 2. Filtrar solo estudiantes (asumiendo que tienen rol 'ESTUDIANTE')
      const estudiantes = usuarios.filter(
        (u) =>
          u.rol === "ESTUDIANTE" ||
          u.id_rol === 2 ||
          u.tipo_usuario === "ESTUDIANTE"
      );

      // 3. Calcular ranking de insignias
      const conteoInsignias = {};

      usuarioInsignias.forEach((relacion) => {
        const insigniaId = relacion.id_insignia;
        conteoInsignias[insigniaId] = (conteoInsignias[insigniaId] || 0) + 1;
      });

      // Combinar con información de la insignia
      const rankingInsigniasCalculado = insignias
        .map((insignia) => ({
          ...insignia,
          veces_otorgada: conteoInsignias[insignia.id_insignia] || 0,
        }))
        .sort((a, b) => b.veces_otorgada - a.veces_otorgada);

      setRankingInsignias(rankingInsigniasCalculado);

      // 4. Calcular ranking de estudiantes
      const conteoEstudiantes = {};

      usuarioInsignias.forEach((relacion) => {
        const usuarioId = relacion.id_usuario;
        conteoEstudiantes[usuarioId] = (conteoEstudiantes[usuarioId] || 0) + 1;
      });

      // Combinar con información del estudiante
      const rankingEstudiantesCalculado = estudiantes
        .map((estudiante) => ({
          ...estudiante,
          total_insignias: conteoEstudiantes[estudiante.id_usuario] || 0,
        }))
        .sort((a, b) => b.total_insignias - a.total_insignias)
        .filter((e) => e.total_insignias > 0); // Solo mostrar estudiantes con insignias

      setRankingEstudiantes(rankingEstudiantesCalculado);

      console.log("🏆 Ranking insignias:", rankingInsigniasCalculado);
      console.log("👨‍🎓 Ranking estudiantes:", rankingEstudiantesCalculado);
    } catch (err) {
      console.error("❌ Error calculando rankings:", err);
    } finally {
      setLoadingRankings(false);
    }
  };

  // Añadir al useEffect principal
  useEffect(() => {
    fetchCourses();
    fetchInscripciones();
    fetchPagos();
    fetchCanjes();
    fetchEvaluaciones();
    calcularRankings(); // <-- Añadir esta línea
  }, []);

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      try {
        logout();
        setTimeout(() => {
          onNavigate("welcome");
        }, 100);
      } catch (error) {
        console.error("Error durante logout:", error);
        onNavigate("welcome");
      }
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInscripciones();
    fetchPagos();
    fetchCanjes();
    fetchEvaluaciones();
  }, []);

  const fetchEvaluaciones = async () => {
    setLoadingEvaluaciones(true);
    try {
      const res = await fetch("http://localhost:3000/api/evaluaciones");

      if (res.ok) {
        const data = await res.json();
        console.log("📝 Todas las evaluaciones:", data);
        setEvaluaciones(Array.isArray(data) ? data : []);
      } else {
        console.error("❌ Error al cargar evaluaciones:", res.status);
        setEvaluaciones([]);
      }
    } catch (err) {
      console.error("❌ Error al cargar evaluaciones:", err);
      setEvaluaciones([]);
    } finally {
      setLoadingEvaluaciones(false);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/cursos");

      if (!res.ok) {
        throw new Error(
          `Error ${res.status}: No se pudieron cargar los cursos`
        );
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
  // Agrega esta función después de las otras funciones fetch:
  const fetchInsigniasCompletas = async () => {
    setLoadingInsignias(true);
    try {
      const res = await fetch("http://localhost:3000/api/insignias");
      if (res.ok) {
        const data = await res.json();
        console.log("🎖️ Todas las insignias:", data);
        setInsignias(Array.isArray(data) ? data : []);
      } else {
        console.error("❌ Error al cargar insignias:", res.status);
        setInsignias([]);
      }
    } catch (err) {
      console.error("❌ Error al cargar insignias:", err);
      setInsignias([]);
    } finally {
      setLoadingInsignias(false);
    }
  };

  // Agrega esta función antes de handleCreateBadge:
  const handleEditInsignia = (insignia) => {
    setEditingInsignia(insignia);
    setShowBadgeModal(true);
    // Prellenar el formulario con los datos de la insignia
    setBadgeForm({
      nombre_insignia: insignia.nombre || "",
      descripcion: insignia.descripcion || "",
      imagen_url: insignia.imagen_url || "",
      criterio_obtencion: insignia.criterio || "",
      puntos_requeridos: insignia.puntos_requeridos || 0,
      categoria: insignia.categoria || "LOGROS",
    });
  };

  // Cambia el nombre de la función y su contenido:
  const handleCreateOrUpdateBadge = async (e) => {
    e.preventDefault();
    try {
      if (
        !badgeForm.nombre_insignia ||
        badgeForm.nombre_insignia.trim() === ""
      ) {
        alert("❌ El nombre de la insignia es requerido");
        return;
      }

      const body = {
        nombre: badgeForm.nombre_insignia.trim(),
        descripcion: badgeForm.descripcion?.trim() || null,
        criterio: badgeForm.criterio_obtencion?.trim() || null,
      };

      console.log("📤 Enviando datos de insignia:", body);

      let url = "http://localhost:3000/api/insignias";
      let method = "POST";

      // Si estamos editando, usar PUT
      if (editingInsignia) {
        url = `http://localhost:3000/api/insignias/${editingInsignia.id_insignia}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseText = await res.text();
      console.log("📥 Respuesta del servidor:", responseText);

      if (!res.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(
            `Error ${res.status}: ${JSON.stringify(errorData.message)}`
          );
        } catch {
          throw new Error(`Error ${res.status}: ${responseText}`);
        }
      }

      const responseData = JSON.parse(responseText);

      if (editingInsignia) {
        alert(
          `✅ Insignia "${badgeForm.nombre_insignia}" actualizada exitosamente`
        );
        // Actualizar la lista de insignias
        setInsignias(
          insignias.map((i) =>
            i.id_insignia === editingInsignia.id_insignia ? responseData : i
          )
        );
      } else {
        alert(
          `✅ Insignia "${badgeForm.nombre_insignia}" creada exitosamente con ID: ${responseData.id_insignia}`
        );
        // Agregar la nueva insignia a la lista
        setInsignias([...insignias, responseData]);
      }

      // Cerrar modal y resetear formulario
      setShowBadgeModal(false);
      setEditingInsignia(null);
      setBadgeForm({
        nombre_insignia: "",
        descripcion: "",
        imagen_url: "",
        criterio_obtencion: "",
        puntos_requeridos: 0,
        categoria: "LOGROS",
      });
    } catch (err) {
      console.error("❌ Error detallado:", err);

      let errorMessage = err.message || "Error desconocido";

      if (err.message.includes("id_insignia")) {
        errorMessage =
          "Error en la base de datos: no se pudo generar el ID automático. Verifica la configuración de la tabla.";
      } else if (err.message.includes("400")) {
        errorMessage =
          "Error en los datos enviados. Verifica los nombres de los campos.";
      } else if (err.message.includes("500")) {
        errorMessage =
          "Error interno del servidor. Verifica los logs del backend.";
      }

      alert(
        `❌ Error ${
          editingInsignia ? "actualizando" : "creando"
        } insignia: ${errorMessage}`
      );
    }
  };

  const calcularEstadisticasCursos = () => {
    if (!courses.length || !inscripciones.length) return [];

    return courses.map((curso) => {
      const inscripcionesCurso = inscripciones.filter(
        (insc) => insc.id_curso === curso.id_curso
      );

      const totalInscripciones = inscripcionesCurso.length;

      const ingresosTotales = inscripcionesCurso.reduce(
        (total, inscripcion) => {
          if (inscripcion.precio_final) {
            return total + parseFloat(inscripcion.precio_final);
          } else {
            return total + (curso.costo || 0);
          }
        },
        0
      );

      return {
        ...curso,
        totalInscripciones,
        ingresosTotales,
        promedioIngresos: ingresosTotales / Math.max(totalInscripciones, 1),
      };
    });
  };

  const getCursosMasInscritos = () => {
    const cursosConEstadisticas = calcularEstadisticasCursos();
    return cursosConEstadisticas
      .sort((a, b) => b.totalInscripciones - a.totalInscripciones)
      .slice(0, 5);
  };

  const getCursosConMasIngresos = () => {
    const cursosConEstadisticas = calcularEstadisticasCursos();
    return cursosConEstadisticas
      .sort((a, b) => b.ingresosTotales - a.ingresosTotales)
      .slice(0, 5);
  };

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
        estado_disponibilidad: "ACTIVO",
        id_tipo_curso: 1,
      };

      let url = "http://localhost:3000/api/cursos";
      let method = "POST";

      // Si estamos editando, cambiar a PUT
      if (editingCourse) {
        url = `http://localhost:3000/api/cursos/${editingCourse.id_curso}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const courseData = await res.json();

      if (res.ok && courseData.id_curso) {
        if (editingCourse) {
          // Actualizar curso existente en la lista
          setCourses(courses.map(c =>
            c.id_curso === editingCourse.id_curso ? courseData : c
          ));
          alert(`✅ Curso "${form.nombre_curso}" actualizado exitosamente!`);
        } else {
          // Agregar nuevo curso
          setCourses([...courses, courseData]);
          alert(`✅ Curso "${form.nombre_curso}" creado exitosamente!`);
        }

        setShowModal(false);
        setEditingCourse(null);
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
      } else {
        alert(
          `❌ Error ${editingCourse ? 'actualizando' : 'creando'} curso: ` +
          (courseData.message || "Error desconocido")
        );
      }
    } catch (err) {
      alert(`❌ Error ${editingCourse ? 'actualizando' : 'creando'} curso`);
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id, nombre) => {
    if (
      !window.confirm(
        `¿Estás seguro de eliminar el curso "${nombre}"?\n\n⚠️ Esta acción no se puede deshacer.`
      )
    ) {
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

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowModal(true);

    // Prellenar el formulario con los datos del curso
    setForm({
      nombre_curso: course.nombre_curso || "",
      descripcion: course.descripcion || "",
      costo: course.costo || "",
      duracion: course.duracion || "",
      cupos: course.cupos || "",
      modalidad: course.modalidad || "VIRTUAL",
      horarios: [], // Podrías cargar los horarios existentes si los tienes
      modulos: [], // Podrías cargar los módulos existentes si los tienes
    });
  };

  const handleDeleteInsignia = async (id, nombre) => {
    if (
      !window.confirm(
        `¿Estás seguro de eliminar la insignia "${nombre}"?\n\n⚠️ Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/insignias/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setInsignias(insignias.filter((i) => i.id_insignia !== id));
        alert("✅ Insignia eliminada correctamente");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al eliminar la insignia");
      }
    } catch (err) {
      alert("❌ Error eliminando insignia: " + err.message);
      console.error(err);
    }
  };

  const addHorario = () =>
    setForm({
      ...form,
      horarios: [
        ...form.horarios,
        { dia_semana: "", hora_inicio: "", hora_fin: "" },
      ],
    });
  const removeHorario = (i) =>
    setForm({ ...form, horarios: form.horarios.filter((_, idx) => idx !== i) });
  const updateHorario = (i, key, value) => {
    const updated = [...form.horarios];
    updated[i][key] = value;
    setForm({ ...form, horarios: updated });
  };

  const addModulo = () =>
    setForm({
      ...form,
      modulos: [
        ...form.modulos,
        {
          nombre_modulo: "",
          descripcion_modulo: "",
          orden_modulo: form.modulos.length + 1,
        },
      ],
    });
  const removeModulo = (i) =>
    setForm({ ...form, modulos: form.modulos.filter((_, idx) => idx !== i) });
  const updateModulo = (i, key, value) => {
    const updated = [...form.modulos];
    updated[i][key] = value;
    setForm({ ...form, modulos: updated });
  };

  const calcularEvaluacionesPorDocente = () => {
    if (!courses.length || !evaluaciones.length) return [];

    const evaluacionesPorDocente = {};

    evaluaciones.forEach((evaluacion) => {
      if (evaluacion.corregida || evaluacion.calificacion !== null) {
        const docenteId = evaluacion.id_docente;
        if (docenteId) {
          evaluacionesPorDocente[docenteId] =
            (evaluacionesPorDocente[docenteId] || 0) + 1;
        }
      }
    });

    return courses.map((curso) => {
      const docenteId = curso.id_docente;
      const evaluacionesCorregidas = evaluacionesPorDocente[docenteId] || 0;

      const evaluacionesTotales = evaluaciones.filter(
        (evaluacionItem) => evaluacionItem.id_docente === docenteId
      ).length;

      return {
        ...curso,
        evaluacionesCorregidas,
        evaluacionesTotales,
        porcentajeCorregido:
          evaluacionesTotales > 0
            ? Math.round((evaluacionesCorregidas / evaluacionesTotales) * 100)
            : 0,
      };
    });
  };

  const EstadisticasCursos = () => {
    const cursosMasInscritos = getCursosMasInscritos();
    const cursosConMasIngresos = getCursosConMasIngresos();

    return (
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Cursos Más Inscritos
            </h3>
          </div>

          <div className="space-y-3">
            {cursosMasInscritos.map((curso, index) => (
              <div
                key={curso.id_curso}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : index === 2
                        ? "bg-orange-600"
                        : "bg-blue-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {curso.nombre_curso}
                    </p>
                    <p className="text-xs text-gray-500">{curso.modalidad}</p>
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Cursos con Más Ingresos
            </h3>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Precio final
            </span>
          </div>

          <div className="space-y-3">
            {cursosConMasIngresos.map((curso, index) => (
              <div
                key={curso.id_curso}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : index === 2
                        ? "bg-orange-600"
                        : "bg-green-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {curso.nombre_curso}
                    </p>
                    <p className="text-xs text-gray-500">{curso.modalidad}</p>
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

  const EstadisticasCanjes = () => {
    const [loadingCanjes, setLoadingCanjes] = useState(false);

    const canjesUsados = canjes.filter(
      (canje) =>
        canje.utilizado === true ||
        canje.utilizado === 1 ||
        canje.utilizado === "true"
    );

    const canjesDisponibles = canjes.filter(
      (canje) =>
        canje.utilizado === false ||
        canje.utilizado === 0 ||
        canje.utilizado === "false"
    );

    const canjesPorTipo = canjesUsados.reduce((acc, canje) => {
      const tipo = canje.nombre_recompensa || canje.nombre || "Sin nombre";
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    const canjesPopulares = Object.entries(canjesPorTipo)
      .sort(([, a], [, b]) => b - a)
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
            <h3 className="text-xl font-semibold text-gray-900">
              Estadísticas de Cupones
            </h3>
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
              <RefreshCw
                className={`w-4 h-4 ${loadingCanjes ? "animate-spin" : ""}`}
              />
              Actualizar
            </button>
          </div>
        </div>

        {loadingCanjes ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">
              Cargando estadísticas de canjes...
            </p>
          </div>
        ) : canjes.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No hay cupones registrados en el sistema
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">
                      Total Cupones
                    </p>
                    <p className="text-2xl font-bold text-purple-800">
                      {canjes.length}
                    </p>
                  </div>
                  <Gift className="w-8 h-8 text-purple-600 opacity-70" />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">
                      Cupones Usados
                    </p>
                    <p className="text-2xl font-bold text-green-800">
                      {canjesUsados.length}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {canjes.length > 0
                        ? `${(
                            (canjesUsados.length / canjes.length) *
                            100
                          ).toFixed(1)}% de uso`
                        : "0%"}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600 opacity-70" />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">
                      Cupones Disponibles
                    </p>
                    <p className="text-2xl font-bold text-blue-800">
                      {canjesDisponibles.length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600 opacity-70" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">
                  Cupones Más Utilizados
                </h4>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {canjesPopulares.length} tipos
                </span>
              </div>

              {canjesPopulares.length > 0 ? (
                <div className="space-y-3">
                  {canjesPopulares.map((canje, index) => (
                    <div
                      key={canje.nombre}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-gray-400"
                              : index === 2
                              ? "bg-orange-600"
                              : "bg-purple-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {canje.nombre}
                          </p>
                          <p className="text-xs text-gray-500">
                            {canje.count} {canje.count === 1 ? "uso" : "usos"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-purple-600 text-sm">
                          {canjesUsados.length > 0
                            ? `${(
                                (canje.count / canjesUsados.length) *
                                100
                              ).toFixed(1)}%`
                            : "0%"}
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

              {canjesDisponibles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Algunos Cupones Disponibles
                  </h4>
                  <div className="space-y-2">
                    {canjesDisponibles.slice(0, 3).map((canje, index) => (
                      <div
                        key={canje.id_canje}
                        className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {canje.nombre_recompensa || "Cupón sin nombre"}
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

  const TablaDocentesEvaluaciones = () => {
    const cursosConEvaluaciones = calcularEvaluacionesPorDocente();

    const docentesMap = {};

    cursosConEvaluaciones.forEach((curso) => {
      if (curso.docente) {
        const docenteId = curso.docente.id_usuario;
        if (!docentesMap[docenteId]) {
          docentesMap[docenteId] = {
            docente: curso.docente,
            cursos: [],
            evaluacionesCorregidas: curso.evaluacionesCorregidas,
            evaluacionesTotales: curso.evaluacionesTotales,
            porcentajeCorregido: curso.porcentajeCorregido,
          };
        } else {
          docentesMap[docenteId].evaluacionesCorregidas +=
            curso.evaluacionesCorregidas;
          docentesMap[docenteId].evaluacionesTotales +=
            curso.evaluacionesTotales;
        }

        docentesMap[docenteId].cursos.push(curso.nombre_curso);
      }
    });

    Object.values(docentesMap).forEach((docenteInfo) => {
      docenteInfo.porcentajeCorregido =
        docenteInfo.evaluacionesTotales > 0
          ? Math.round(
              (docenteInfo.evaluacionesCorregidas /
                docenteInfo.evaluacionesTotales) *
                100
            )
          : 0;
    });

    const docentes = Object.values(docentesMap);

    const handleRefreshEvaluaciones = async () => {
      await fetchEvaluaciones();
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-indigo-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Docentes y Evaluaciones
              </h3>
              <p className="text-sm text-gray-600">
                Cursos asignados y evaluaciones corregidas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {docentes.length} docentes
            </span>
            <button
              onClick={handleRefreshEvaluaciones}
              disabled={loadingEvaluaciones}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  loadingEvaluaciones ? "animate-spin" : ""
                }`}
              />
              Actualizar
            </button>
          </div>
        </div>

        {loadingEvaluaciones ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">
              Cargando información de evaluaciones...
            </p>
          </div>
        ) : docentes.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No hay docentes con cursos asignados
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Docente
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cursos Asignados
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Evaluaciones
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Progreso
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {docentes.map((docenteInfo, index) => (
                  <tr
                    key={docenteInfo.docente.id_usuario}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {docenteInfo.docente.nombre}{" "}
                            {docenteInfo.docente.apellido}
                          </div>
                          <div className="text-xs text-gray-500">
                            {docenteInfo.docente.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {docenteInfo.cursos.slice(0, 3).map((curso, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {curso}
                          </span>
                        ))}
                        {docenteInfo.cursos.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{docenteInfo.cursos.length - 3} más
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Total: {docenteInfo.cursos.length} curso
                        {docenteInfo.cursos.length !== 1 ? "s" : ""}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">
                                Corregidas:
                              </span>
                              <span className="font-semibold text-green-600">
                                {docenteInfo.evaluacionesCorregidas}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">
                                Pendientes:
                              </span>
                              <span className="font-semibold text-yellow-600">
                                {docenteInfo.evaluacionesTotales -
                                  docenteInfo.evaluacionesCorregidas}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">
                                Total:
                              </span>
                              <span className="font-semibold text-gray-900">
                                {docenteInfo.evaluacionesTotales}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">
                              Progreso:
                            </span>
                            <span className="font-semibold text-indigo-600">
                              {docenteInfo.porcentajeCorregido}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                docenteInfo.porcentajeCorregido >= 80
                                  ? "bg-green-500"
                                  : docenteInfo.porcentajeCorregido >= 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  docenteInfo.porcentajeCorregido,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {docentes.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              Resumen General
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">
                      Total Docentes Activos
                    </p>
                    <p className="text-2xl font-bold text-blue-800">
                      {docentes.length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600 opacity-70" />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">
                      Evaluaciones Corregidas
                    </p>
                    <p className="text-2xl font-bold text-green-800">
                      {docentes.reduce(
                        (sum, d) => sum + d.evaluacionesCorregidas,
                        0
                      )}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600 opacity-70" />
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">
                      Promedio de Progreso
                    </p>
                    <p className="text-2xl font-bold text-orange-800">
                      {docentes.length > 0
                        ? Math.round(
                            docentes.reduce(
                              (sum, d) => sum + d.porcentajeCorregido,
                              0
                            ) / docentes.length
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600 opacity-70" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  // ... después de TablaDocentesEvaluaciones pero ANTES del return principal

  // Agrega esto antes del return principal, después de los otros componentes:
  const GestionInsignias = () => {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Gestión de Insignias
              </h3>
              <p className="text-sm text-gray-600">
                Ver, editar y eliminar insignias del sistema
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {insignias.length} insignias
            </span>
            <button
              onClick={fetchInsigniasCompletas}
              disabled={loadingInsignias}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${loadingInsignias ? "animate-spin" : ""}`}
              />
              Actualizar
            </button>
          </div>
        </div>

        {loadingInsignias ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Cargando insignias...</p>
          </div>
        ) : insignias.length === 0 ? (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No hay insignias registradas en el sistema
            </p>
            <button
              onClick={() => {
                setShowGestionInsignias(false);
                setShowBadgeModal(true);
              }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Crear Primera Insignia
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Insignia
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Descripción
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Criterio
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha Creación
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {insignias.map((insignia) => (
                  <tr
                    key={insignia.id_insignia}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-yellow-700" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {insignia.nombre || "Sin nombre"}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {insignia.id_insignia}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                        {insignia.descripcion || "Sin descripción"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                        {insignia.criterio || "Sin criterio definido"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {insignia.fecha_creacion
                          ? new Date(
                              insignia.fecha_creacion
                            ).toLocaleDateString()
                          : "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {insignia.fecha_creacion
                          ? new Date(
                              insignia.fecha_creacion
                            ).toLocaleTimeString()
                          : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditInsignia(insignia)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          Editar
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteInsignia(
                              insignia.id_insignia,
                              insignia.nombre
                            )
                          }
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Mostrando {insignias.length} insignia
              {insignias.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={() => {
                setEditingInsignia(null);
                setShowBadgeModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Agregar Nueva Insignia
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 🆕 COMPONENTE PARA RANKING DE INSIGNIAS
  const RankingInsigniasGlobal = () => {
    const handleRefresh = () => {
      calcularRankings();
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Ranking Global de Insignias
              </h3>
              <p className="text-sm text-gray-600">
                Insignias más otorgadas a los estudiantes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {rankingInsignias.length} insignias
            </span>
            <button
              onClick={handleRefresh}
              disabled={loadingRankings}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${loadingRankings ? "animate-spin" : ""}`}
              />
              Actualizar
            </button>
          </div>
        </div>

        {loadingRankings ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">
              Cargando ranking de insignias...
            </p>
          </div>
        ) : rankingInsignias.length === 0 ? (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No hay datos de insignias disponibles
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Posición
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Insignia
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Descripción
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Veces Otorgada
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Porcentaje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankingInsignias.slice(0, 10).map((insignia, index) => {
                  const totalOtorgadas = rankingInsignias.reduce(
                    (sum, i) => sum + (i.veces_otorgada || 0),
                    0
                  );
                  const porcentaje =
                    totalOtorgadas > 0
                      ? (
                          ((insignia.veces_otorgada || 0) / totalOtorgadas) *
                          100
                        ).toFixed(1)
                      : 0;

                  return (
                    <tr
                      key={insignia.id_insignia}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              index === 0
                                ? "bg-yellow-500"
                                : index === 1
                                ? "bg-gray-400"
                                : index === 2
                                ? "bg-orange-600"
                                : "bg-blue-500"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Award className="w-5 h-5 text-yellow-700" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {insignia.nombre || "Sin nombre"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {insignia.criterio || "Sin criterio"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {insignia.descripcion || "Sin descripción"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                            {insignia.veces_otorgada || 0}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            otorgaciones
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">
                                {porcentaje}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-yellow-500"
                                style={{
                                  width: `${Math.min(porcentaje, 100)}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // 🆕 COMPONENTE PARA RANKING DE ESTUDIANTES
  const RankingEstudiantesGlobal = () => {
    const handleRefresh = () => {
      calcularRankings();
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Ranking Global de Estudiantes
              </h3>
              <p className="text-sm text-gray-600">
                Estudiantes con más insignias obtenidas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {rankingEstudiantes.length} estudiantes
            </span>
            <button
              onClick={handleRefresh}
              disabled={loadingRankings}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${loadingRankings ? "animate-spin" : ""}`}
              />
              Actualizar
            </button>
          </div>
        </div>

        {loadingRankings ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">
              Cargando ranking de estudiantes...
            </p>
          </div>
        ) : rankingEstudiantes.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No hay estudiantes con insignias registradas
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Las insignias aparecerán aquí cuando sean otorgadas a estudiantes
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Posición
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estudiante
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contacto
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Insignias Obtenidas
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Progreso
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankingEstudiantes.slice(0, 10).map((estudiante, index) => {
                  const maxInsignias =
                    rankingEstudiantes[0]?.total_insignias || 1;
                  const porcentaje = (
                    (estudiante.total_insignias / maxInsignias) *
                    100
                  ).toFixed(0);

                  return (
                    <tr
                      key={estudiante.id_usuario}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              index === 0
                                ? "bg-yellow-500"
                                : index === 1
                                ? "bg-gray-400"
                                : index === 2
                                ? "bg-orange-600"
                                : "bg-green-500"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-green-700" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {estudiante.nombre} {estudiante.apellido}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {estudiante.id_usuario}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {estudiante.email || "Sin email"}
                        </div>
                        {estudiante.telefono && (
                          <div className="text-xs text-gray-500">
                            {estudiante.telefono}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Award className="w-4 h-4 text-yellow-600" />
                            <span className="text-lg font-bold text-gray-900">
                              {estudiante.total_insignias}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {estudiante.total_insignias === 1
                              ? "insignia"
                              : "insignias"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">
                                Progreso
                              </span>
                              <span className="font-semibold text-green-600">
                                {porcentaje}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  porcentaje >= 80
                                    ? "bg-green-500"
                                    : porcentaje >= 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${porcentaje}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>0</span>
                              <span>{maxInsignias} (máximo)</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {rankingEstudiantes.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">
                    Estudiante Destacado
                  </p>
                  <p className="text-sm font-semibold text-green-800 truncate">
                    {rankingEstudiantes[0]?.nombre}{" "}
                    {rankingEstudiantes[0]?.apellido}
                  </p>
                  <p className="text-xs text-green-600">
                    {rankingEstudiantes[0]?.total_insignias} insignias
                  </p>
                </div>
                <Award className="w-8 h-8 text-green-600 opacity-70" />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Total Insignias Otorgadas
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    {rankingEstudiantes.reduce(
                      (sum, e) => sum + e.total_insignias,
                      0
                    )}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {rankingInsignias.length} tipos de insignias
                  </p>
                </div>
                <Star className="w-8 h-8 text-blue-600 opacity-70" />
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">
                    Promedio por Estudiante
                  </p>
                  <p className="text-2xl font-bold text-purple-800">
                    {rankingEstudiantes.length > 0
                      ? (
                          rankingEstudiantes.reduce(
                            (sum, e) => sum + e.total_insignias,
                            0
                          ) / rankingEstudiantes.length
                        ).toFixed(1)
                      : 0}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    {rankingEstudiantes.length} estudiantes activos
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600 opacity-70" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  const TablaCompletaPuntajes = () => {
    const [filtroActivo, setFiltroActivo] = useState("todos");

    // Filtrar datos según el filtro seleccionado
    const datosFiltrados = puntajesData.filter((puntaje) => {
      if (filtroActivo === "con-puntos")
        return puntaje.total_puntos_obtenidos > 0;
      if (filtroActivo === "canjeados") return puntaje.total_puntos_usados > 0;
      if (filtroActivo === "disponibles") return puntaje.total_saldo_puntos > 0;
      return true; // 'todos'
    });

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <Book className="w-6 h-6 text-indigo-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Registro Completo de Puntajes
              </h3>
              <p className="text-sm text-gray-600">
                Detalle de todos los estudiantes y sus puntos
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroActivo("todos")}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filtroActivo === "todos"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos ({puntajesData.length})
            </button>
            <button
              onClick={() => setFiltroActivo("con-puntos")}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filtroActivo === "con-puntos"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Con Puntos (
              {puntajesData.filter((p) => p.total_puntos_obtenidos > 0).length})
            </button>
            <button
              onClick={() => setFiltroActivo("canjeados")}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filtroActivo === "canjeados"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Con Canjes (
              {puntajesData.filter((p) => p.total_puntos_usados > 0).length})
            </button>
          </div>
        </div>

        {loadingPuntos ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">
              Cargando registro de puntajes...
            </p>
          </div>
        ) : puntajesData.length === 0 ? (
          <div className="text-center py-8">
            <Book className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No hay registros de puntajes disponibles
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estudiante
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Puntos Acumulados
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Puntos Usados
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Saldo
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Detalle
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {datosFiltrados.map((puntaje) => (
                  <tr
                    key={puntaje.id_puntaje}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-indigo-700" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {puntaje.usuario.nombre} {puntaje.usuario.apellido}
                          </div>
                          <div className="text-xs text-gray-500">
                            {puntaje.usuario.correo_electronico}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            puntaje.total_puntos_obtenidos > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {puntaje.total_puntos_obtenidos}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            puntaje.total_puntos_usados > 0
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {puntaje.total_puntos_usados}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            puntaje.total_saldo_puntos > 50
                              ? "bg-yellow-100 text-yellow-800"
                              : puntaje.total_saldo_puntos > 20
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {puntaje.total_saldo_puntos}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-600 max-w-xs line-clamp-2">
                        {puntaje.detalle || "Sin detalles"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(puntaje.fecha_registro).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(puntaje.fecha_registro).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {puntajesData.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Registros</p>
                <p className="text-xl font-bold text-gray-900">
                  {puntajesData.length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Filtrados</p>
                <p className="text-xl font-bold text-gray-900">
                  {datosFiltrados.length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Con Puntos</p>
                <p className="text-xl font-bold text-green-600">
                  {
                    puntajesData.filter((p) => p.total_puntos_obtenidos > 0)
                      .length
                  }
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Con Canjes</p>
                <p className="text-xl font-bold text-blue-600">
                  {puntajesData.filter((p) => p.total_puntos_usados > 0).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  const RankingPuntosEstudiantes = () => {
    const handleRefresh = () => {
      fetchPuntajes();
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Ranking por Puntos
              </h3>
              <p className="text-sm text-gray-600">
                Estudiantes con más puntos disponibles
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {rankingPuntos.length} estudiantes
            </span>
            <button
              onClick={handleRefresh}
              disabled={loadingPuntos}
              className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${loadingPuntos ? "animate-spin" : ""}`}
              />
              Actualizar
            </button>
          </div>
        </div>

        {loadingPuntos ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">
              Cargando ranking de puntos...
            </p>
          </div>
        ) : rankingPuntos.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No hay estudiantes con puntos registrados
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Los puntos aparecerán aquí cuando los estudiantes los ganen
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Posición
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estudiante
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Puntos Totales
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Distribución
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Detalles
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankingPuntos.map((estudiante, index) => {
                  const porcentajeCanjeados =
                    estudiante.puntos_acumulados > 0
                      ? (
                          (estudiante.puntos_canjeados /
                            estudiante.puntos_acumulados) *
                          100
                        ).toFixed(1)
                      : 0;

                  const porcentajeDisponibles =
                    estudiante.puntos_acumulados > 0
                      ? (
                          (estudiante.puntos_disponibles /
                            estudiante.puntos_acumulados) *
                          100
                        ).toFixed(1)
                      : 0;

                  return (
                    <tr
                      key={estudiante.id_usuario}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              index === 0
                                ? "bg-yellow-500"
                                : index === 1
                                ? "bg-gray-400"
                                : index === 2
                                ? "bg-orange-600"
                                : "bg-green-500"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-orange-700" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {estudiante.nombre} {estudiante.apellido}
                            </div>
                            <div className="text-xs text-gray-500">
                              {estudiante.correo_electronico}
                            </div>
                            <div className="text-xs text-gray-400">
                              ID: {estudiante.id_usuario}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">
                              Acumulados:
                            </span>
                            <span className="font-semibold text-gray-900">
                              {estudiante.puntos_acumulados}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">
                              Canjeados:
                            </span>
                            <span className="font-semibold text-blue-600">
                              {estudiante.puntos_canjeados}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">
                              Disponibles:
                            </span>
                            <span className="font-bold text-green-600">
                              {estudiante.puntos_disponibles}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 border-t pt-1 mt-1">
                            Registro:{" "}
                            {new Date(
                              estudiante.fecha_registro
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-600">
                                Disponibles: {porcentajeDisponibles}%
                              </span>
                              <span className="text-gray-600">
                                Canjeados: {porcentajeCanjeados}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="flex h-full">
                                <div
                                  className="bg-green-500 h-full"
                                  style={{ width: `${porcentajeDisponibles}%` }}
                                ></div>
                                <div
                                  className="bg-blue-500 h-full"
                                  style={{ width: `${porcentajeCanjeados}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {estudiante.puntos_disponibles === 0
                              ? "Sin puntos disponibles"
                              : estudiante.puntos_disponibles >= 100
                              ? "💎 Nivel Oro"
                              : estudiante.puntos_disponibles >= 50
                              ? "🥈 Nivel Plata"
                              : "🥉 Nivel Bronce"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 line-clamp-3">
                          {estudiante.detalle || "Sin detalles específicos"}
                        </div>
                        <div className="flex gap-2 mt-2">
                          {estudiante.detalle &&
                            estudiante.detalle.includes("Módulos") && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                📚 Módulos
                              </span>
                            )}
                          {estudiante.detalle &&
                            estudiante.detalle.includes("Foros") && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                💬 Foros
                              </span>
                            )}
                          {estudiante.detalle &&
                            estudiante.detalle.includes("Evaluaciones") && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                                📝 Evaluaciones
                              </span>
                            )}
                          {estudiante.detalle &&
                            estudiante.detalle.includes("asistencia") && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                                ✅ Asistencia
                              </span>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {rankingPuntos.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">
                    Líder del Ranking
                  </p>
                  <p className="text-sm font-semibold text-orange-800 truncate">
                    {rankingPuntos[0]?.nombre} {rankingPuntos[0]?.apellido}
                  </p>
                  <p className="text-xs text-orange-600">
                    {rankingPuntos[0]?.puntos_disponibles} puntos disponibles
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600 opacity-70" />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">
                    Mayor Acumulación
                  </p>
                  <p className="text-2xl font-bold text-green-800">
                    {Math.max(...rankingPuntos.map((e) => e.puntos_acumulados))}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Puntos acumulados por un estudiante
                  </p>
                </div>
                <Star className="w-8 h-8 text-green-600 opacity-70" />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Tasa de Canje General
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    {puntosData.totalAcumulados > 0
                      ? `${(
                          (puntosData.totalCanjeados /
                            puntosData.totalAcumulados) *
                          100
                        ).toFixed(1)}%`
                      : "0%"}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Del total acumulado
                  </p>
                </div>
                <Gift className="w-8 h-8 text-blue-600 opacity-70" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  const CuadroPuntos = () => {
    const handleRefresh = () => {
      fetchPuntajes();
    };

    // Calcular porcentajes
    const porcentajeCanjeados =
      puntosData.totalAcumulados > 0
        ? (
            (puntosData.totalCanjeados / puntosData.totalAcumulados) *
            100
          ).toFixed(1)
        : 0;

    const porcentajeDisponibles =
      puntosData.totalAcumulados > 0
        ? ((puntosData.disponibles / puntosData.totalAcumulados) * 100).toFixed(
            1
          )
        : 0;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Sistema de Puntos
              </h3>
              <p className="text-sm text-gray-600">
                Resumen de puntos acumulados y canjeados
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {puntosData.estudiantesConPuntos} estudiantes
            </span>
            <button
              onClick={handleRefresh}
              disabled={loadingPuntos}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${loadingPuntos ? "animate-spin" : ""}`}
              />
              Actualizar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">
                  Puntos Acumulados
                </p>
                <p className="text-2xl font-bold text-green-800">
                  {puntosData.totalAcumulados.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">Total histórico</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600 opacity-70" />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">
                  Puntos Canjeados
                </p>
                <p className="text-2xl font-bold text-blue-800">
                  {puntosData.totalCanjeados.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {porcentajeCanjeados}% del total
                </p>
              </div>
              <Gift className="w-8 h-8 text-blue-600 opacity-70" />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">
                  Puntos Disponibles
                </p>
                <p className="text-2xl font-bold text-yellow-800">
                  {puntosData.disponibles.toLocaleString()}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  {porcentajeDisponibles}% sin usar
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-600 opacity-70" />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">
                  Promedio por Estudiante
                </p>
                <p className="text-2xl font-bold text-purple-800">
                  {puntosData.promedioPuntos}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {puntosData.estudiantesConPuntos} estudiantes activos
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600 opacity-70" />
            </div>
          </div>
        </div>

        {/* Gráfico de distribución de puntos */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-900 mb-4">
            Distribución de Puntos
          </h4>
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div
                className="bg-green-500 h-full transition-all duration-500"
                style={{ width: `${porcentajeDisponibles}%` }}
                title="Puntos disponibles"
              ></div>
              <div
                className="bg-blue-500 h-full transition-all duration-500"
                style={{ width: `${porcentajeCanjeados}%` }}
                title="Puntos canjeados"
              ></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>
                Disponibles ({puntosData.disponibles.toLocaleString()})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>
                Canjeados ({puntosData.totalCanjeados.toLocaleString()})
              </span>
            </div>
          </div>
        </div>

        {/* Ejemplos de estudiantes destacados */}
        {rankingPuntos.length > 0 && (
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">
              Estudiantes Destacados
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rankingPuntos.slice(0, 3).map((estudiante, index) => (
                <div
                  key={estudiante.id_usuario}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : "bg-orange-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {estudiante.nombre} {estudiante.apellido}
                      </p>
                      <p className="text-xs text-gray-500">
                        {estudiante.correo_electronico}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Disponibles:</span>
                      <span className="font-semibold text-green-600">
                        {estudiante.puntos_disponibles}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Canjeados:</span>
                      <span className="font-semibold text-blue-600">
                        {estudiante.puntos_canjeados}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {estudiante.detalle || "Sin detalles"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  const ResumenEstadisticas = () => {
    const cursosConEstadisticas = calcularEstadisticasCursos();
    const totalInscripciones = cursosConEstadisticas.reduce(
      (sum, curso) => sum + (curso.totalInscripciones || 0),
      0
    );
    const totalIngresos = cursosConEstadisticas.reduce(
      (sum, curso) => sum + (curso.ingresosTotales || 0),
      0
    );
    const cursoMasPopular = getCursosMasInscritos()[0];
    const cursoMasRentable = getCursosConMasIngresos()[0];

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Cursos</p>
              <p className="text-2xl font-bold text-blue-800">
                {courses.length}
              </p>
            </div>
            <Book className="w-8 h-8 text-blue-600 opacity-70" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">
                Total Inscripciones
              </p>
              <p className="text-2xl font-bold text-green-800">
                {totalInscripciones}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600 opacity-70" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">
                Ingresos Totales
              </p>
              <p className="text-2xl font-bold text-purple-800">
                ${totalIngresos.toLocaleString()}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                Precio final aplicado
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600 opacity-70" />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">
                Curso Más Rentable
              </p>
              <p className="text-sm font-semibold text-orange-800 truncate">
                {cursoMasRentable?.nombre_curso || "N/A"}
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
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Cerrar sesión"
      >
        <LogOut className="w-5 h-5" />
      </button>

      <header className="bg-blue-800 text-white border-b border-blue-900 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <GraduationCap
                className="w-6 h-6 text-blue-800"
                strokeWidth={2}
              />
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
              onClick={() => setShowBadgeModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium shadow-sm"
            >
              <Award className="w-5 h-5" />
              Crear Insignia
            </button>

            <button
              onClick={() => setShowGestionInsignias(!showGestionInsignias)}
              className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg shadow-sm transition ${
                showGestionInsignias
                  ? "bg-yellow-700 text-white hover:bg-yellow-800"
                  : "bg-yellow-600 text-white hover:bg-yellow-700"
              }`}
            >
              <Award className="w-5 h-5" />
              {showGestionInsignias
                ? "Volver al Dashboard"
                : "Gestionar Insignias"}
            </button>

            <button
              onClick={() => onNavigate("admin-permissions")}
              className="flex items-center gap-2 px-4 py-2 bg-white font-medium text-indigo-700 rounded-lg shadow hover:bg-indigo-700 hover:text-white transition"
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
            <button
              onClick={() => onNavigate("reportes-sistema")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <FileText className="w-5 h-5" />
              Reportes
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

        <ResumenEstadisticas />

        {/* Agrega esta condición: */}
        {showGestionInsignias ? (
          <GestionInsignias />
        ) : (
          <>
            <EstadisticasCursos />
            <EstadisticasCanjes />
            <TablaDocentesEvaluaciones />
            <RankingInsigniasGlobal />
            <RankingEstudiantesGlobal />
            <CuadroPuntos />
            <RankingPuntosEstudiantes />
            <TablaCompletaPuntajes />

            {/* El resto de tu dashboard normal... */}
            {/* No modifiques lo que viene después */}
          </>
        )}

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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Todos los Cursos
            </h2>
            <p className="text-gray-600">
              <span className="font-semibold text-blue-800">
                {courses.length}
              </span>{" "}
              curso{courses.length !== 1 ? "s" : ""} registrado
              {courses.length !== 1 ? "s" : ""}
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
                {error
                  ? "No se pudieron cargar los cursos"
                  : "No hay cursos registrados"}
              </p>
              <p className="text-gray-500 mb-6">
                {error
                  ? "Intenta recargar la página"
                  : "¡Crea el primer curso para comenzar!"}
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
                const cursoConEstadisticas = calcularEstadisticasCursos().find(
                  (c) => c.id_curso === course.id_curso
                );

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
                      {cursoConEstadisticas && (
                        <>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-medium">Inscritos:</span>
                            <span className="font-semibold text-blue-600">
                              {cursoConEstadisticas.totalInscripciones || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-medium">
                              Ingresos reales:
                            </span>
                            <span className="font-semibold text-green-600">
                              $
                              {(
                                cursoConEstadisticas.ingresosTotales || 0
                              ).toLocaleString()}
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
                        onClick={() => handleEditCourse(course)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteCourse(
                            course.id_curso,
                            course.nombre_curso
                          )
                        }
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

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative animate-fadeInScale overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              onClick={() => {
                setShowModal(false);
                setEditingCourse(null);
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
              }}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-semibold text-blue-700 mb-5 text-center">
              {editingCourse ? "Editar Curso" : "Crear Nuevo Curso"}
            </h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Curso
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
                  value={form.nombre_curso}
                  onChange={(e) =>
                    setForm({ ...form, nombre_curso: e.target.value })
                  }
                  placeholder="HTML Y CSS"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                  placeholder="Aprende a crear e interactuar con el desarrollo de paginas web"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Costo ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
                    value={form.costo}
                    onChange={(e) =>
                      setForm({ ...form, costo: e.target.value })
                    }
                    placeholder="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cupos
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
                    value={form.cupos}
                    onChange={(e) =>
                      setForm({ ...form, cupos: e.target.value })
                    }
                    placeholder="50"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración (h)
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
                    value={form.duracion}
                    onChange={(e) =>
                      setForm({ ...form, duracion: e.target.value })
                    }
                    placeholder="60"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modalidad
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
                    value={form.modalidad}
                    onChange={(e) =>
                      setForm({ ...form, modalidad: e.target.value })
                    }
                  >
                    <option value="VIRTUAL">VIRTUAL</option>
                    <option value="PRESENCIAL">PRESENCIAL</option>
                    <option value="HIBRIDO">HIBRIDO</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Horarios</h3>
                {form.horarios.map((h, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Día (ej: Lunes)"
                      value={h.dia_semana}
                      onChange={(e) =>
                        updateHorario(i, "dia_semana", e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="time"
                      placeholder="Inicio"
                      value={h.hora_inicio}
                      onChange={(e) =>
                        updateHorario(i, "hora_inicio", e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="time"
                      placeholder="Fin"
                      value={h.hora_fin}
                      onChange={(e) =>
                        updateHorario(i, "hora_fin", e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeHorario(i)}
                      className="text-red-500 font-bold hover:text-red-700"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addHorario}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Agregar Horario
                </button>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Módulos</h3>
                {form.modulos.map((m, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Nombre del módulo"
                      value={m.nombre_modulo}
                      onChange={(e) =>
                        updateModulo(i, "nombre_modulo", e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      placeholder="Descripción"
                      value={m.descripcion_modulo}
                      onChange={(e) =>
                        updateModulo(i, "descripcion_modulo", e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeModulo(i)}
                      className="text-red-500 font-bold hover:text-red-700"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addModulo}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Agregar Módulo
                </button>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCourse(null);
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
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingCourse ? "Actualizar Curso" : "Crear Curso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBadgeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative animate-fadeInScale max-h-[90vh] flex flex-col">
            {/* Botón de cerrar en la esquina superior derecha */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition z-10"
              onClick={() => {
                setShowBadgeModal(false);
                setEditingInsignia(null);
                setBadgeForm({
                  nombre_insignia: "",
                  descripcion: "",
                  imagen_url: "",
                  criterio_obtencion: "",
                  puntos_requeridos: 0,
                  categoria: "LOGROS",
                });
              }}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Contenido del modal con scroll si es necesario */}
            <div className="p-8 overflow-y-auto flex-1">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {editingInsignia ? "Editar Insignia" : "Crear Nueva Insignia"}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {editingInsignia ? "Modifica los datos de la insignia" : "Crea insignias para recompensar a los usuarios"}
                </p>
              </div>

              <form onSubmit={handleCreateOrUpdateBadge} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Insignia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-200 outline-none"
                    value={badgeForm.nombre_insignia}
                    onChange={(e) => setBadgeForm({ ...badgeForm, nombre_insignia: e.target.value })}
                    placeholder="Ej: Curso Completado, Participación Activa, etc."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Este campo es obligatorio</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-200 outline-none"
                    value={badgeForm.descripcion}
                    onChange={(e) => setBadgeForm({ ...badgeForm, descripcion: e.target.value })}
                    placeholder="Describe qué representa esta insignia (opcional)"
                    rows="3"
                  />
                  <p className="text-xs text-gray-500 mt-1">Opcional. Puedes dejar este campo vacío.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Criterio de Obtención
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-200 outline-none"
                    value={badgeForm.criterio_obtencion}
                    onChange={(e) => setBadgeForm({ ...badgeForm, criterio_obtencion: e.target.value })}
                    placeholder="Ej: Completar 5 cursos, Asistir a 10 clases, etc."
                  />
                  <p className="text-xs text-gray-500 mt-1">Opcional. Describe cómo se gana esta insignia.</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Información</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Actualmente, la insignia solo guarda: <span className="font-semibold">Nombre, Descripción y Criterio</span>.
                        Otros campos como imagen, puntos o categoría estarán disponibles en una futura actualización.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Vista Previa</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-8 h-8 text-yellow-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {badgeForm.nombre_insignia || "Nombre de la insignia"}
                      </p>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                        {badgeForm.descripcion || "Descripción de la insignia"}
                      </p>
                      <p className="text-yellow-600 text-xs mt-2">
                        {badgeForm.criterio_obtencion ? `Criterio: ${badgeForm.criterio_obtencion}` : "Criterio: Sin definir"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Los botones estarán fuera del formulario pero dentro del div principal */}
              </form>
            </div>

            {/* Sección de botones fija en la parte inferior */}
            <div className="border-t border-gray-200 p-6 bg-white rounded-b-2xl">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowBadgeModal(false);
                    setEditingInsignia(null);
                    setBadgeForm({
                      nombre_insignia: "",
                      descripcion: "",
                      imagen_url: "",
                      criterio_obtencion: "",
                      puntos_requeridos: 0,
                      categoria: "LOGROS",
                    });
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={handleCreateOrUpdateBadge}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  {editingInsignia ? "Actualizar Insignia" : "Crear Insignia"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
