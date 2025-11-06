import React, { useState } from 'react';
import { BookOpen, HelpCircle } from 'lucide-react';

export default function TeacherRegisterScreen({ onBack }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: firstName,
          apellido: lastName,
          correo_electronico: email,
          password: password,
          rol: 'Docente', // ✅ Cambio importante: rol Docente
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al crear la cuenta');
      }

      alert('✅ Cuenta de docente creada exitosamente. Por favor inicia sesión.');
      onBack();
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 relative">
      <div className="bg-white rounded-2xl p-10 shadow-xl max-w-md w-full">
        {/* Icono */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
            <BookOpen className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Título y descripción */}
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
          Registro de Docente
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Crea tu cuenta para empezar a enseñar
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
              required
            />
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
            required
          />

          {/* Contraseña */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
            required
            minLength={6}
          />

          {/* Nota informativa */}
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              💡 <strong>Nota:</strong> Como docente podrás crear y gestionar tus propios cursos.
            </p>
          </div>

          {/* Botón de registro */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creando cuenta...
              </span>
            ) : (
              'Registrarse como Docente'
            )}
          </button>

          {/* Botón de volver */}
          <button
            type="button"
            onClick={onBack}
            className="w-full text-gray-700 font-medium hover:text-gray-900 transition-colors"
          >
            ← Volver
          </button>
        </form>
      </div>

      {/* Botón de ayuda */}
      <button 
        className="fixed bottom-8 right-8 w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
        onClick={() => alert('¿Necesitas ayuda? Contacta a soporte@tuapp.com')}
      >
        <HelpCircle className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}