import React, { useEffect, useState } from "react";
import { User, Book, Trash2, PlusCircle, GraduationCap } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

export default function TeacherDashboard({ onNavigate }) {
  const { user } = useAuthContext();
  const idUsuario = user?.id_usuario;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // 🔹 NUEVO: Para mostrar errores

  // 🔹 Cargar cursos del docente
  useEffect(() => {
    if (!idUsuario) return;

    setLoading(true);
    setError(null); // 🔹 Limpiar errores previos
    
    fetch(`http://localhost:3000/api/cursos?docente=${idUsuario}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📚 Cursos del docente:", data);
        
        // 🔹 VALIDACIÓN CRÍTICA: Verificar que sea un array
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          // Si el backend retorna un error, mostrarlo
          console.error("❌ La respuesta no es un array:", data);
          setError(data.message || "Error al cargar cursos");
          setCourses([]);
        }
      })
      .catch((err) => {
        console.error("❌ Error al cargar cursos:", err);
        setError("No se pudo conectar con el servidor");
        setCourses([]);
      })
      .finally(() => setLoading(false));
  }, [idUsuario]);

  const handleCreateCourse = async () => {
    const name = prompt("Nombre del nuevo curso:");
    if (!name) return;

    try {
      const res = await fetch("http://localhost:3000/api/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: name, id_docente: idUsuario }),
      });
      const newCourse = await res.json();
      
      // 🔹 VALIDACIÓN: Verificar que se creó correctamente
      if (res.ok && newCourse.id_curso) {
        setCourses([...courses, newCourse]);
      } else {
        alert("Error creando curso: " + (newCourse.message || "Error desconocido"));
      }
    } catch (err) {
      alert("Error creando curso");
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este curso?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/cursos/${id}`, {
        method: "DELETE",
      });
      
      // 🔹 VALIDACIÓN: Verificar que se eliminó correctamente
      if (res.ok) {
        setCourses(courses.filter((c) => c.id_curso !== id));
      } else {
        alert("Error eliminando curso");
      }
    } catch (err) {
      alert("Error eliminando curso");
      console.error(err);
    }
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
      {/* HEADER */}
      <header className="bg-blue-600 text-white border-b border-blue-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
            </div>
            <span
              className="text-xl font-semibold cursor-pointer"
              onClick={() => onNavigate("teacher-dashboard")}
            >
              Panel Docente
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleCreateCourse}
              className="flex items-center gap-1 px-3 py-2 bg-white text-blue-600 rounded hover:bg-blue-100 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Crear Curso
            </button>
            <button
              onClick={() => onNavigate("teacher-profile")}
              className="flex items-center gap-1 px-3 py-2 bg-white text-blue-600 rounded hover:bg-blue-100 transition-colors"
            >
              <User className="w-5 h-5" />
              Perfil
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-blue-600 mb-3">
            Bienvenido, {user.nombre} {user.apellido}
          </h1>
          <p className="text-lg text-gray-600">
            Gestiona tus cursos y revisa tu progreso académico
          </p>
        </div>

        {/* 🔹 MOSTRAR ERROR SI EXISTE */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            ⚠️ {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {loading ? (
            <p className="text-gray-600">Cargando cursos...</p>
          ) : courses.length === 0 ? (
            <p className="text-gray-600">
              {error ? "No se pudieron cargar los cursos." : "No tienes cursos aún. ¡Crea uno!"}
            </p>
          ) : (
            courses.map((course) => (
              <div
                key={course.id_curso}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <Book className="w-6 h-6 text-blue-600" />
                  <span className="font-medium text-gray-900">{course.nombre}</span>
                </div>
                <button
                  onClick={() => handleDeleteCourse(course.id_curso)}
                  className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}