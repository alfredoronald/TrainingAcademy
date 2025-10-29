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
import AdminView from './components/admin-view.jsx'; // ✅ Nueva vista del administrador

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

  // ✅ Nuevo: ir al login del admin
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

  const handleLoginSuccess = (role) => {
    if (role === 'admin') {
      setCurrentScreen('admin-view'); // ✅ Navegar al panel del administrador
    } else {
      setCurrentScreen('catalog');
    }
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🔹 Pantalla principal */}
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onRegister={handleRegister}
          onLogin={handleLogin}
          onAdminLogin={handleAdminLogin}
        />
      )}

      {/* 🔹 Selección de rol */}
      {currentScreen === 'role-selection' && (
        <RoleSelectionScreen
          onRoleSelect={handleRoleSelect}
          onBack={handleBack}
          isRegistration={isRegistering}
        />
      )}

      {/* 🔹 Login y registro */}
      {currentScreen === 'student-login' && (
        <StudentLoginScreen
          onBack={handleBack}
          onLoginSuccess={() => handleLoginSuccess('student')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'teacher-login' && (
        <TeacherLoginScreen
          onBack={handleBack}
          onLoginSuccess={() => handleLoginSuccess('teacher')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'student-register' && (
        <StudentRegisterScreen
          onBack={handleBack}
          onLoginSuccess={() => handleLoginSuccess('student')}
        />
      )}

      {currentScreen === 'teacher-register' && (
        <TeacherRegisterScreen
          onBack={handleBack}
          onLoginSuccess={() => handleLoginSuccess('teacher')}
        />
      )}

      {/* 🔹 Login de administrador */}
      {currentScreen === 'admin-login' && (
        <AdminLoginScreen
          onBack={handleBack}
          onLoginSuccess={() => handleLoginSuccess('admin')} // ✅ Ir al admin-view tras login
          onNavigate={handleNavigate}
        />
      )}

      {/* 🔹 Pantallas internas */}
      {currentScreen === 'catalog' && (
        <CourseCatalogScreen role={selectedRole} onNavigate={handleNavigate} />
      )}
      {currentScreen === 'leaderboard' && (
        <LeaderboardScreen onNavigate={handleNavigate} />
      )}
      {currentScreen === 'badges' && <BadgesScreen onNavigate={handleNavigate} />}
      {currentScreen === 'profile' && <ProfileScreen onNavigate={handleNavigate} />}
      {currentScreen === 'teacher-profile' && (
        <TeacherProfile onNavigate={handleNavigate} />
      )}
      {currentScreen === 'teacher-dashboard' && (
        <TeacherDashboardView
          onLogout={() => {
            setCurrentScreen('welcome');
            setSelectedRole(null);
          }}
          onNavigate={handleNavigate}
        />
      )}

      {/* 🔹 Nueva vista del administrador */}
      {currentScreen === 'admin-view' && (
        <AdminView
          onLogout={() => {
            setCurrentScreen('welcome');
            setSelectedRole(null);
          }}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default App;
