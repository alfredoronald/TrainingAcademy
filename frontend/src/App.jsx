import { useState } from 'react';
import WelcomeScreen from './components/welcome.jsx';
import RoleSelectionScreen from './components/role-selection.jsx';
import StudentLoginScreen from './components/login-estudent.jsx';
import TeacherLoginScreen from './components/teacher-login.jsx';
import CourseCatalogScreen from './components/cuorse-catalogo.jsx';
import LeaderboardScreen from './components/lead-board.jsx';
import BadgesScreen from './components/badges.jsx';
import ProfileScreen from './components/profile.jsx';


function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRegister = () => {
    setCurrentScreen('role-selection');
  };

  const handleLogin = () => {
    setCurrentScreen('role-selection');
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'student') {
      setCurrentScreen('student-login');
    } else {
      setCurrentScreen('teacher-login');
    }
  };

  const handleBack = () => {
    if (currentScreen === 'student-login' || currentScreen === 'teacher-login') {
      setCurrentScreen('role-selection');
    } else if (currentScreen === 'role-selection') {
      setCurrentScreen('welcome');
    } else if (currentScreen === 'catalog') {
      setCurrentScreen('welcome');
    }
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('catalog');
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onRegister={handleRegister} onLogin={handleLogin} />
      )}
      {currentScreen === 'role-selection' && (
        <RoleSelectionScreen onRoleSelect={handleRoleSelect} onBack={handleBack} />
      )}
      {currentScreen === 'student-login' && (
        <StudentLoginScreen onBack={handleBack} onLoginSuccess={handleLoginSuccess} />
      )}
      {currentScreen === 'teacher-login' && (
        <TeacherLoginScreen onBack={handleBack} onLoginSuccess={handleLoginSuccess} />
      )}
      {currentScreen === 'catalog' && (
        <CourseCatalogScreen role={selectedRole} onNavigate={handleNavigate} />
      )}
      {currentScreen === 'leaderboard' && (
        <LeaderboardScreen onNavigate={handleNavigate} />
      )}
      {currentScreen === 'badges' && (
        <BadgesScreen onNavigate={handleNavigate} />
      )}
      {currentScreen === 'profile' && (
        <ProfileScreen onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
