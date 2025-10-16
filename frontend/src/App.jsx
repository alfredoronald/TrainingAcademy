import { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import StudentLoginScreen from './components/StudentLoginScreen';
import TeacherLoginScreen from './components/TeacherLoginScreen';
import CourseCatalogScreen from './components/CourseCatalogScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import BadgesScreen from './components/BadgesScreen';
import ProfileScreen from './components/ProfileScreen';

type Screen = 'welcome' | 'role-selection' | 'student-login' | 'teacher-login' | 'catalog' | 'leaderboard' | 'badges' | 'profile';
type Role = 'student' | 'teacher' | null;

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const handleRegister = () => {
    setCurrentScreen('role-selection');
  };

  const handleLogin = () => {
    setCurrentScreen('role-selection');
  };

  const handleRoleSelect = (role: 'student' | 'teacher') => {
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

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
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
