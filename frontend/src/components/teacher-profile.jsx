import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  User,
  Mail,
  Book,
  BarChart3
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

export default function TeacherProfile({ onNavigate }) {
  const { user } = useAuthContext();
  const idUsuario = user?.id_usuario;

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // 🔹 Cargar cursos del docente
  useEffect(() => {
    if (!idUsuario) return;

    setLoadingCourses(true);
    fetch(`http://localhost:3000/api/cursos`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data || []);
      })
      .catch((err) => {
        console.error("Error cargando cursos del docente:", err);
        setCourses([]);
      })
      .finally(() => setLoadingCourses(false));
  }, [idUsuario]);

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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <span
              className="text-xl font-semibold text-gray-900 cursor-pointer"
              onClick={() => onNavigate("teacher-dashboard")}
            >
              Panel Docente
            </span>
          </div>

          <button
            onClick={() => onNavigate("teacher-dashboard")}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-blue-600 mb-3">
            Perfil de {user.nombre} {user.apellido}
          </h1>
          <p className="text-lg text-gray-600">
            Gestiona tu información y revisa los cursos que has creado
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-8">
                <User className="w-6 h-6 text-gray-900" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Información Personal
                </h2>
              </div>

              <div className="flex items-start gap-6 mb-8">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-bold text-white">
                    {user.nombre?.[0] || "U"}
                    {user.apellido?.[0] || "D"}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {user.nombre} {user.apellido}
                    </h3>
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Docente
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{user.correo_electronico}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-sm text-gray-600 mb-2">Cursos creados</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {courses.length}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <p className="text-sm text-gray-600 mb-2">Nombre</p>
                  <p className="text-2xl font-bold text-green-600">
                    {user.nombre}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Book className="w-6 h-6 text-gray-900" />
                <h2 className="text-xl font-semibold text-gray-900">Mis Cursos</h2>
              </div>

              {loadingCourses ? (
                <p className="text-gray-600">Cargando cursos...</p>
              ) : courses.length === 0 ? (
                <p className="text-gray-600">No has creado cursos aún.</p>
              ) : (
                <ul className="space-y-2">
                  {courses.map((course) => (
                    <li
                      key={course.id_curso}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <span>{course.nombre}</span>
                      <button
                        onClick={() => alert("Eliminar curso: " + course.nombre)}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
