import React, { useEffect, useState } from "react";
import { User, Book, Trash2, PlusCircle, GraduationCap } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

export default function AdminDashboard({ onNavigate }) {
  const { user } = useAuthContext();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        setError(data.message || "Error: La respuesta del servidor no es válida");
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

  const handleCreateCourse = async () => {
    const name = prompt("Nombre del nuevo curso:");
    if (!name || name.trim() === "") {
      alert("⚠️ El nombre del curso no puede estar vacío");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: name.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear el curso");
      }

      const newCourse = await res.json();
      
      if (newCourse && newCourse.id_curso) {
        setCourses([...courses, newCourse]);
        alert("✅ Curso añadido correctamente");
      } else {
        throw new Error("El servidor no devolvió un curso válido");
      }
    } catch (err) {
      alert("❌ Error creando curso: " + err.message);
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id, nombre) => {
    if (!confirm(`¿Estás seguro de eliminar el curso "${nombre}"?`)) return;

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

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-600 text-lg">No has iniciado sesión.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-800 text-white border-b border-blue-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-800" strokeWidth={1.5} />
            </div>
            <span
              className="text-xl font-semibold cursor-pointer"
              onClick={() => onNavigate("admin-dashboard")}
            >
              Panel del Administrador
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleCreateCourse}
              className="flex items-center gap-1 px-3 py-2 bg-white text-blue-800 rounded hover:bg-blue-100 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Añadir Curso
            </button>
            <button
              onClick={() => onNavigate("profile")}
              className="flex items-center gap-1 px-3 py-2 bg-white text-blue-800 rounded hover:bg-blue-100 transition-colors"
            >
              <User className="w-5 h-5" />
              Perfil
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-blue-800 mb-3">
            Bienvenido, {user.nombre} {user.apellido}
          </h1>
          <p className="text-lg text-gray-600">
            Administra todos los cursos registrados en el sistema.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold mb-1">Error al cargar cursos</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchCourses}
                className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-600 text-lg">Cargando cursos...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-600 text-lg">
                {error ? "No se pudieron cargar los cursos." : "No hay cursos aún. ¡Crea el primero!"}
              </p>
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id_curso}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <Book className="w-6 h-6 text-blue-800" />
                  <span className="font-medium text-gray-900">{course.nombre}</span>
                </div>
                <button
                  onClick={() => handleDeleteCourse(course.id_curso, course.nombre)}
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