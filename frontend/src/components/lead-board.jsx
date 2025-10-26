
import React, { useEffect, useState } from 'react'; 
import { GraduationCap, Award, Trophy, Medal, User } from 'lucide-react';

export default function LeaderboardScreen({ onNavigate }) {
  const [topStudents, setTopStudents] = useState([]);

  // 🔹 Función para cargar rankings desde el backend
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/rankings'); // ajusta la URL si es necesario
        const data = await res.json();

        // Transformamos los datos para el frontend
        const transformed = data.map((item, index) => ({
          id: item.id_ranking,
          name: item.usuario?.nombre || 'Sin nombre',
          rank: index + 1,
          courses: item.curso ? 1 : 0, // si quieres contar cursos completados, ajustar según tu lógica
          points: item.posicion || 0,
          icon:
            index === 0 ? Trophy : index === 1 ? Medal : index === 2 ? Award : Medal,
          iconColor:
            index === 0
              ? 'text-yellow-500'
              : index === 1
              ? 'text-gray-400'
              : index === 2
              ? 'text-orange-500'
              : 'text-gray-300',
          bgColor:
            index < 3 ? (index === 0 ? 'bg-yellow-50' : index === 2 ? 'bg-orange-50' : 'bg-gray-50') : 'bg-gray-50',
          badge: index < 3 ? `Top ${index + 1}` : '',
          badgeColor: index < 3 ? 'bg-blue-100 text-blue-700' : '',
        }));

        setTopStudents(transformed);
      } catch (error) {
        console.error('Error cargando rankings:', error);
      }
    };

    fetchRankings();
  }, []);

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