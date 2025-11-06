import React, { useEffect, useState } from "react";
import { User, Book, Trash2, PlusCircle, GraduationCap, Edit } from "lucide-react";
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

  const handleCreateCourse = async () => {
    const nombre_curso = prompt("Nombre del nuevo curso:");
    if (!nombre_curso || nombre_curso.trim() === "") {
      alert("⚠️ El nombre del curso no puede estar vacío");
      return;
    }

    const descripcion = prompt("Descripción del curso (opcional):") || "";
    const duracion = prompt("Duración en horas (ejemplo: 40):") || "40";
    const modalidad = prompt("Modalidad (Virtual/Presencial):") || "Virtual";
    const costo = prompt("Costo del curso (ejemplo: 200):") || "0";
    const cupos = prompt("Cantidad de cupos (ejemplo: 30):") || "30";

    try {
      const res = await fetch("http://localhost:3000/api/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_curso: nombre_curso.trim(),
          descripcion: descripcion.trim(),
          duracion: parseInt(duracion),
          modalidad: modalidad.trim(),
          costo: parseFloat(costo),
          cupos: parseInt(cupos),
          id_docente: user.id_usuario, // Asignar el admin como docente temporal
          estado_disponibilidad: "ACTIVO"
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear el curso");
      }

      const newCourse = await res.json();
      
      if (newCourse && newCourse.id_curso) {
        // Recargar todos los cursos para mantener consistencia
        await fetchCourses();
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
              onClick={handleCreateCourse}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-800 rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-sm"
            >
              <PlusCircle className="w-5 h-5" />
              Añadir Curso
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
                onClick={handleCreateCourse}
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
    </div>
  );
}