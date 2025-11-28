import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck, Loader2, Key, Users, Edit, UserCheck } from "lucide-react";

export default function RolesPanel({ onNavigate }) {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [permisosPorRol, setPermisosPorRol] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("roles");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [filtroRol, setFiltroRol] = useState("todos");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resUsuarios, resRoles, resPermisos] = await Promise.all([
        fetch("http://localhost:3000/api/usuarios"),
        fetch("http://localhost:3000/api/roles"),
        fetch("http://localhost:3000/api/permisos")
      ]);

      if (!resUsuarios.ok) throw new Error("Error cargando usuarios");
      if (!resRoles.ok) throw new Error("Error cargando roles");
      if (!resPermisos.ok) throw new Error("Error cargando permisos");

      const dataUsuarios = await resUsuarios.json();
      const dataRoles = await resRoles.json();
      const dataPermisos = await resPermisos.json();

      setUsuarios(dataUsuarios.data || dataUsuarios);
      setRoles(dataRoles.data || dataRoles);
      setPermisos(dataPermisos.data || dataPermisos);

      await cargarPermisosPorRol(dataRoles.data || dataRoles);
    } catch (err) {
      console.error("Error cargando datos", err);
    } finally {
      setLoading(false);
    }
  };

  const cargarPermisosPorRol = async (rolesData) => {
    const permisosMap = {};
    
    for (const rol of rolesData) {
      try {
        const res = await fetch(`http://localhost:3000/api/roles/${rol.id_rol}/permisos`);
        const data = await res.json();
        
        // CORRECCIÓN: Usar data.data si existe, sino data directamente
        const permisosDelRol = data.data || data;
        permisosMap[rol.id_rol] = permisosDelRol.map(p => p.id_permiso);
        
        console.log(`Rol ${rol.nombre_rol}:`, permisosDelRol); // Para debug
      } catch (err) {
        console.error(`Error cargando permisos para rol ${rol.id_rol}`, err);
        permisosMap[rol.id_rol] = [];
      }
    }
    
    setPermisosPorRol(permisosMap);
    console.log("Permisos por rol cargados:", permisosMap); // Para debug
  };

  // Filtrar y ordenar usuarios
  const usuariosFiltradosYOrdenados = usuarios
    .filter(usuario => {
      if (filtroRol === "todos") return true;
      
      const rolUsuario = usuario.detalleRoles?.[0]?.rol?.nombre_rol || "";
      
      switch (filtroRol) {
        case "estudiantes":
          return rolUsuario.toLowerCase().includes("estudiante");
        case "docentes":
          return rolUsuario.toLowerCase().includes("docente") || 
                 rolUsuario.toLowerCase().includes("profesor");
        case "administradores":
          return rolUsuario.toLowerCase().includes("admin");
        default:
          return true;
      }
    })
    .sort((a, b) => {
      const nombreA = `${a.nombre} ${a.apellido}`.toLowerCase();
      const nombreB = `${b.nombre} ${b.apellido}`.toLowerCase();
      return nombreA.localeCompare(nombreB);
    });

  const asignarRol = async (id_usuario, id_rol) => {
    if (!id_rol) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/usuarios/${id_usuario}/rol`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_rol }),
        }
      );

      if (!res.ok) throw new Error("Error al asignar rol");

      alert("Rol asignado correctamente");
      cargarDatos();
    } catch (err) {
      console.error("Error asignando rol", err);
      alert("Error al asignar rol");
    }
  };

  const togglePermiso = async (id_rol, id_permiso, estaAsignado) => {
    try {
      const method = estaAsignado ? "DELETE" : "POST";
      const url = `http://localhost:3000/api/roles/${id_rol}/permisos/${id_permiso}`;

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Error al modificar permiso");

      // Actualizar estado local
      setPermisosPorRol(prev => {
        const nuevosPermisos = { ...prev };
        if (estaAsignado) {
          nuevosPermisos[id_rol] = nuevosPermisos[id_rol]?.filter(p => p !== id_permiso) || [];
        } else {
          nuevosPermisos[id_rol] = [...(nuevosPermisos[id_rol] || []), id_permiso];
        }
        return nuevosPermisos;
      });

      alert(`Permiso ${estaAsignado ? 'removido' : 'asignado'} correctamente`);
    } catch (err) {
      console.error("Error modificando permiso", err);
      alert("Error al modificar permiso");
    }
  };

  const manejarClickUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    const rolUsuario = usuario.detalleRoles?.[0]?.rol;
    if (rolUsuario) {
      setRolSeleccionado(rolUsuario);
    }
    setActiveTab("permisos");
  };

  const manejarClickRol = (rol) => {
    setUsuarioSeleccionado(null);
    setRolSeleccionado(rol);
    setActiveTab("permisos");
  };

  const volverAGestionRoles = () => {
    setUsuarioSeleccionado(null);
    setRolSeleccionado(null);
    setActiveTab("roles");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 🔙 Volver */}
      <button
        onClick={() => onNavigate("admin-dashboard")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al Dashboard
      </button>

      {/* 🟪 Encabezado */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 bg-purple-100 rounded-xl">
          <ShieldCheck className="w-10 h-10 text-purple-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Roles y Permisos</h2>
          <p className="text-gray-600 text-sm">
            Asigna roles a usuarios y gestiona permisos del sistema.
          </p>
        </div>
      </div>

      {/* 🎯 Tabs de Navegación */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
            activeTab === "roles"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={volverAGestionRoles}
        >
          <Users className="w-4 h-4" />
          Gestión de Roles
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
            activeTab === "permisos"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("permisos")}
        >
          <Key className="w-4 h-4" />
          Gestión de Permisos
        </button>
      </div>

      {/* Filtro por tipo de usuario */}
      {activeTab === "roles" && (
        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filtrar por:</label>
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm shadow-sm hover:border-purple-400 transition cursor-pointer"
          >
            <option value="todos">Todos los usuarios</option>
            <option value="estudiantes">Estudiantes</option>
            <option value="docentes">Docentes</option>
            <option value="administradores">Administradores</option>
          </select>
          <span className="text-sm text-gray-500">
            {usuariosFiltradosYOrdenados.length} usuarios encontrados
          </span>
        </div>
      )}

      {/* Información del usuario/rol seleccionado */}
      {activeTab === "permisos" && (usuarioSeleccionado || rolSeleccionado) && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                {usuarioSeleccionado ? (
                  <UserCheck className="w-5 h-5 text-blue-600" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">
                  {usuarioSeleccionado ? "Permisos del usuario:" : "Permisos del rol:"}{" "}
                  <span className="text-purple-600">
                    {usuarioSeleccionado ? `${usuarioSeleccionado.nombre} ${usuarioSeleccionado.apellido}` : rolSeleccionado.nombre_rol}
                  </span>
                </h3>
                <p className="text-sm text-blue-600">
                  {usuarioSeleccionado ? (
                    <>Correo: {usuarioSeleccionado.correo_electronico} • Rol: {usuarioSeleccionado.detalleRoles?.[0]?.rol?.nombre_rol || "Sin rol"}</>
                  ) : (
                    rolSeleccionado.descripcion || "Sin descripción"
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={volverAGestionRoles}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-white border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a usuarios
            </button>
          </div>
        </div>
      )}

      {/* 🟦 Contenido de Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : activeTab === "roles" ? (
          /* 📋 Tabla de Gestión de Roles */
          <div className="overflow-x-auto">
            <table className="w-full rounded-lg overflow-hidden">
              <thead className="bg-purple-600 text-white text-left">
                <tr>
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Correo</th>
                  <th className="py-3 px-4">Rol Actual</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuariosFiltradosYOrdenados.map((u, index) => {
                  const rolActualID = u.detalleRoles?.[0]?.id_rol || "";
                  const rolActual = u.detalleRoles?.[0]?.rol;
                  const rolActualNombre = rolActual?.nombre_rol || "Sin rol";
                  
                  // CORRECCIÓN: Obtener permisos del rol correctamente
                  const permisosDelRol = rolActual ? permisosPorRol[rolActual.id_rol] || [] : [];
                  const cantidadPermisos = permisosDelRol.length;

                  return (
                    <tr
                      key={u.id_usuario}
                      className={`border-b ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <button
                          onClick={() => manejarClickUsuario(u)}
                          className="flex items-center gap-2 font-medium text-gray-900 hover:text-purple-700 hover:bg-purple-50 px-3 py-1 rounded-lg transition group"
                          title={`Editar permisos del rol de ${u.nombre}`}
                        >
                          <UserCheck className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {u.nombre} {u.apellido}
                        </button>
                      </td>
                      <td className="py-3 px-4">{u.correo_electronico}</td>

                      <td className="py-3 px-4">
                        {rolActual ? (
                          <button
                            onClick={() => manejarClickRol(rolActual)}
                            className="flex items-center gap-2 font-semibold text-purple-700 hover:text-purple-900 hover:bg-purple-50 px-3 py-1 rounded-lg transition group"
                            title={`Editar permisos del rol ${rolActualNombre}`}
                          >
                            <Edit className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {rolActualNombre}
                            <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
                              {cantidadPermisos} permisos
                            </span>
                          </button>
                        ) : (
                          <span className="font-semibold text-gray-500">Sin rol</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <select
                          className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm shadow-sm hover:border-purple-400 transition cursor-pointer"
                          value={rolActualID}
                          onChange={(e) =>
                            asignarRol(u.id_usuario, Number(e.target.value))
                          }
                        >
                          <option value="">Seleccionar rol...</option>
                          {roles.map((r) => (
                            <option key={r.id_rol} value={r.id_rol}>
                              {r.nombre_rol}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* 🔐 Tabla de Gestión de Permisos */
          <div className="overflow-x-auto">
            {rolSeleccionado ? (
              /* Vista de permisos para un rol específico */
              <div>
                <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800">
                    Permisos del rol: {rolSeleccionado.nombre_rol}
                  </h3>
                  <p className="text-sm text-purple-600">
                    {rolSeleccionado.descripcion || "Sin descripción"}
                  </p>
                </div>
                <table className="w-full rounded-lg overflow-hidden">
                  <thead className="bg-purple-600 text-white text-left">
                    <tr>
                      <th className="py-3 px-4">Permiso</th>
                      <th className="py-3 px-4">Descripción</th>
                      <th className="py-3 px-4 text-center">Estado</th>
                      <th className="py-3 px-4 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permisos.map((permiso, index) => {
                      // CORRECCIÓN: Verificar correctamente si el rol tiene el permiso
                      const tienePermiso = permisosPorRol[rolSeleccionado.id_rol]?.includes(permiso.id_permiso);
                      
                      return (
                        <tr
                          key={permiso.id_permiso}
                          className={`border-b ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <td className="py-3 px-4 font-medium">
                            {permiso.nombre}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {permiso.descripcion}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              tienePermiso 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {tienePermiso ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => togglePermiso(rolSeleccionado.id_rol, permiso.id_permiso, tienePermiso)}
                              className={`px-4 py-2 rounded-lg font-medium transition ${
                                tienePermiso
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                            >
                              {tienePermiso ? "Desactivar" : "Activar"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Vista general de todos los roles y permisos */
              <table className="w-full rounded-lg overflow-hidden">
                <thead className="bg-purple-600 text-white text-left">
                  <tr>
                    <th className="py-3 px-4">Permiso</th>
                    <th className="py-3 px-4">Descripción</th>
                    {roles.map((rol) => (
                      <th key={rol.id_rol} className="py-3 px-4 text-center">
                        {rol.nombre_rol}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permisos.map((permiso, index) => (
                    <tr
                      key={permiso.id_permiso}
                      className={`border-b ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-4 font-medium">
                        {permiso.nombre}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {permiso.descripcion}
                      </td>
                      
                      {roles.map((rol) => {
                        const tienePermiso = permisosPorRol[rol.id_rol]?.includes(permiso.id_permiso);
                        
                        return (
                          <td key={rol.id_rol} className="py-3 px-4 text-center">
                            <button
                              onClick={() => togglePermiso(rol.id_rol, permiso.id_permiso, tienePermiso)}
                              className={`px-4 py-2 rounded-lg font-medium transition ${
                                tienePermiso
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              {tienePermiso ? "Activo" : "Inactivo"}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}