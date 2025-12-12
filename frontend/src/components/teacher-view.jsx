import React, { useEffect, useState } from "react";
import { 
  User, BookOpen, Trash2, PlusCircle, GraduationCap, X, Clock, List, CheckCircle, XCircle, AlertTriangle,
  Calendar, Users,
  DollarSign,
  Clock4,
  Eye,
  Edit3,
  Search,
  Filter,
  Shield,
  FileText,
  LogOut
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

export default function TeacherDashboard({ onNavigate }) {
  const { user, logout } = useAuthContext();
  const idUsuario = user?.id_usuario;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tipoCursos, setTipoCursos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [enrollmentsData, setEnrollmentsData] = useState({});
  const [totalEnrollments, setTotalEnrollments] = useState(0);

  // Nuevos estados para permisos
  const [userPermissions, setUserPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);

// Abrir modal de edición
// Abrir modal de edición
const openEditModal = (course) => {
  // Verificar permisos antes de abrir el modal de edición
  if (!canEditCourse()) {
    showNotification(
      'error',
      'Permiso Denegado',
      'No tienes permisos para editar cursos. Contacta al administrador.'
    );
    return;
  }

  setEditingCourse(course);
  setForm({
    nombre_curso: course.nombre_curso,
    descripcion: course.descripcion,
    costo: course.costo,
    duracion: course.duracion,
    cupos: course.cupos,
    modalidad: course.modalidad,
    estado_disponibilidad: course.estado_disponibilidad,
    id_docente: course.id_docente,
    id_tipo_curso: course.id_tipo_curso,
    horarios: [],
    modulos: []
  });
  setShowModal(true);
};

// Guardar edición
const handleUpdateCourse = async (e) => {
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
      estado_disponibilidad: form.estado_disponibilidad || "ACTIVO",
      id_tipo_curso: Number(form.id_tipo_curso),
    };

    console.log('Actualizando curso con datos:', body);
    console.log('ID del curso:', editingCourse.id_curso);
    console.log(form.modalidad);

    const res = await fetch(`http://localhost:3000/api/cursos/${editingCourse.id_curso}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log('Respuesta del servidor:', data);

    if (!res.ok) {
      throw new Error(data.message || "Error actualizando curso");
    }

    await loadCourses();
    setShowModal(false);
    setEditingCourse(null);
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
    
    showNotification(
      'success',
      '¡Curso Actualizado!',
      'El curso ha sido actualizado exitosamente.'
    );
  } catch (err) {
    console.error('Error completo:', err);
    showNotification(
      'error',
      'Error al Actualizar',
      err.message || 'Ocurrió un error al actualizar el curso. Intenta nuevamente.'
    );
  }
};

  // Estado para notificaciones
  const [notification, setNotification] = useState({
    show: false,
    type: '',
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

  // Función para cerrar sesión
  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      try {
        // Primero llamar a logout del contexto
        logout();
        
        // Luego navegar a la pantalla de selección de roles
        setTimeout(() => {
          onNavigate('role-selection');
        }, 100);
        
      } catch (error) {
        console.error('Error durante logout:', error);
        // Si hay error, forzar navegación
        onNavigate('role-selection');
      }
    }
  };

  // Cargar permisos del usuario
  const loadUserPermissions = async () => {
    if (!idUsuario) return;
    
    try {
      setPermissionsLoading(true);
      
      // Obtener el usuario con sus roles
      const resUsuario = await fetch(`http://localhost:3000/api/usuarios/${idUsuario}`);
      if (!resUsuario.ok) throw new Error("Error al cargar usuario");
      
      const dataUsuario = await resUsuario.json();
      
      // Acceder correctamente a los datos del usuario
      const usuarioActual = dataUsuario.data || dataUsuario;
      
      // Obtener el rol del usuario
      const rolUsuario = usuarioActual.detalleRoles?.[0]?.rol;
      
      if (rolUsuario && rolUsuario.id_rol) {
        // Cargar permisos del rol usando el endpoint proporcionado
        const resPermisos = await fetch(`http://localhost:3000/api/roles/${rolUsuario.id_rol}/permisos`);
        if (!resPermisos.ok) throw new Error("Error al cargar permisos del rol");
        
        const dataPermisos = await resPermisos.json();
        
        // Acceder correctamente a los permisos
        const permisosDelRol = dataPermisos.data || dataPermisos;
        
        if (Array.isArray(permisosDelRol)) {
          // Extraer los nombres de los permisos correctamente
          const nombresPermisos = permisosDelRol.map(p => p.nombre_permiso || p.nombre);
          setUserPermissions(nombresPermisos);
        } else {
          setUserPermissions([]);
        }
      } else {
        setUserPermissions([]);
      }
    } catch (err) {
      console.error("Error cargando permisos del usuario:", err);
      setUserPermissions([]);
    } finally {
      setPermissionsLoading(false);
    }
  };

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permissionName) => {
    return userPermissions.includes(permissionName);
  };

  // Verificar permisos específicos para cada acción
  const canCreateCourse = () => {
    return hasPermission('crear_curso');
  };

  const canEditCourse = () => {
    return hasPermission('editar_curso');
  };

  const canEnrollInCourse = () => {
    return hasPermission('inscribir_curso');
  };

  const canViewAcademicReports = () => {
    return hasPermission('ver_reportes_academicos');
  };

  // Mostrar notificación
  const showNotification = (type, title, message) => {
    setNotification({
      show: true,
      type,
      title,
      message
    });
    setTimeout(() => {
      setNotification({
        show: false,
        type: '',
        message: '',
        title: ''
      });
    }, 5000);
  };

  // Cerrar notificación manualmente
  const closeNotification = () => {
    setNotification({
      show: false,
      type: '',
      message: '',
      title: ''
    });
  };

  // Cargar datos de inscripciones
  const loadEnrollmentsData = async (coursesList) => {
    try {
      const response = await fetch("http://localhost:3000/api/inscripciones");
      const allEnrollments = await response.json();
      
      if (Array.isArray(allEnrollments)) {
        // Filtrar solo las inscripciones de los cursos del docente
        const teacherCourseIds = coursesList.map(course => course.id_curso);
        const teacherEnrollments = allEnrollments.filter(enrollment => 
          teacherCourseIds.includes(enrollment.id_curso)
        );

        // Calcular inscritos por curso
        const enrollmentsByCourse = {};
        let total = 0;
        
        teacherEnrollments.forEach(enrollment => {
          if (!enrollmentsByCourse[enrollment.id_curso]) {
            enrollmentsByCourse[enrollment.id_curso] = {
              enrolled: 0
            };
          }
          enrollmentsByCourse[enrollment.id_curso].enrolled += 1;
          total += 1;
        });
        
        setEnrollmentsData(enrollmentsByCourse);
        setTotalEnrollments(total);
      }
    } catch (error) {
      console.error("Error cargando inscripciones:", error);
    }
  };

  // Cargar cursos del docente
  const loadCourses = async () => {
    if (!idUsuario) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/cursos?docente=${idUsuario}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCourses(data);
        // Cargar datos de inscripciones después de tener los cursos
        await loadEnrollmentsData(data);
      } else {
        setError(data.message || "Error al cargar cursos");
      }
    } catch (error) {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Cargar tipos de curso
  useEffect(() => {
    fetch("http://localhost:3000/api/tipos-curso")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Reemplazar "más alto" por "taller" en los nombres de tipo de curso
          const updatedTipos = data.map(tipo => ({
            ...tipo,
            nombre_tipo_curso: tipo.nombre_tipo_curso.replace(/más alto/gi, 'taller')
          }));
          setTipoCursos(updatedTipos);
        } else {
          console.error("Error al obtener tipos de curso", data);
        }
      })
      .catch((err) => console.error("Error al conectar con tipos de curso:", err));
  }, []);

  useEffect(() => {
    if (idUsuario) {
      loadCourses();
      loadUserPermissions();
    }
  }, [idUsuario]);

  // Filtrar cursos
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.nombre_curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "ALL" || course.estado_disponibilidad === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Calcular estadísticas
  const stats = {
    total: courses.length,
    active: courses.filter(c => c.estado_disponibilidad === 'ACTIVO').length,
    totalEnrollments: totalEnrollments
  };

  // Crear curso
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    
    // Verificar permisos antes de crear el curso
    if (!canCreateCourse()) {
      showNotification(
        'error',
        'Permiso Denegado',
        'No tienes permisos para crear cursos. Contacta al administrador.'
      );
      return;
    }

    try {
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

      const res = await fetch("http://localhost:3000/api/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const newCourse = await res.json();

      if (res.ok && newCourse.id_curso) {
        await createHorarios(newCourse.id_curso);
        await createModulos(newCourse.id_curso);

        // Recargar cursos e inscripciones
        await loadCourses();
        setShowModal(false);
        
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

        showNotification(
          'success',
          '¡Curso Creado!',
          `El curso "${newCourse.nombre_curso}" ha sido creado exitosamente con todos sus componentes.`
        );
      } else {
        showNotification(
          'error',
          'Error al Crear Curso',
          newCourse.message || 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'
        );
      }
    } catch (err) {
      console.error(err);
      showNotification(
        'error',
        'Error de Conexión',
        'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.'
      );
    }
  };

  // Crear horarios
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
    } catch (error) {
      console.error("Error creando horarios:", error);
    }
  };

  // Crear módulos
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
    } catch (error) {
      console.error("Error creando módulos:", error);
    }
  };

  // Eliminar curso
  const handleDeleteCourse = async (id) => {
    // Verificar permisos antes de eliminar
    if (!canEditCourse()) {
      showNotification(
        'error',
        'Permiso Denegado',
        'No tienes permisos para eliminar cursos.'
      );
      return;
    }

    if (!confirm("¿Estás seguro de eliminar este curso?")) return;
    
    try {
      const res = await fetch(`http://localhost:3000/api/cursos/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        // Recargar cursos e inscripciones después de eliminar
        await loadCourses();
        showNotification('success', 'Curso Eliminado', 'El curso ha sido eliminado exitosamente.');
      } else {
        showNotification('error', 'Error al Eliminar', 'No se pudo eliminar el curso. Intenta nuevamente.');
      }
    } catch (err) {
      showNotification('error', 'Error de Conexión', 'No se pudo conectar con el servidor.');
      console.error(err);
    }
  };

  // Funciones para horarios dinámicos
  const addHorario = () =>
    setForm({
      ...form,
      horarios: [
        ...form.horarios,
        {
          dia_semana: "",
          hora_inicio: "",
          hora_fin: "",
          fecha: "",
          modalidad_sesion: form.modalidad,
          enlace_virtual: "",
          aula: ""
        }
      ]
    });

  const removeHorario = (i) =>
    setForm({
      ...form,
      horarios: form.horarios.filter((_, idx) => idx !== i)
    });

  const updateHorario = (i, key, value) => {
    const updated = [...form.horarios];
    updated[i][key] = value;
    setForm({ ...form, horarios: updated });
  };

  // Funciones para módulos dinámicos
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
    setForm({
      ...form,
      modulos: form.modulos.filter((_, idx) => idx !== i)
    });

  const updateModulo = (i, key, value) => {
    const updated = [...form.modulos];
    updated[i][key] = value;
    setForm({ ...form, modulos: updated });
  };

  // Estilos para notificaciones
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

  // Componente para el botón de crear curso con verificación de permisos
  const CreateCourseButton = () => {
    if (permissionsLoading) {
      return (
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
        >
          <PlusCircle className="w-4 h-4" />
          Cargando permisos...
        </button>
      );
    }

    if (!canCreateCourse()) {
      return (
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
          title="No tienes permisos para crear cursos"
        >
          <Shield className="w-4 h-4" />
          Sin Permisos
        </button>
      );
    }

    return (
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
      >
        <PlusCircle className="w-4 h-4" />
        Nuevo Curso
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* BOTÓN CERRAR SESIÓN EN ESQUINA SUPERIOR DERECHA */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Cerrar sesión"
      >
        <LogOut className="w-5 h-5" />
      </button>

      {/* NOTIFICACIÓN */}
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
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all duration-5000 ${
                notification.type === 'success' ? 'bg-green-500' :
                notification.type === 'error' ? 'bg-red-500' :
                'bg-blue-500'
              }`}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      )}

      {/* HEADER PROFESIONAL */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 
                  onClick={() => onNavigate("teacher-dashboard")}
                  className="text-lg font-bold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  Panel Docente
                </h1>
                <p className="text-xs text-slate-600">Gestión académica integral</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreateCourseButton />
              {canViewAcademicReports() && (
                <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-all duration-200 shadow-sm">
                  <FileText className="w-4 h-4" />
                  Reportes
                </button>
              )}
              <button
                onClick={() => onNavigate("teacher-profile")}
                className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-sm"
              >
                <User className="w-4 h-4" />
                Perfil
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ENCABEZADO */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Bienvenido, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.nombre} {user?.apellido}</span>
          </h2>
          <p className="text-slate-600 max-w-2xl">
            Gestiona tus cursos, organiza el contenido académico y mantén actualizada tu oferta educativa.
          </p>
          
          {!permissionsLoading && userPermissions.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Tus Permisos:</h3>
              <div className="flex flex-wrap gap-2">
                {userPermissions.map((permiso, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium border border-blue-300"
                  >
                    {permiso.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Cursos</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Cursos Activos</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Inscripciones</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.totalEnrollments}</p>
                <p className="text-xs text-slate-500 mt-1">En todos los cursos</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* BARRA DE HERRAMIENTAS */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex-1 w-full">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select 
                className="bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="ALL">Todos los estados</option>
                <option value="ACTIVO">Activos</option>
                <option value="INACTIVO">Inactivos</option>
              </select>
              
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* MENSAJES DE ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* GRID DE CURSOS */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white/50 rounded-2xl border border-slate-200 shadow-sm">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No se encontraron cursos</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedStatus !== "ALL" 
                ? "No hay cursos que coincidan con los filtros aplicados." 
                : "Comienza creando tu primer curso educativo."}
            </p>
            {canCreateCourse() && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <PlusCircle className="w-5 h-5" />
                Crear Primer Curso
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const courseEnrollments = enrollmentsData[course.id_curso] || { enrolled: 0 };
              const courseTypeName = course.tipo_curso?.nombre_tipo_curso?.replace(/más alto/gi, 'taller') || "Sin categoría";
              
              return (
                <div
                  key={course.id_curso}
                  className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl hover:border-slate-300 transition-all duration-500 group overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="max-w-[70%]">
                          <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {course.nombre_curso}
                          </h3>
                          <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium mt-2 ${
                            course.estado_disponibilidad === 'ACTIVO' 
                              ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30' 
                              : 'bg-slate-500/20 text-slate-700 border border-slate-500/30'
                          }`}>
                            {course.estado_disponibilidad}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
  onClick={() => openEditModal(course)}
  className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
  title="Editar curso"
>
  <Edit3 className="w-4 h-4" />
</button>
                        <button
                          onClick={() => handleDeleteCourse(course.id_curso)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          disabled={!canEditCourse()}
                          title={!canEditCourse() ? "No tienes permisos para eliminar cursos" : "Eliminar curso"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {course.descripcion}
                    </p>

                    <div className="space-y-3 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Modalidad
                        </span>
                        <span className="text-slate-900 font-medium">{course.modalidad}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Cupos
                        </span>
                        <span className="text-slate-900 font-medium">{course.cupos} disponibles</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Inversión
                        </span>
                        <span className="text-green-600 font-bold">${course.costo}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 flex items-center gap-2">
                          <Clock4 className="w-4 h-4" />
                          Duración
                        </span>
                        <span className="text-slate-900 font-medium">{course.duracion} horas</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Inscritos
                        </span>
                        <span className="text-blue-600 font-bold">{courseEnrollments.enrolled}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-slate-100/50 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600">
                        {courseTypeName}
                      </span>
                      <button onClick={() => onNavigate('teacher-evaluations',{ courseId: course.id_curso })} className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center gap-1">
                        Gestionar <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL - FORMULARIO COMPLETO (VERSIÓN ORIGINAL - SIN MODIFICACIONES) */}
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
                <button
  onClick={editingCourse ? handleUpdateCourse : handleCreateCourse}
  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
>
  {editingCourse ? "Actualizar Curso" : "Crear Curso"}
</button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}