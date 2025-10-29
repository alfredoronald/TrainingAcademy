import React, { useState } from 'react';
import { User, HelpCircle } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

export default function StudentLoginScreen({ onBack, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, errorAuth, loadingAuth } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo_electronico: email, password }),
      });

      const data = await res.json();
      console.log("🔐 Datos de login recibidos:", data);
      if (!res.ok) throw new Error(data.message || "Correo o contraseña incorrectos");

      setUser(data);

      if (data.roles.includes("Estudiante")) onNavigate("catalog");
      else if (data.roles.includes("Docente")) onNavigate("teacher-dashboard");
      else alert("No tienes permisos válidos");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 relative">
      <div className="bg-white rounded-2xl p-10 shadow-xl max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <span className="px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded-full">
            Alumno
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
          Iniciar Sesión
        </h1>

        <p className="text-gray-600 text-center mb-4">
          Accede a tu cuenta de Training Academy como alumno
        </p>

        {errorAuth && <p className="text-red-600 text-center mb-4">{errorAuth}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loadingAuth}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md"
          >
            {loadingAuth ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        <button
          onClick={onBack}
          className="w-full mt-6 text-gray-700 font-medium hover:text-gray-900 transition-colors"
        >
          Volver
        </button>
      </div>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
        <HelpCircle className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
