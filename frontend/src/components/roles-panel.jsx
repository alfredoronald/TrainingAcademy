import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";

export default function RolesPanel({ onNavigate }) {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const resUsuarios = await fetch("http://localhost:3000/api/usuarios");
      const resRoles = await fetch("http://localhost:3000/api/roles");

      const dataUsuarios = await resUsuarios.json();
      const dataRoles = await resRoles.json();

      setUsuarios(dataUsuarios);
      setRoles(dataRoles);
    } catch (err) {
      console.error("Error cargando roles", err);
    } finally {
      setLoading(false);
    }
  };

  const asignarRol = async (id_usuario, id_rol) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/usuarios/${id_usuario}/rol`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_rol }),
        }
      );

      if (res.ok) {
        alert("Rol asignado correctamente");
        cargarDatos();
      }
    } catch (err) {
      console.error("Error asignando rol", err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* 🔙 Botón Volver */}
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
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Roles</h2>
          <p className="text-gray-600 text-sm">
            Asigna permisos y roles a los usuarios del sistema.
          </p>
        </div>
      </div>

      {/* 🟦 Card Contenedora */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
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
                {usuarios.map((u, index) => (
                  <tr
                    key={u.id_usuario}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-4 font-medium">{u.nombre}</td>
                    <td className="py-3 px-4">{u.correo_electronico}</td>
                    <td className="py-3 px-4 font-semibold text-purple-700">
                      {u.rol_nombre || "Sin rol"}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <select
                        className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm shadow-sm hover:border-purple-400 transition cursor-pointer"
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
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
