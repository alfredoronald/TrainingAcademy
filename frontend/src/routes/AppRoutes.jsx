import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import WelcomeScreen from '../components/welcome.jsx';
import RoleSelectionScreen from '../components/role-selection.jsx';
import StudentLoginScreen from '../components/login-estudent.jsx';
import TeacherLoginScreen from '../components/teacher-login.jsx';
import CourseCatalogScreen from '../components/cuorse-catalogo.jsx';
import LeaderboardScreen from '../components/lead-board.jsx';
import BadgesScreen from '../components/badges.jsx';
import ProfileScreen from '../components/profile.jsx';

function AppRoutes() {
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        if (role === 'student') {
            navigate('/login/student');
        } else {
            navigate('/login/teacher');
        }
    };

    const handleLoginSuccess = () => {
        navigate('/catalog');
    };

    return (
        <Routes>
            <Route path="/" element={<WelcomeScreen onRegister={() => navigate('/role-selection')} onLogin={() => navigate('/role-selection')} />} />
            <Route path="/role-selection" element={<RoleSelectionScreen onRoleSelect={handleRoleSelect} onBack={() => navigate(-1)} />} />
            <Route path="/login/student" element={<StudentLoginScreen onBack={() => navigate(-1)} onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/login/teacher" element={<TeacherLoginScreen onBack={() => navigate(-1)} onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/catalog" element={<CourseCatalogScreen role={selectedRole} onNavigate={navigate} />} />
            <Route path="/leaderboard" element={<LeaderboardScreen onNavigate={navigate} />} />
            <Route path="/badges" element={<BadgesScreen onNavigate={navigate} />} />
            <Route path="/profile" element={<ProfileScreen onNavigate={navigate} />} />
        </Routes>
    );
}

export default AppRoutes;
