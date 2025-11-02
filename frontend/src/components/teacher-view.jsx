import React, { useEffect, useState } from "react";
import { User, BookOpen, Trash2, PlusCircle, GraduationCap, X } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

export default function TeacherDashboard({ onNavigate }) {
  const { user } = useAuthContext();
  const idUsuario = user?.id_usuario;

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

  // 🟢 Crear curso (solo campos básicos)
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
  id_docente: idUsuario,
  estado_disponibilidad: 'ACTIVO',
  id_tipo_curso: form.id_tipo_curso, // 🚨 agrega esto
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

        // 🔹 Aquí podrías enviar horarios y módulos después
        // await Promise.all(form.horarios.map(h => fetch(`/api/cursos/${newCourse.id_curso}/horarios`, ...)));
        // await Promise.all(form.modulos.map(m => fetch(`/api/cursos/${newCourse.id_curso}/modulos`, ...)));
      } else {
        alert("Error creando curso: " + (newCourse.message || "Error desconocido"));
      }
    } catch (err) {
      alert("Error creando curso");
      console.error(err);
    }
  };

  // 🗑 Eliminar curso
  const handleDeleteCourse = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este curso?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/cursos/${id}`, { method: "DELETE" });
      if (res.ok) setCourses(courses.filter((c) => c.id_curso !== id));
      else alert("Error eliminando curso");
    } catch (err) {
      alert("Error eliminando curso");
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* HEADER */}
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <h1 onClick={() => onNavigate("teacher-dashboard")} className="text-xl font-semibold cursor-pointer hover:underline">
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

        {error && <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-6">⚠️ {error}</div>}

        {loading ? (
          <p className="text-gray-600">Cargando cursos...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-600">No tienes cursos aún. ¡Crea uno!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id_curso} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all p-6 relative">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{course.nombre_curso}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{course.descripcion}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p><strong>Modalidad:</strong> {course.modalidad}</p>
                  <p><strong>Costo:</strong> ${course.costo}</p>
                  <p><strong>Cupos:</strong> {course.cupos}</p>
                  <p><strong>Duración:</strong> {course.duracion} h</p>
                </div>
                <button onClick={() => handleDeleteCourse(course.id_curso)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL */}
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
                <input type="text" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none" value={form.nombre_curso} onChange={(e) => setForm({ ...form, nombre_curso: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Costo ($)</label>
                  <input type="number" step="0.01" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none" value={form.costo} onChange={(e) => setForm({ ...form, costo: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cupos</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none" value={form.cupos} onChange={(e) => setForm({ ...form, cupos: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duración (h)</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none" value={form.duracion} onChange={(e) => setForm({ ...form, duracion: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                  <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 outline-none" value={form.modalidad} onChange={(e) => setForm({ ...form, modalidad: e.target.value })}>
                    <option value="VIRTUAL">VIRTUAL</option>
                    <option value="PRESENCIAL">PRESENCIAL</option>
                    <option value="HIBRIDO">HIBRIDO</option>
                  </select>
                </div>
              </div>

              {/* Horarios y módulos son solo visuales por ahora */}
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Horarios</h3>
                  {form.horarios.map((h, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                      <input type="text" placeholder="Día" value={h.dia_semana} onChange={(e) => updateHorario(i, "dia_semana", e.target.value)} className="border rounded px-2 py-1" />
                      <input type="time" placeholder="Inicio" value={h.hora_inicio} onChange={(e) => updateHorario(i, "hora_inicio", e.target.value)} className="border rounded px-2 py-1" />
                      <input type="time" placeholder="Fin" value={h.hora_fin} onChange={(e) => updateHorario(i, "hora_fin", e.target.value)} className="border rounded px-2 py-1" />
                      <button type="button" onClick={() => removeHorario(i)} className="text-red-500 font-bold">X</button>
                    </div>
                  ))}
                  <button type="button" onClick={addHorario} className="text-blue-600 mb-4">+ Agregar Horario</button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Módulos</h3>
                  {form.modulos.map((m, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                      <input type="text" placeholder="Nombre" value={m.nombre_modulo} onChange={(e) => updateModulo(i, "nombre_modulo", e.target.value)} className="border rounded px-2 py-1" />
                      <input type="text" placeholder="Descripción" value={m.descripcion_modulo} onChange={(e) => updateModulo(i, "descripcion_modulo", e.target.value)} className="border rounded px-2 py-1" />
                      <button type="button" onClick={() => removeModulo(i)} className="text-red-500 font-bold">X</button>
                    </div>
                  ))}
                  <button type="button" onClick={addModulo} className="text-blue-600 mb-4">+ Agregar Módulo</button>
                </div>
              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Crear Curso</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
