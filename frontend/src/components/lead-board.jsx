
import React from 'react';
import { GraduationCap, Award, Trophy, Medal, User } from 'lucide-react';

const topStudents = [
  {
    id: 1,
    name: 'Elena Torres',
    rank: 1,
    courses: 15,
    points: 12500,
    icon: Trophy,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    badge: 'Top 1',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    name: 'Miguel Ángel Ruiz',
    rank: 2,
    courses: 14,
    points: 11800,
    icon: Medal,
    iconColor: 'text-gray-400',
    bgColor: 'bg-gray-50',
    badge: 'Top 2',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 3,
    name: 'Sofía Morales',
    rank: 3,
    courses: 13,
    points: 10950,
    icon: Award,
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50',
    badge: 'Top 3',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 4,
    name: 'Diego Fernández',
    rank: 4,
    courses: 12,
    points: 9800,
    icon: Medal,
    iconColor: 'text-gray-300',
    bgColor: 'bg-gray-50',
    badge: '',
    badgeColor: '',
  },
];

export default function LeaderboardScreen({ onNavigate }) {
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

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-blue-600 mb-3">Tabla de Logros</h1>
          <p className="text-lg text-gray-600">Los mejores estudiantes de la plataforma</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Top 10 Estudiantes</h2>
          </div>

          <div className="space-y-4">
            {topStudents.map((student) => {
              const IconComponent = student.icon;
              return (
                <div
                  key={student.id}
                  className={`flex items-center justify-between p-6 rounded-xl ${
                    student.rank <= 3 ? student.bgColor : 'bg-gray-50'
                  } transition-all hover:shadow-md`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 ${
                        student.rank <= 3 ? 'bg-white' : 'bg-gray-100'
                      } rounded-full flex items-center justify-center`}
                    >
                      <IconComponent className={`w-7 h-7 ${student.iconColor}`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                        {student.badge && (
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${student.badgeColor}`}
                          >
                            {student.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{student.courses} cursos completados</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {student.points.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">puntos</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
