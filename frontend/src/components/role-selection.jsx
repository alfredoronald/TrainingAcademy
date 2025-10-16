import React from 'react';
import { GraduationCap, User, BookOpen, HelpCircle } from 'lucide-react';

export default function RoleSelectionScreen({ onRoleSelect, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 relative">
      <div className="text-center max-w-6xl w-full">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <GraduationCap className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-4xl font-semibold text-blue-600 mb-3">
          ¿Cómo deseas iniciar sesión?
        </h1>

        <p className="text-lg text-gray-600 mb-12">
          Selecciona el tipo de cuenta
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex justify-center mb-6">
              <div className="w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-14 h-14 text-blue-600" strokeWidth={1.5} />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Soy Alumno</h2>
            <p className="text-gray-600 mb-8">Quiero aprender y tomar cursos</p>

            <button
              onClick={() => onRoleSelect('student')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continuar como Alumno
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex justify-center mb-6">
              <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-14 h-14 text-green-600" strokeWidth={1.5} />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Soy Maestro</h2>
            <p className="text-gray-600 mb-8">Quiero enseñar y crear cursos</p>

            <button
              onClick={() => onRoleSelect('teacher')}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Continuar como Maestro
            </button>
          </div>
        </div>

        <button
          onClick={onBack}
          className="text-gray-700 font-medium hover:text-gray-900 transition-colors"
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
