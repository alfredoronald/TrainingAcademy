import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import WelcomeScreen from './components/welcome.jsx';
import RoleSelectionScreen from './components/role-selection.jsx';
import StudentLoginScreen from './components/login-estudent.jsx';
import TeacherLoginScreen from './components/teacher-login.jsx';
import StudentRegisterScreen from './components/register-student.jsx';
import TeacherRegisterScreen from './components/register-teacher.jsx';
import CourseCatalogScreen from './components/course-catalogo.jsx';
import LeaderboardScreen from './components/lead-board.jsx';
import BadgesScreen from './components/badges.jsx';
import ProfileScreen from './components/profile.jsx';
import TeacherDashboardView from './components/teacher-view.jsx';
import TeacherProfile from './components/teacher-profile.jsx';
import AdminLoginScreen from './components/login-admin.jsx';
import AdminDashboard from './components/admin-view.jsx';
import MyCoursesScreen from './components/MyCoursesScreen';
import CourseDetail from './components/course-detail.jsx';
import RewardsScreen from './components/RewardsScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [navigationParams, setNavigationParams] = useState({}); // 🆕 PARA GUARDAR PARÁMETROS

  // 🆕 Debug
  console.log('Current Screen:', currentScreen);
  console.log('Selected Role:', selectedRole);

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
    } else if (currentScreen === 'my-courses') {
      setCurrentScreen('catalog');
    } else if (currentScreen === 'course-detail') {
      setCurrentScreen('catalog');
    } else if (currentScreen === 'rewards') {
      setCurrentScreen('catalog');
    } else if (currentScreen === 'leaderboard') {
      setCurrentScreen('catalog');
    } else if (currentScreen === 'badges') {
      setCurrentScreen('catalog');
    } else if (currentScreen === 'profile') {
      setCurrentScreen('catalog');
    }
  };

  // ✅ Login exitoso - redirige según el rol
  const handleLoginSuccess = (role, userData = {}) => {
    console.log('Login exitoso para:', role, userData);
    
    if (role === 'admin') {
      setCurrentScreen('admin-dashboard');
    } else if (role === 'teacher') {
      setCurrentScreen('teacher-dashboard');
    } else {
      setCurrentScreen('catalog'); // Para estudiantes
    }
  };

  // ✅ Navegación entre pantallas
  const handleNavigate = (screen, params = {}) => {
    console.log('Navegando a:', screen, 'con parámetros:', params);
    
    // Guardar parámetros de navegación
    setNavigationParams(params);
    
    // Manejar navegación específica para estudiantes
    if (screen === 'my-courses' && selectedRole === 'student') {
      setCurrentScreen('my-courses');
    } else if (screen === 'catalog' && selectedRole === 'student') {
      setCurrentScreen('catalog');
    } else if (screen === 'course-detail') {
      setCurrentScreen('course-detail');
    } else {
      setCurrentScreen(screen);
    }
  };

  // ✅ Cerrar sesión
  const handleLogout = () => {
    console.log('Cerrando sesión...');
    setCurrentScreen('welcome');
    setSelectedRole(null);
    setIsRegistering(false);
    setNavigationParams({});
  };

  // 🆕 Función para renderizar cada pantalla con manejo de navegación consistente
  const renderScreen = () => {
    const commonProps = {
      onNavigate: handleNavigate,
      onBack: handleBack,
      onLogout: handleLogout,
      params: navigationParams // 🆕 AGREGAR PARÁMETROS A TODAS LAS PANTALLAS
    };

    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onRegister={handleRegister}
            onLogin={handleLogin}
            onAdminLogin={handleAdminLogin}
            {...commonProps}
          />
        );

      case 'role-selection':
        return (
          <RoleSelectionScreen
            onRoleSelect={handleRoleSelect}
            isRegistration={isRegistering}
            {...commonProps}
          />
        );

      case 'student-login':
        return (
          <StudentLoginScreen
            onLoginSuccess={() => handleLoginSuccess('student')}
            {...commonProps}
          />
        );

      case 'teacher-login':
        return (
          <TeacherLoginScreen
            onLoginSuccess={() => handleLoginSuccess('teacher')}
            {...commonProps}
          />
        );

      case 'admin-login':
        return (
          <AdminLoginScreen
            onLoginSuccess={() => handleLoginSuccess('admin')}
            {...commonProps}
          />
        );

      case 'student-register':
        return (
          <StudentRegisterScreen
            onLoginSuccess={() => handleLoginSuccess('student')}
            {...commonProps}
          />
        );

      case 'teacher-register':
        return (
          <TeacherRegisterScreen
            onLoginSuccess={() => handleLoginSuccess('teacher')}
            {...commonProps}
          />
        );

      case 'catalog':
        return (
          <CourseCatalogScreen 
            role={selectedRole} 
            {...commonProps}
          />
        );

      case 'my-courses':
        return (
          <MyCoursesScreen {...commonProps} />
        );

      case 'leaderboard':
        return (
          <LeaderboardScreen {...commonProps} />
        );

      case 'badges':
        return (
          <BadgesScreen {...commonProps} />
        );

      case 'profile':
        return (
          <ProfileScreen {...commonProps} />
        );

      case 'teacher-dashboard':
        return (
          <TeacherDashboardView {...commonProps} />
        );

      case 'teacher-profile':
        return (
          <TeacherProfile {...commonProps} />
        );

      case 'admin-dashboard':
        return (
          <AdminDashboard {...commonProps} />
        );

      case 'course-detail':
        return (
          <CourseDetail 
            courseId={navigationParams.courseId} 
            {...commonProps} 
          />
        );

      // ✅ NUEVA PANTALLA DE RECOMPENSAS
      case 'rewards':
        return (
          <RewardsScreen {...commonProps} />
        );

      default:
        // Pantalla por defecto si no se reconoce la pantalla actual
        console.warn('Pantalla no reconocida:', currentScreen);
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Pantalla no encontrada</h1>
              <p className="text-gray-600 mb-4">La pantalla "{currentScreen}" no existe.</p>
              <button
                onClick={() => setCurrentScreen('welcome')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          {renderScreen()}
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;