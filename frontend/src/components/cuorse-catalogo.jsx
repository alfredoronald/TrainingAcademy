import React from 'react';
import { GraduationCap, Award, Trophy, Medal, User, Clock, Users, Star } from 'lucide-react';

//interface CourseCatalogScreenProps {
//  role: 'student' | 'teacher' | null;
//  onNavigate: (screen: string) => void;
//}

const courses = [
  {
    id: 1,
    category: 'Programación',
    level: 'Intermedio',
    title: 'Desarrollo Web Full Stack',
    description: 'Aprende a crear aplicaciones web modernas con React, Node.js y MongoDB',
    instructor: 'María González',
    duration: '12 semanas',
    students: '15,420',
    rating: 4.8,
    price: '$299',
    categoryColor: 'bg-green-500',
  },
  {
    id: 2,
    category: 'Inteligencia Artificial',
    level: 'Avanzado',
    title: 'Machine Learning con Python',
    description: 'Domina los fundamentos del aprendizaje automático y crea tus propios modelos',
    instructor: 'Carlos Ramírez',
    duration: '10 semanas',
    students: '12,350',
    rating: 4.9,
    price: '$349',
    categoryColor: 'bg-green-500',
  },
  {
    id: 3,
    category: 'Diseño',
    level: 'Principiante',
    title: 'Diseño UX/UI desde Cero',
    description: 'Crea interfaces increíbles y experiencias de usuario memorables',
    instructor: 'Ana Martínez',
    duration: '8 semanas',
    students: '18,900',
    rating: 4.7,
    price: '$249',
    categoryColor: 'bg-green-500',
  },
  {
    id: 4,
    category: 'Marketing',
    level: 'Intermedio',
    title: 'Marketing Digital Avanzado',
    description: 'Estrategias efectivas de marketing en redes sociales y SEO',
    instructor: 'Luis Fernández',
    duration: '6 semanas',
    students: '9,200',
    rating: 4.6,
    price: '$199',
    categoryColor: 'bg-green-500',
  },
  {
    id: 5,
    category: 'Fotografía',
    level: 'Intermedio',
    title: 'Fotografía Profesional',
    description: 'Técnicas avanzadas de fotografía y edición con Lightroom y Photoshop',
    instructor: 'Carmen Torres',
    duration: '10 semanas',
    students: '14,500',
    rating: 4.8,
    price: '$279',
    categoryColor: 'bg-green-500',
  },
  {
    id: 6,
    category: 'Finanzas',
    level: 'Principiante',
    title: 'Finanzas Personales',
    description: 'Aprende a gestionar tu dinero e invertir de manera inteligente',
    instructor: 'Roberto Silva',
    duration: '5 semanas',
    students: '11,300',
    rating: 4.5,
    price: '$149',
    categoryColor: 'bg-green-500',
  },
];

export default function CourseCatalogScreen({ onNavigate }) {
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
          <h1 className="text-4xl font-semibold text-blue-600 mb-3">
            Catálogo de Cursos
          </h1>
          <p className="text-lg text-gray-600">
            Descubre los mejores cursos para tu desarrollo profesional
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className={`${course.categoryColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                    {course.category}
                  </span>
                  <span className="text-xs font-medium text-gray-600">
                    {course.level}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-700">
                    Por {course.instructor}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{course.rating}</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">{course.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
