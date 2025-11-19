// src/components/course-detail.jsx
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useInscripciones } from '../hooks/useInscripciones';
import './course-detail.css';

const CourseDetail = ({ onNavigate, onBack, courseId }) => {
  const { user } = useAuthContext();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { estaInscrito, inscribirEnCurso, inscribiendo } = useInscripciones(user?.id_usuario);

  // Foro
  const [forumMessages, setForumMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingForum, setLoadingForum] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  const id = courseId;

  // ----------------- useEffect -----------------
  useEffect(() => {
    if (id && user) {
      fetchCourseDetails();
      fetchForumMessages();
    }
  }, [id, user]);

  useEffect(() => {
    if (user) {
      const enrolled = estaInscrito(parseInt(id));
      setIsEnrolled(enrolled);
      if (enrolled) fetchProgress();
    }
  }, [id, user, estaInscrito]);

  // ----------------- FUNCIONES -----------------

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/cursos/${id}`);
      if (!response.ok) throw new Error('Curso no encontrado');
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/progreso-curso/${user.id_usuario}/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      onNavigate('login-estudent');
      return;
    }
    const resultado = await inscribirEnCurso(parseInt(id), 'TARJETA');
    if (resultado.success) {
      setIsEnrolled(true);
      fetchCourseDetails();
      alert('¡Inscripción exitosa!');
    } else {
      alert(`Error: ${resultado.error}`);
    }
  };

  const handleContinueCourse = () => {
    onNavigate("coursePlayer", { cursoId: parseInt(id) });
  };

  // ----------------- FORO -----------------

  const fetchForumMessages = async () => {
    try {
      setLoadingForum(true);
      const res = await fetch(`http://localhost:3000/api/foro/${id}`);
      const data = await res.json();
      let mensajes = [];
      if (Array.isArray(data)) {
        mensajes = data;
      } else if (data && Array.isArray(data.mensajes)) {
        mensajes = data.mensajes;
      }
      setForumMessages(mensajes);
    } catch (err) {
      console.error("Error cargando mensajes del foro:", err);
      setForumMessages([]);
    } finally {
      setLoadingForum(false);
    }
  };

  const handleSendMessage = async () => {
  if (!user) {
    alert("Debes iniciar sesión para escribir en el foro.");
    return;
  }
  if (!newMessage.trim()) return;

  try {
    setSendingMessage(true);

    const res = await fetch(`http://localhost:3000/api/foro/${id}/mensaje`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contenido: newMessage }), // SOLO contenido
    });

    if (!res.ok) throw new Error("Error al enviar mensaje");

    const savedMessage = await res.json();
    setForumMessages(prev => [...prev, savedMessage]);
    setNewMessage("");

  } catch (err) {
    console.error("Error publicando mensaje:", err);
    alert("No se pudo enviar el mensaje");
  } finally {
    setSendingMessage(false);
  }
};





  // ----------------- RENDER -----------------

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando curso...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <span className="text-6xl mb-4">😕</span>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Curso no encontrado</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => onNavigate('catalog')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Volver al Catálogo
        </button>
      </div>
    </div>
  );

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">TA</span>
            </div>
            <button
              className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              onClick={() => onNavigate("catalog")}
            >
              Training Academy
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate("my-courses")} className="hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <span>📚</span>
              <span className="text-gray-700 font-medium">Mis Cursos</span>
            </button>
            <button onClick={() => onNavigate("profile")} className="hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <span>👤</span>
              <span className="text-gray-700 font-medium">Perfil</span>
            </button>
          </div>
        </div>
      </header>

      <div className="course-detail-container">
        <button className="back-button" onClick={onBack}>← Volver</button>

        <div className="course-header">
          <h1>{course.nombre_curso}</h1>
          <p className="course-description">{course.descripcion}</p>
          <div className="course-meta">
            <span className={`badge ${course.modalidad?.toLowerCase()}`}>{course.modalidad}</span>
            <span className="price">${course.costo}</span>
            <span className="duration">{course.duracion} horas</span>
            <span className="spots">{course.cupos} cupos disponibles</span>
          </div>
        </div>

        <div className="course-content">
          {/* Columna izquierda */}
          <div className="course-info">
            {isEnrolled && progress && (
              <div className="progress-section">
                <h3>Tu Progreso</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress.porcentaje_avance || 0}%` }}></div>
                </div>
                <span className="progress-text">{progress.porcentaje_avance || 0}% completado</span>
                <span className="progress-status">Estado: {progress.estado_curso || 'EN_PROGRESO'}</span>
              </div>
            )}

            <div className="instructor-section">
              <h3>Instructor</h3>
              <div className="instructor-info">
                <div className="instructor-avatar">
                  {course.docente?.nombre?.charAt(0)}{course.docente?.apellido?.charAt(0)}
                </div>
                <div className="instructor-details">
                  <h4>{course.docente?.nombre} {course.docente?.apellido}</h4>
                  <p>{course.docente?.correo_electronico}</p>
                </div>
              </div>
            </div>

            {course.horarios && course.horarios.length > 0 && (
              <div className="schedule-section">
                <h3>Horarios</h3>
                {course.horarios.map(horario => (
                  <div key={horario.id_horario_curso} className="schedule-item">
                    <span className="day">{horario.dia_semana}</span>
                    <span className="time">{horario.hora_inicio} - {horario.hora_fin}</span>
                    <span className="location">{horario.modalidad_sesion === 'Virtual' ? 'Virtual' : `Aula ${horario.aula}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Columna derecha */}
          <div className="course-curriculum">
            <h3>Plan de Estudios</h3>
            {course.modulos && course.modulos.length > 0 ? (
              course.modulos.map((modulo, index) => (
                <div key={modulo.id_modulo} className="module-card">
                  <div className="module-header">
                    <h4>Módulo {index + 1}: {modulo.nombre_modulo}</h4>
                    {isEnrolled && modulo.progreso && (
                      <span className="module-progress">{modulo.progreso.porcentaje_avance}%</span>
                    )}
                  </div>
                  <p className="module-description">{modulo.descripcion_modulo}</p>
                  {modulo.temas && modulo.temas.length > 0 && (
                    <div className="topics-list">
                      {modulo.temas.map((tema, topicIndex) => (
                        <div key={tema.id_temario} className="topic-item">
                          <span className="topic-number">{topicIndex + 1}</span>
                          <div className="topic-content">
                            <h5>{tema.nombre_tema}</h5>
                            <p>{tema.descripcion_tema}</p>
                          </div>
                          {isEnrolled && tema.progreso && (
                            <span className={`topic-status ${tema.progreso.estado?.toLowerCase() || 'pendiente'}`}>
                              {tema.progreso.estado || 'PENDIENTE'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2">📚</span>
                <p>El plan de estudios estará disponible pronto</p>
              </div>
            )}

            <div className="action-section">
              {!isEnrolled ? (
                <button className="enroll-button" onClick={handleEnroll} disabled={inscribiendo || course.cupos <= 0}>
                  {inscribiendo ? 'Procesando...' : course.cupos <= 0 ? 'Cupos Agotados' : `Inscribirse - $${course.costo}`}
                </button>
              ) : (
                <button className="continue-button" onClick={handleContinueCourse}>
                  {progress?.porcentaje_avance > 0 ? 'Continuar Estudiando' : 'Comenzar Curso'}
                </button>
              )}
            </div>

            {/* === FORO === */}
            <div className="forum-section mt-10">
              <h3>Foro del Curso</h3>

              {loadingForum ? (
                <p>Cargando mensajes...</p>
              ) : forumMessages.length === 0 ? (
                <p className="text-gray-500">No hay mensajes en el foro.</p>
              ) : (
                <div className="space-y-4 mt-4">
                  {forumMessages.map((msg) => (
                    <div key={msg.id_mensaje} className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm">
                      <p className="font-semibold text-blue-700">{msg.usuario?.nombre || "Usuario"}</p>
                      <p className="text-gray-800 mt-1">{msg.contenido}</p>
                      <small className="text-gray-500">{msg.fecha_publicacion ? new Date(msg.fecha_publicacion).toLocaleString() : ""}</small>
                    </div>
                  ))}
                </div>
              )}

              {/* Input de mensaje */}
              {user ? (
                isEnrolled ? (
                  <div className="forum-input mt-4 flex gap-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 border border-gray-300 rounded p-2"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={sendingMessage}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      {sendingMessage ? "Enviando..." : "Publicar"}
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 text-gray-500">Debes inscribirte para publicar en el foro</p>
                )
              ) : (
                <p className="mt-4 text-gray-500">Inicia sesión para participar en el foro</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
