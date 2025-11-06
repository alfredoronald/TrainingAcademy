import React, { useEffect, useState } from "react";
import { User, BookOpen, Trash2, PlusCircle, GraduationCap, X, Clock, List, CheckCircle, XCircle } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

export default function TeacherDashboard({ onNavigate }) {
  const { user } = useAuthContext();
  const idUsuario = user?.id_usuario;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tipoCursos, setTipoCursos] = useState([]);
  
  // 🆕 Estado para notificaciones
  const [notification, setNotification] = useState({
    show: false,
    type: '', // 'success', 'error', 'warning'
    message: '',
    title: ''
  });

  const [form, setForm] = useState({
    nombre_curso: "",
    descripcion: "",
    costo: "",
    duracion: "",
    cupos: "",
    modalidad: "VIRTUAL",
    id_tipo_curso: "",
    horarios: [],
    modulos: [],
  });

  // 🆕 Mostrar notificación
  const showNotification = (type, title, message) => {
    setNotification({
      show: true,
      type,
      title,
      message
    });
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '', title: '' });
    }, 5000);
  };

  // 🆕 Cerrar notificación manualmente
  const closeNotification = () => {
    setNotification({ show: false, type: '', message: '', title: '' });
  };

  // 🚀 Cargar cursos del docente
  useEffect(() => {
    if (!idUsuario) return;
    setLoading(true);
    fetch(`http://localhost:3000/api/cursos?docente=${idUsuario}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCourses(data);
        else setError(data.message || "Error al cargar cursos");
      })
      .catch(() => setError("No se pudo conectar con el servidor"))
      .finally(() => setLoading(false));
  }, [idUsuario]);

  // 🟢 Cargar tipos de curso
  useEffect(() => {
    fetch("http://localhost:3000/api/tipos-curso")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTipoCursos(data);
        else console.error("Error al obtener tipos de curso", data);
      })
      .catch((err) => console.error("Error al conectar con tipos de curso:", err));
  }, []);

  // 🟢 Crear curso (SOLO CURSO, sin horarios y módulos)
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      // 🔥 SOLUCIÓN: Enviar solo los datos del curso, sin horarios y módulos
      const body = {
        nombre_curso: form.nombre_curso,
        descripcion: form.descripcion,
        costo: Number(form.costo),
        duracion: Number(form.duracion),
        cupos: Number(form.cupos),
        modalidad: form.modalidad,
        id_docente: idUsuario,
        estado_disponibilidad: "ACTIVO",
        id_tipo_curso: Number(form.id_tipo_curso),
      };

      console.log("Enviando datos del curso:", body);

      const res = await fetch("http://localhost:3000/api/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const newCourse = await res.json();

      if (res.ok && newCourse.id_curso) {
        console.log("Curso creado exitosamente:", newCourse);
        
        // 🔥 CREAR HORARIOS Y MÓDULOS POR SEPARADO
        await createHorarios(newCourse.id_curso);
        await createModulos(newCourse.id_curso);
        
        // Actualizar lista de cursos
        setCourses([...courses, newCourse]);
        setShowModal(false);
        
        // Resetear formulario
        setForm({
          nombre_curso: "",
          descripcion: "",
          costo: "",
          duracion: "",
          cupos: "",
          modalidad: "VIRTUAL",
          id_tipo_curso: "",
          horarios: [],
          modulos: [],
        });
        
        // 🆕 NOTIFICACIÓN DE ÉXITO
        showNotification(
          'success',
          '¡Curso Creado!',
          `El curso "${newCourse.nombre_curso}" ha sido creado exitosamente con todos sus componentes.`
        );
        
      } else {
        // 🆕 NOTIFICACIÓN DE ERROR
        showNotification(
          'error',
          'Error al Crear Curso',
          newCourse.message || 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'
        );
      }
    } catch (err) {
      console.error(err);
      // 🆕 NOTIFICACIÓN DE ERROR
      showNotification(
        'error',
        'Error de Conexión',
        'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.'
      );
    }
  };

  // 🔥 CREAR HORARIOS POR SEPARADO
  const createHorarios = async (cursoId) => {
    if (form.horarios.length === 0) return;
    
    try {
      for (const horario of form.horarios) {
        const horarioBody = {
          id_curso: cursoId,
          dia_semana: horario.dia_semana,
          hora_inicio: horario.hora_inicio,
          hora_fin: horario.hora_fin,
          fecha: horario.fecha || new Date().toISOString().split('T')[0],
          modalidad_sesion: form.modalidad,
          enlace_virtual: horario.enlace_virtual || "",
          aula: horario.aula || ""
        };

        await fetch("http://localhost:3000/api/horarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(horarioBody),
        });
      }
      console.log("✅ Horarios creados exitosamente");
    } catch (error) {
      console.error("❌ Error creando horarios:", error);
    }
  };

  // 🔥 CREAR MÓDULOS POR SEPARADO
  const createModulos = async (cursoId) => {
    if (form.modulos.length === 0) return;
    
    try {
      for (const modulo of form.modulos) {
        const moduloBody = {
          id_curso: cursoId,
          nombre_modulo: modulo.nombre_modulo,
          descripcion_modulo: modulo.descripcion_modulo,
          orden_modulo: modulo.orden_modulo
        };

        await fetch("http://localhost:3000/api/modulos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(moduloBody),
        });
      }
      console.log("✅ Módulos creados exitosamente");
    } catch (error) {
      console.error("❌ Error creando módulos:", error);
    }
  };

  // 🗑 Eliminar curso
  const handleDeleteCourse = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este curso?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/cursos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCourses(courses.filter((c) => c.id_curso !== id));
        // 🆕 NOTIFICACIÓN DE ÉXITO
        showNotification('success', 'Curso Eliminado', 'El curso ha sido eliminado exitosamente.');
      } else {
        // 🆕 NOTIFICACIÓN DE ERROR
        showNotification('error', 'Error al Eliminar', 'No se pudo eliminar el curso. Intenta nuevamente.');
      }
    } catch (err) {
      // 🆕 NOTIFICACIÓN DE ERROR
      showNotification('error', 'Error de Conexión', 'No se pudo conectar con el servidor.');
      console.error(err);
    }
  };

  // ➕ Horarios dinámicos
  const addHorario = () =>
    setForm({ 
      ...form, 
      horarios: [...form.horarios, { 
        dia_semana: "", 
        hora_inicio: "", 
        hora_fin: "",
        fecha: "",
        modalidad_sesion: form.modalidad,
        enlace_virtual: "",
        aula: ""
      }] 
    });
    
  const removeHorario = (i) =>
    setForm({ ...form, horarios: form.horarios.filter((_, idx) => idx !== i) });
    
  const updateHorario = (i, key, value) => {
    const updated = [...form.horarios];
    updated[i][key] = value;
    setForm({ ...form, horarios: updated });
  };

  // ➕ Módulos dinámicos
  const addModulo = () =>
    setForm({
      ...form,
      modulos: [
        ...form.modulos,
        { 
          nombre_modulo: "", 
          descripcion_modulo: "", 
          orden_modulo: form.modulos.length + 1
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

  // 🆕 Estilos para las notificaciones
  const getNotificationStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-xl shadow-2xl border-l-4 p-4 transform transition-all duration-300";
    
    const typeStyles = {
      success: `${baseStyles} border-green-500`,
      error: `${baseStyles} border-red-500`,
      warning: `${baseStyles} border-yellow-500`
    };
    
    return typeStyles[notification.type] || baseStyles;
  };

  const getNotificationIcon = () => {
    const iconClass = "w-6 h-6";
    
    switch (notification.type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-500`} />;
      default:
        return <CheckCircle className={`${iconClass} text-blue-500`} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 🆕 NOTIFICACIÓN BONITA */}
      {notification.show && (
        <div className={getNotificationStyles()}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {getNotificationIcon()}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {notification.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {notification.message}
              </p>
            </div>
            <button
              onClick={closeNotification}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Barra de progreso */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-5000 ${
                notification.type === 'success' ? 'bg-green-500' : 
                notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <h1
              onClick={() => onNavigate("teacher-dashboard")}
              className="text-xl font-semibold cursor-pointer hover:underline"
            >
              Panel Docente
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-all shadow-sm"
            >
              <PlusCircle className="w-5 h-5" /> Crear Curso
            </button>
            <button
              onClick={() => onNavigate("teacher-profile")}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-all shadow-sm"
            >
              <User className="w-5 h-5" /> Perfil
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-blue-700 mb-3">
          Bienvenido, {user?.nombre} {user?.apellido}
        </h2>
        <p className="text-gray-600 mb-8">
          Gestiona tus cursos y administra tu contenido académico.
        </p>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-6">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-600">Cargando cursos...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-600">No tienes cursos aún. ¡Crea uno!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id_curso}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all p-6 relative"
              >
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {course.nombre_curso}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{course.descripcion}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>
                    <strong>Modalidad:</strong> {course.modalidad}
                  </p>
                  <p>
                    <strong>Tipo:</strong>{" "}
                    {course.tipo_curso?.nombre_tipo_curso || "—"}
                  </p>
                  <p>
                    <strong>Costo:</strong> ${course.costo}
                  </p>
                  <p>
                    <strong>Cupos:</strong> {course.cupos}
                  </p>
                  <p>
                    <strong>Duración:</strong> {course.duracion} h
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteCourse(course.id_curso)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL - FORMULARIO COMPLETO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-8 relative animate-fadeInScale overflow-y-auto max-h-[95vh]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              onClick={() => setShowModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
              Crear Nuevo Curso
            </h2>
            
            <form onSubmit={handleCreateCourse} className="space-y-6">
              {/* INFORMACIÓN BÁSICA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo de Curso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Curso *
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                    value={form.id_tipo_curso}
                    onChange={(e) => setForm({ ...form, id_tipo_curso: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar tipo...</option>
                    {tipoCursos.map((t) => (
                      <option key={t.id_tipo_curso} value={t.id_tipo_curso}>
                        {t.nombre_tipo_curso}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Modalidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modalidad *
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                    value={form.modalidad}
                    onChange={(e) => setForm({ ...form, modalidad: e.target.value })}
                    required
                  >
                    <option value="VIRTUAL">Virtual</option>
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="HIBRIDO">Híbrido</option>
                  </select>
                </div>
              </div>

              {/* Nombre del Curso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Curso *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                  placeholder="Ej: HTML Y CSS"
                  value={form.nombre_curso}
                  onChange={(e) => setForm({ ...form, nombre_curso: e.target.value })}
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                  placeholder="Describe el contenido y objetivos del curso..."
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  required
                />
              </div>

              {/* DETALLES DEL CURSO */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                    placeholder="0.00"
                    value={form.costo}
                    onChange={(e) => setForm({ ...form, costo: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cupos *
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                    placeholder="50"
                    value={form.cupos}
                    onChange={(e) => setForm({ ...form, cupos: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración (h) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                    placeholder="60"
                    value={form.duracion}
                    onChange={(e) => setForm({ ...form, duracion: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* HORARIOS - SECCIÓN DINÁMICA */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Horarios del Curso (Opcional)
                  </label>
                  <button
                    type="button"
                    onClick={addHorario}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Agregar Horario
                  </button>
                </div>

                {form.horarios.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4 border border-dashed border-gray-300 rounded-lg">
                    No hay horarios agregados (puedes agregarlos después)
                  </p>
                ) : (
                  <div className="space-y-4">
                    {form.horarios.map((horario, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-gray-700">Horario #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeHorario(index)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Día de la semana</label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-200 outline-none"
                              placeholder="Ej: Lunes, Martes..."
                              value={horario.dia_semana}
                              onChange={(e) => updateHorario(index, 'dia_semana', e.target.value)}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Hora inicio</label>
                              <input
                                type="time"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-200 outline-none"
                                value={horario.hora_inicio}
                                onChange={(e) => updateHorario(index, 'hora_inicio', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Hora fin</label>
                              <input
                                type="time"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-200 outline-none"
                                value={horario.hora_fin}
                                onChange={(e) => updateHorario(index, 'hora_fin', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MÓDULOS - SECCIÓN DINÁMICA */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-medium text-gray-700 flex items-center gap-2">
                    <List className="w-5 h-5" />
                    Módulos del Curso (Opcional)
                  </label>
                  <button
                    type="button"
                    onClick={addModulo}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Agregar Módulo
                  </button>
                </div>

                {form.modulos.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4 border border-dashed border-gray-300 rounded-lg">
                    No hay módulos agregados (puedes agregarlos después)
                  </p>
                ) : (
                  <div className="space-y-4">
                    {form.modulos.map((modulo, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-gray-700">Módulo #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeModulo(index)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Nombre del módulo</label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-200 outline-none"
                              placeholder="Ej: Fundamentos de HTML"
                              value={modulo.nombre_modulo}
                              onChange={(e) => updateModulo(index, 'nombre_modulo', e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                            <textarea
                              rows="2"
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-200 outline-none"
                              placeholder="Describe el contenido de este módulo..."
                              value={modulo.descripcion_modulo}
                              onChange={(e) => updateModulo(index, 'descripcion_modulo', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BOTONES FINALES */}
              <div className="flex justify-end gap-3 pt-6 border-t">
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