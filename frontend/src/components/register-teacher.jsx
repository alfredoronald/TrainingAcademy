import React, { useState } from 'react';
import { BookOpen, HelpCircle } from 'lucide-react';

export default function TeacherRegisterScreen({ onBack, onLoginSuccess }) {
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
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;

      if (data.user) {
        const fullName = `${firstName} ${lastName}`.trim();
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            role: 'teacher',
            points: 0,
            courses_completed: 0,
          });
        if (profileError) throw profileError;

        alert('Cuenta creada exitosamente. Por favor inicia sesión.');
        onBack(); // Volver a la pantalla de login
      }
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
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
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
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
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
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />

          {/* Contraseña */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            required
            minLength={6}
          />

          {/* Botón de registro */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>

          {/* Botón de volver */}
          <button
            type="button"
            onClick={onBack}
            className="w-full text-gray-700 font-medium hover:text-gray-900"
          >
            Volver
          </button>
        </form>
      </div>

      {/* Botón de ayuda */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
        <HelpCircle className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
