import React from 'react';
import { GraduationCap, Award, Trophy, Medal, User, Mail, BarChart3 } from 'lucide-react';

export default function ProfileScreen({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-xl font-semibold text-gray-900">Training Academy</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">2500 puntos</span>
              </div>

              <button
                onClick={() => onNavigate('leaderboard')}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Trophy className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-700">Logros</span>
              </button>

              <button
                onClick={() => onNavigate('badges')}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Medal className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-700">Insignias</span>
              </button>

              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <User className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-700">Ver Perfil</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-blue-600 mb-3">Mi Perfil</h1>
          <p className="text-lg text-gray-600">Gestiona tu información y revisa tu progreso</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-8">
                <User className="w-6 h-6 text-gray-900" />
                <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
              </div>

              <div className="flex items-start gap-6 mb-8">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-bold text-white">UD</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-semibold text-gray-900">Usuario Demo</h3>
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Alumno
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>usuario@trainingacademy.com</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-sm text-gray-600 mb-2">Cursos completados</p>
                  <p className="text-4xl font-bold text-blue-600">3</p>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <p className="text-sm text-gray-600 mb-2">Puntos totales</p>
                  <p className="text-4xl font-bold text-green-600">2500</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <Medal className="w-6 h-6 text-gray-900" />
                <h2 className="text-xl font-semibold text-gray-900">Mis Insignias</h2>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center"
                  >
                    <Medal className="w-8 h-8 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-gray-900" />
                <h2 className="text-xl font-semibold text-gray-900">Análisis</h2>
              </div>

              <p className="text-gray-600 mb-6">
                Revisa tu progreso semanal y estadísticas de aprendizaje
              </p>

              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Ver Reporte Semanal
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
