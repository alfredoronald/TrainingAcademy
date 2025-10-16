import React from 'react';
import { GraduationCap, HelpCircle } from 'lucide-react';


export default function Welcome({ onRegister, onLogin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 relative">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <GraduationCap className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-5xl font-semibold text-blue-600 mb-4">
          Training Academy
        </h1>

        <p className="text-xl text-gray-600 mb-12">
          Aprende nuevas habilidades con los mejores cursos en línea
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onRegister}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            Registrarse
          </button>

          <button
            onClick={onLogin}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-md"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
        <HelpCircle className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
