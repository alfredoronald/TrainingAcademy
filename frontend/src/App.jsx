import { useState } from 'react';
import WelcomeScreen from './components/welcome.jsx';
import RoleSelectionScreen from './components/role-selection.jsx';
import StudentLoginScreen from './components/login-estudent.jsx';
import TeacherLoginScreen from './components/teacher-login.jsx';
import StudentRegisterScreen from './components/register-student.jsx';
import TeacherRegisterScreen from './components/register-teacher.jsx';
import CourseCatalogScreen from './components/cuorse-catalogo.jsx';
import LeaderboardScreen from './components/lead-board.jsx';
import BadgesScreen from './components/badges.jsx';
import ProfileScreen from './components/profile.jsx';
import TeacherDashboardView from './components/teacher-view.jsx';
import TeacherProfile from './components/teacher-profile.jsx';
import AdminLoginScreen from './components/login-admin.jsx';
import AdminDashboard from './components/admin-view.jsx';

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // ✅ Acciones de los botones principales
  const handleRegister = () => {
    setIsRegistering(true);
    setCurrentScreen('role-selection');
  };

  const handleLogin = () => {
    setIsRegistering(false);
    setCurrentScreen('role-selection');
  };

  // ✅ Ir al login del admin
  const handleAdminLogin = () => {
    setCurrentScreen('admin-login');
  };

  // ✅ Selección de rol
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'student') {
      setCurrentScreen(isRegistering ? 'student-register' : 'student-login');
    } else {
      setCurrentScreen(isRegistering ? 'teacher-register' : 'teacher-login');
    }
  };

  // ✅ Botón "Volver"
  const handleBack = () => {
    if (
      currentScreen === 'student-login' ||
      currentScreen === 'teacher-login' ||
      currentScreen === 'student-register' ||
      currentScreen === 'teacher-register' ||
      currentScreen === 'admin-login'
    ) {
      setCurrentScreen('welcome');
    } else if (currentScreen === 'role-selection') {
      setCurrentScreen('welcome');
    } else if (currentScreen === 'catalog') {
      setCurrentScreen('welcome');
    }
  };

  // ✅ Login exitoso - redirige según el rol
  const handleLoginSuccess = (role) => {
    if (role === 'admin') {
      setCurrentScreen('admin-dashboard');
    } else if (role === 'teacher') {
      setCurrentScreen('teacher-dashboard');
    } else {
      setCurrentScreen('catalog'); // Para estudiantes
    }
  };

  // ✅ Navegación entre pantallas
  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  // ✅ Cerrar sesión
  const handleLogout = () => {
    setCurrentScreen('welcome');
    setSelectedRole(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🔹 PANTALLA DE BIENVENIDA */}
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onRegister={handleRegister}
          onLogin={handleLogin}
          onAdminLogin={handleAdminLogin}
        />
      )}

      {/* 🔹 SELECCIÓN DE ROL (Estudiante o Docente) */}
      {currentScreen === 'role-selection' && (
        <RoleSelectionScreen
          onRoleSelect={handleRoleSelect}
          onBack={handleBack}
          isRegistration={isRegistering}
        />
      )}

      {/* 🔹 LOGIN - ESTUDIANTE */}
      {currentScreen === 'student-login' && (
        <StudentLoginScreen
          onBack={handleBack}
          onLoginSuccess={() => handleLoginSuccess('student')}
          onNavigate={handleNavigate}
        />
      )}

      {/* 🔹 LOGIN - DOCENTE */}
      {currentScreen === 'teacher-login' && (
        <TeacherLoginScreen
          onBack={handleBack}
          onLoginSuccess={() => handleLoginSuccess('teacher')}
          onNavigate={handleNavigate}
        />
      )}

      {/* 🔹 LOGIN - ADMINISTRADOR */}
      {currentScreen === 'admin-login' && (
        <AdminLoginScreen
          onBack={handleBack}
          onLoginSuccess={() => handleLoginSuccess('admin')}
          onNavigate={handleNavigate}
        />
      )}

      {/* 🔹 REGISTRO - ESTUDIANTE */}
      {currentScreen === 'student-register' && (
        <StudentRegisterScreen
          onBack={handleBack}
          onLoginSuccess={() => handleLoginSuccess('student')}
        />
      )}

      {/* 🔹 REGISTRO - DOCENTE */}
      {currentScreen === 'teacher-register' && (
        <TeacherRegisterScreen
          onBack={handleBack}
          onLoginSuccess={() => handleLoginSuccess('teacher')}
        />
      )}

      {/* 🔹 CATÁLOGO DE CURSOS (para estudiantes) */}
      {currentScreen === 'catalog' && (
        <CourseCatalogScreen role={selectedRole} onNavigate={handleNavigate} />
      )}

      {/* 🔹 TABLA DE CLASIFICACIÓN */}
      {currentScreen === 'leaderboard' && (
        <LeaderboardScreen onNavigate={handleNavigate} />
      )}

      {/* 🔹 INSIGNIAS */}
      {currentScreen === 'badges' && (
        <BadgesScreen onNavigate={handleNavigate} />
      )}

      {/* 🔹 PERFIL GENERAL */}
      {currentScreen === 'profile' && (
        <ProfileScreen onNavigate={handleNavigate} />
      )}

      {/* 🔹 DASHBOARD - DOCENTE */}
      {currentScreen === 'teacher-dashboard' && (
        <TeacherDashboardView
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}

      {/* 🔹 PERFIL - DOCENTE */}
      {currentScreen === 'teacher-profile' && (
        <TeacherProfile onNavigate={handleNavigate} />
      )}

      {/* 🔹 DASHBOARD - ADMINISTRADOR */}
      {currentScreen === 'admin-dashboard' && (
        <AdminDashboard
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default App;