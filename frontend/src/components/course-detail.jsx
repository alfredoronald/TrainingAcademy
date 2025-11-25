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

  // Foro - Estados mejorados
  const [forumMessages, setForumMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loadingForum, setLoadingForum] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  const id = courseId;

  // ----------------- useEffect -----------------
  useEffect(() => {
    if (id && user) {
      fetchCourseDetails();
      fetchForumMessages();
    }
  }, [id, user]);

  useEffect(() => {
    if (user && id) {
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

  // ----------------- FORO CORREGIDO -----------------

  const fetchForumMessages = async () => {
    try {
      setLoadingForum(true);
      
      const mensajesRes = await fetch(`http://localhost:3000/api/foro/${id}/mensajes`);
      if (!mensajesRes.ok) {
        setForumMessages([]);
        return;
      }
      
      const mensajesData = await mensajesRes.json();
      
      // Función auxiliar para formatear fecha
      const formatearFecha = (fecha_envio, hora_envio) => {
        if (!fecha_envio) return 'Fecha no disponible';
        
        try {
          // Intentar diferentes formatos de fecha
          let fechaObj;
          
          if (hora_envio) {
            // Si tenemos hora, intentar combinar
            fechaObj = new Date(`${fecha_envio}T${hora_envio}`);
          } else {
            fechaObj = new Date(fecha_envio);
          }
          
          // Si la fecha es inválida, intentar parsear manualmente
          if (isNaN(fechaObj.getTime())) {
            // Parsear manualmente el formato YYYY-MM-DD
            const [year, month, day] = fecha_envio.split('-');
            if (hora_envio) {
              const [hours, minutes, seconds] = hora_envio.split(':');
              fechaObj = new Date(year, month - 1, day, hours, minutes, seconds || 0);
            } else {
              fechaObj = new Date(year, month - 1, day);
            }
          }
          
          // Verificar nuevamente si es válida
          if (!isNaN(fechaObj.getTime())) {
            return fechaObj.toLocaleString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          } else {
            // Si todo falla, mostrar el formato original
            return `${fecha_envio} ${hora_envio || ''}`.trim();
          }
        } catch (error) {
          console.error('Error formateando fecha:', error);
          return `${fecha_envio} ${hora_envio || ''}`.trim();
        }
      };

      // Formatear los mensajes para el frontend
      const formatMessages = (messages) => {
        return messages.map(msg => ({
          id_mensaje: msg.id_mensaje,
          contenido: msg.contenido,
          fecha_publicacion: formatearFecha(msg.fecha_envio, msg.hora_envio),
          usuario: {
            id_usuario: msg.usuario?.id_usuario,
            nombre: msg.usuario?.nombre || 'Usuario',
            apellido: msg.usuario?.apellido || ''
          },
          respuestas: msg.respuestas ? formatMessages(msg.respuestas) : []
        }));
      };
      
      setForumMessages(formatMessages(mensajesData));
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
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          contenido: newMessage,
          id_usuario: user.id_usuario
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al enviar mensaje");
      }

      // Recargar mensajes en lugar de agregar manualmente
      await fetchForumMessages();
      setNewMessage("");

    } catch (err) {
      console.error("Error publicando mensaje:", err);
      alert("No se pudo enviar el mensaje: " + err.message);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSendReply = async (parentMessageId, replyContent) => {
    if (!user || !replyContent.trim()) return;

    try {
      setSendingReply(true);

      const res = await fetch(`http://localhost:3000/api/foro/${id}/mensaje`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          contenido: replyContent,
          id_usuario: user.id_usuario,
          id_mensaje_respuesta: parentMessageId
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al enviar respuesta");
      }

      // Recargar mensajes
      await fetchForumMessages();
      setReplyingTo(null);

    } catch (err) {
      console.error("Error publicando respuesta:", err);
      alert("No se pudo enviar la respuesta: " + err.message);
    } finally {
      setSendingReply(false);
    }
  };

  const handleStartReply = (messageId) => {
    setReplyingTo(messageId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  // Componente separado para el formulario de respuesta
  const ReplyForm = ({ messageId, onCancel, onSubmit, sendingReply }) => {
    const [localReplyContent, setLocalReplyContent] = useState('');

    const handleSubmit = () => {
      onSubmit(messageId, localReplyContent);
    };

    const handleCancel = () => {
      setLocalReplyContent("");
      onCancel();
    };

    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <textarea
          value={localReplyContent}
          onChange={(e) => setLocalReplyContent(e.target.value)}
          placeholder="Escribe tu respuesta..."
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows="2"
          maxLength="500"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            {localReplyContent.length}/500 caracteres
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={sendingReply || !localReplyContent.trim()}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {sendingReply ? "Enviando..." : "Enviar Respuesta"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Componente recursivo para mostrar mensajes y respuestas
  const MessageItem = ({ message, level = 0 }) => {
    const marginLeft = level * 24;
    
    return (
      <div className="message-item" style={{ marginLeft: `${marginLeft}px` }}>
        <div className={`border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow ${level > 0 ? 'bg-gray-50' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <p className="font-semibold text-blue-700">
              {message.usuario?.nombre} {message.usuario?.apellido}
            </p>
            <small className="text-gray-500 text-sm">
              {message.fecha_publicacion || ''}
            </small>
          </div>
          <p className="text-gray-800 mt-2 whitespace-pre-wrap">{message.contenido}</p>
          
          {/* Botones de acción */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleStartReply(message.id_mensaje)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 px-3 py-1 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <span>↩️</span>
              Responder
            </button>
          </div>

          {/* Formulario de respuesta */}
          {replyingTo === message.id_mensaje && (
            <ReplyForm
              messageId={message.id_mensaje}
              onCancel={handleCancelReply}
              onSubmit={handleSendReply}
              sendingReply={sendingReply}
            />
          )}
        </div>

        {/* Respuestas anidadas */}
        {message.respuestas && message.respuestas.length > 0 && (
          <div className="mt-3 space-y-3">
            {message.respuestas.map((respuesta) => (
              <MessageItem 
                key={respuesta.id_mensaje} 
                message={respuesta} 
                level={level + 1} 
              />
            ))}
          </div>
        )}
      </div>
    );
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
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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

            {/* === FORO CON SISTEMA DE RESPUESTAS === */}
            <div className="forum-section mt-10 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Foro del Curso</h3>

              {loadingForum ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Cargando mensajes...</p>
                </div>
              ) : forumMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <span className="text-4xl mb-2">💬</span>
                  <p>No hay mensajes en el foro. ¡Sé el primero en comentar!</p>
                </div>
              ) : (
                <div className="space-y-4 mt-4 max-h-96 overflow-y-auto p-2">
                  {forumMessages.map((message) => (
                    <MessageItem key={message.id_mensaje} message={message} />
                  ))}
                </div>
              )}

              {/* Input para nuevo mensaje (no respuesta) */}
              <div className="mt-6">
                {user ? (
                  isEnrolled ? (
                    <div className="forum-input flex flex-col gap-3">
                      <h4 className="font-semibold text-gray-700">Nuevo Mensaje:</h4>
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un nuevo mensaje para el foro..."
                        className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows="3"
                        maxLength="500"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {newMessage.length}/500 caracteres
                        </span>
                        <button
                          onClick={handleSendMessage}
                          disabled={sendingMessage || !newMessage.trim()}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          {sendingMessage ? (
                            <span className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Enviando...
                            </span>
                          ) : (
                            "Publicar Mensaje"
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-yellow-700">
                        📚 Debes inscribirte en el curso para publicar en el foro
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-700">
                      🔐 Inicia sesión para participar en el foro
                    </p>
                    <button
                      onClick={() => onNavigate('login-estudent')}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Iniciar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;