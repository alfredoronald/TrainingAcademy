// components/EvaluationForm.jsx
import React, { useState, useEffect } from 'react';

const EvaluationForm = ({ onBack, onNavigate, courseId, onLogout }) => {
  const [students, setStudents] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [formData, setFormData] = useState({
    id_usuario: '',
    id_curso: courseId || '',
    calificacion: '',
    tipo_evaluacion: 'Examen'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Función para hacer fetch con headers de autenticación
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    const response = await fetch(url, defaultOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseStudents();
      fetchExistingEvaluations();
    }
  }, [courseId]);

  // En EvaluationForm.jsx, modifica fetchCourseStudents temporalmente:
const fetchCourseStudents = async () => {
  try {
    // Intenta con el endpoint real
    const response = await fetch(`http://localhost:3000/api/cursos/${courseId}/estudiantes`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      // Si falla, usar datos de prueba
      console.log('Endpoint no disponible, usando datos de prueba');
      setStudents([
        { id_usuario: 1, nombre: 'Juan', apellido: 'Pérez', correo_electronico: 'juan@example.com' },
        { id_usuario: 2, nombre: 'Ana', apellido: 'López', correo_electronico: 'ana@example.com' },
        { id_usuario: 6, nombre: 'Sofía', apellido: 'Gutiérrez', correo_electronico: 'sofia@example.com' }
      ]);
      return;
    }
    
    const data = await response.json();
    setStudents(data);
  } catch (err) {
    console.error('Error fetching students:', err);
    // Datos de prueba como fallback
    setStudents([
      { id_usuario: 1, nombre: 'Juan', apellido: 'Pérez', correo_electronico: 'juan@example.com' },
      { id_usuario: 2, nombre: 'Ana', apellido: 'López', correo_electronico: 'ana@example.com' }
    ]);
  }
};

  const fetchExistingEvaluations = async () => {
    try {
      // Primero intenta obtener todas las evaluaciones
      const data = await fetchWithAuth(`http://localhost:3000/api/evaluaciones`);
      
      // Filtrar por curso
        const filteredEvaluations = data.filter(e => e.id_curso === parseInt(courseId));

      setEvaluations(filteredEvaluations);
    } catch (err) {
      console.error('Error fetching evaluations:', err);
      setEvaluations([]); // En caso de error, establecer array vacío
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'calificacion' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar que la calificación esté entre 0 y 100
      if (formData.calificacion < 0 || formData.calificacion > 100) {
        throw new Error('La calificación debe estar entre 0 y 100');
      }

      // Calcular estado automáticamente
      const estado = formData.calificacion >= 51 ? 'APROBADO' : 'REPROBADO';
      
      const payload = {
        ...formData,
        estado,
        id_curso: parseInt(courseId),
        fecha: new Date().toISOString().split('T')[0]
      };

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/evaluaciones', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar evaluación');
      }

      // Recargar las evaluaciones
      await fetchExistingEvaluations();
      
      // Limpiar formulario
      setFormData({
        id_usuario: '',
        id_curso: courseId || '',
        calificacion: '',
        tipo_evaluacion: 'Examen'
      });

      alert('✅ Evaluación registrada exitosamente');
    } catch (err) {
      console.error('Error saving evaluation:', err);
      setError(err.message || 'Error al guardar evaluación');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvaluation = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta evaluación?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/evaluaciones/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar evaluación');
      }

      await fetchExistingEvaluations();
      alert('Evaluación eliminada exitosamente');
    } catch (err) {
      console.error('Error deleting evaluation:', err);
      setError('Error al eliminar evaluación');
    }
  };

  // Obtener nombre del estudiante por ID
  const getStudentName = (studentId) => {
    const student = students.find(s => s.id_usuario === studentId);
    return student ? `${student.nombre} ${student.apellido}` : 'Desconocido';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Evaluaciones</h1>
            <p className="text-gray-600 mt-2">Curso ID: {courseId}</p>
          </div>
          <div className="space-x-4">
            <button
              onClick={()=> onNavigate('teacher-dashboard')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              ← Volver al Panel
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario para nueva evaluación */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Asignar Nueva Evaluación</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seleccionar estudiante */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estudiante *
                </label>
                <select
                  name="id_usuario"
                  value={formData.id_usuario}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar estudiante</option>
                  {students.map(student => (
                    <option key={student.id_usuario} value={student.id_usuario}>
                      {student.nombre} {student.apellido} ({student.correo_electronico})
                    </option>
                  ))}
                </select>
              </div>

              {/* Calificación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación (0-100) *
                </label>
                <input
                  type="number"
                  name="calificacion"
                  value={formData.calificacion}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 85.5"
                  required
                />
                {formData.calificacion && (
                  <div className="mt-2">
                    <span className={`text-sm font-medium ${formData.calificacion >= 51 ? 'text-green-600' : 'text-red-600'}`}>
                      Estado: {formData.calificacion >= 51 ? 'APROBADO' : 'REPROBADO'}
                    </span>
                  </div>
                )}
              </div>

              {/* Tipo de evaluación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de evaluación *
                </label>
                <select
                  name="tipo_evaluacion"
                  value={formData.tipo_evaluacion}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Examen">Examen</option>
                  <option value="Proyecto">Proyecto</option>
                  <option value="Tarea">Tarea</option>
                  <option value="Participación">Participación</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Práctica">Práctica</option>
                </select>
              </div>

              {/* Botón de envío */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium ${
                    loading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white transition duration-200`}
                >
                  {loading ? 'Guardando...' : 'Guardar Evaluación'}
                </button>
              </div>
            </form>
          </div>

          {/* Lista de evaluaciones existentes */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Evaluaciones Registradas</h2>
            
            {evaluations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay evaluaciones registradas para este curso.
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {evaluations.map(evaluation => (
                  <div key={evaluation.id_evaluacion} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {getStudentName(evaluation.id_usuario)}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            evaluation.estado === 'APROBADO' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {evaluation.estado}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Calificación:</span> {evaluation.calificacion}/100
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Tipo:</span> {evaluation.tipo_evaluacion}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Fecha:</span> {new Date(evaluation.fecha).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteEvaluation(evaluation.id_evaluacion)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Eliminar evaluación"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">📝 Información importante:</h3>
          <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
            <li>Las calificaciones se guardan automáticamente en la base de datos</li>
            <li>El estado (APROBADO/REPROBADO) se calcula automáticamente con corte en 51</li>
            <li>Puedes asignar múltiples evaluaciones por estudiante</li>
            <li>Las evaluaciones activarán los triggers de insignias automáticamente</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;