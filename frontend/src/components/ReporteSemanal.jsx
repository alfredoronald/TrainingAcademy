import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import './ReporteSemanal.css';

const ReporteSemanal = () => {
  const { user } = useAuthContext();
  const [reporteData, setReporteData] = useState(null);
  const [reporteGeneral, setReporteGeneral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      
      // Reporte semanal del usuario
      const responseSemanal = await fetch(`http://localhost:3000/api/reportes/semanal/${user.id_usuario}`);
      const dataSemanal = await responseSemanal.json();
      setReporteData(dataSemanal);

      // Reporte general del sistema
      const responseGeneral = await fetch('http://localhost:3000/api/reportes/general');
      const dataGeneral = await responseGeneral.json();
      setReporteGeneral(dataGeneral);

    } catch (error) {
      console.error('Error cargando reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="reporte-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reporte-container">
      {/* Header */}
      <div className="reporte-header">
        <h1>📊 Reporte de Progreso</h1>
        <p>Estadísticas de tu aprendizaje y del sistema</p>
        <button onClick={cargarReportes} className="btn-refresh">
          🔄 Actualizar Reportes
        </button>
      </div>

      {/* Tabs de Navegación */}
      <div className="tabs-navigation">
        <button 
          className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          📈 Mi Progreso
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sistema' ? 'active' : ''}`}
          onClick={() => setActiveTab('sistema')}
        >
          🏆 Estadísticas del Sistema
        </button>
        <button 
          className={`tab-btn ${activeTab === 'asistencia' ? 'active' : ''}`}
          onClick={() => setActiveTab('asistencia')}
        >
          👥 Asistencia
        </button>
      </div>

      {/* Contenido de Tabs */}
      <div className="tab-content">
        {/* TAB 1: PROGRESO PERSONAL */}
        {activeTab === 'personal' && reporteData && (
          <div className="seccion-reporte">
            <h2>🎯 Tu Progreso Académico</h2>
            
            <div className="stats-grid-personal">
              <div className="stat-card personal">
                <div className="stat-icon">📚</div>
                <div className="stat-value">{reporteData.cursosCompletados}</div>
                <div className="stat-label">Cursos Completados</div>
              </div>
              
              <div className="stat-card personal">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">{reporteData.puntosTotales}</div>
                <div className="stat-label">Puntos Totales</div>
              </div>
              
              <div className="stat-card personal">
                <div className="stat-icon">🔥</div>
                <div className="stat-value">{reporteData.actividadesCompletadas}</div>
                <div className="stat-label">Actividades Esta Semana</div>
              </div>
              
              <div className="stat-card personal">
                <div className="stat-icon">🎓</div>
                <div className="stat-value">{reporteData.promedioNotas.toFixed(1)}</div>
                <div className="stat-label">Promedio de Calificaciones</div>
              </div>
            </div>

            <div className="progreso-detalle">
              <h3>📅 Resumen Semanal</h3>
              <div className="detalle-grid">
                <div className="detalle-item">
                  <span className="detalle-label">Fecha de generación:</span>
                  <span className="detalle-valor">
                    {new Date(reporteData.fechaGeneracion).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="detalle-item">
                  <span className="detalle-label">Estado académico:</span>
                  <span className="detalle-valor estado-bueno">
                    {reporteData.promedioNotas >= 70 ? 'Excelente' : 'En progreso'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ESTADÍSTICAS DEL SISTEMA */}
        {activeTab === 'sistema' && reporteGeneral && (
          <div className="seccion-reporte">
            <h2>🏆 Estadísticas Generales del Sistema</h2>
            
            {/* Cursos Más Demandados */}
            <div className="reporte-grupo">
              <h3>🎓 Cursos Más Populares</h3>
              <div className="lista-items">
                {reporteGeneral.cursosMasDemandados?.map((curso, index) => (
                  <div key={index} className="item-lista destacado">
                    <div className="item-ranking">#{index + 1}</div>
                    <div className="item-info">
                      <span className="item-nombre">{curso.nombre}</span>
                      <span className="item-desc">{curso.valor} inscripciones</span>
                    </div>
                    <div className="item-badge">{curso.valor}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mejor Desempeño */}
            <div className="reporte-grupo">
              <h3>🏅 Top Estudiantes - Mejor Promedio</h3>
              <div className="lista-items">
                {reporteGeneral.mejorDesempeno?.map((usuario, index) => (
                  <div key={index} className="item-lista">
                    <div className="item-ranking">#{index + 1}</div>
                    <div className="item-info">
                      <span className="item-nombre">{usuario.nombre}</span>
                      <span className="item-desc">Promedio: {parseFloat(usuario.valor).toFixed(1)}</span>
                    </div>
                    <div className={`item-puntaje ${index === 0 ? 'top-1' : ''}`}>
                      {parseFloat(usuario.valor).toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recompensas Más Usadas */}
            <div className="reporte-grupo">
              <h3>🎁 Recompensas Más Canjeadas</h3>
              <div className="lista-items">
                {reporteGeneral.recompensasMasUsadas?.map((recompensa, index) => (
                  <div key={index} className="item-lista recompensa">
                    <div className="item-ranking">#{index + 1}</div>
                    <div className="item-info">
                      <span className="item-nombre">{recompensa.nombre}</span>
                      <span className="item-desc">{recompensa.valor} canjes realizados</span>
                    </div>
                    <div className="item-badge recompensa">{recompensa.valor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ASISTENCIA */}
        {activeTab === 'asistencia' && reporteGeneral && (
          <div className="seccion-reporte">
            <h2>👥 Estadísticas de Asistencia</h2>
            <div className="asistencia-header">
              <div className="total-usuarios">
                <span className="total-label">Total de Usuarios:</span>
                <span className="total-value">{reporteGeneral.totalUsuarios}</span>
              </div>
            </div>

            <div className="lista-asistencia">
              {reporteGeneral.estadisticasAsistencia?.map((asistencia, index) => (
                <div key={index} className="item-asistencia">
                  <div className="usuario-info">
                    <span className="usuario-nombre">{asistencia.usuario}</span>
                    <div className="asistencia-stats">
                      <span className="asistencia-presente">
                        ✅ {asistencia.total_presentes} presentes
                      </span>
                      <span className="asistencia-ausente">
                        ❌ {asistencia.total_ausentes} ausentes
                      </span>
                    </div>
                  </div>
                  <div className="asistencia-total">
                    <span className="porcentaje-asistencia">
                      {Math.round((asistencia.total_presentes / (asistencia.total_presentes + asistencia.total_ausentes || 1)) * 100)}%
                    </span>
                    <span className="asistencia-label">Asistencia</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="reporte-footer">
        <p>Reporte generado el {new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>
    </div>
  );
};

export default ReporteSemanal;