import React from 'react';
import { GraduationCap, Award, Trophy, Medal, User, Star, Zap, Target, Flame } from 'lucide-react';


const badges = [
  {
    id: 1,
    name: 'Estrella Naciente',
    description: 'Para estudiantes que completan su primer curso',
    icon: Star,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    points: 100,
  },
  {
    id: 2,
    name: 'Rayo de Conocimiento',
    description: 'Completa 3 cursos en un mes',
    icon: Zap,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    points: 250,
  },
  {
    id: 3,
    name: 'Maestro Enfocado',
    description: 'Alcanza el 100% en todos los módulos de un curso',
    icon: Target,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50',
    points: 300,
  },
  {
    id: 4,
    name: 'Llama del Aprendizaje',
    description: 'Estudia 7 días consecutivos',
    icon: Flame,
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50',
    points: 200,
  },
  {
    id: 5,
    name: 'Estudiante Dedicado',
    description: 'Completa 10 cursos en total',
    icon: Award,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
    points: 500,
  },
  {
    id: 6,
    name: 'Experto Certificado',
    description: 'Obtén certificación en 5 cursos',
    icon: Medal,
    iconColor: 'text-teal-500',
    bgColor: 'bg-teal-50',
    points: 400,
  },
  {
    id: 7,
    name: 'Líder del Aprendizaje',
    description: 'Alcanza el top 10 del ranking',
    icon: Trophy,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50',
    points: 600,
  },
  {
    id: 8,
    name: 'Maestro del Conocimiento',
    description: 'Completa 20 cursos en total',
    icon: GraduationCap,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    points: 1000,
  },
];

export default function BadgesScreen({ onNavigate }) {
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

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-blue-600 mb-3">Tienda de Insignias</h1>
          <p className="text-lg text-gray-600">Intercambia tus puntos por insignias especiales</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge) => {
            const IconComponent = badge.icon;
            return (
              <div
                key={badge.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-6">
                  <div className={`w-24 h-24 ${badge.bgColor} rounded-full flex items-center justify-center`}>
                    <IconComponent className={`w-12 h-12 ${badge.iconColor}`} strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 text-center mb-3">
                  {badge.name}
                </h3>

                <p className="text-sm text-gray-600 text-center mb-6">{badge.description}</p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-green-600" />
                  <span className="text-lg font-semibold text-green-600">{badge.points}</span>
                  <span className="text-sm text-gray-600">puntos</span>
                </div>

                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Adquirir
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
