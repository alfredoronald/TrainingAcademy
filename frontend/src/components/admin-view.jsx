import React, { useEffect, useState } from "react";
import { User, Book, Trash2, PlusCircle, GraduationCap, Edit, X } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

export default function AdminDashboard({ onNavigate }) {
  const { user } = useAuthContext();

  const [courses, setCourses] = useState([]);
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
        id_tipo_curso: 1, // Valor por defecto para Curso
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
        // Resetear formulario
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

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3">
            Bienvenido, {user.nombre} {user.apellido}
          </h1>
          <p className="text-lg text-gray-600">
            Administra todos los cursos registrados en el sistema.
          </p>
        </div>

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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Cargando cursos...</p>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
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
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-blue-800 text-lg">{courses.length}</span> curso{courses.length !== 1 ? 's' : ''} registrado{courses.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id_curso}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
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
                        <span className="font-medium">Costo:</span>
                        <span className="text-green-600 font-semibold">
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
                  </div>

                  {course.docente && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
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
              ))}
            </div>
          </>
        )}
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