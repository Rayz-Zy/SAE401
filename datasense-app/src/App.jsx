import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import DashboardGrid from './components/DashboardGrid/DashboardGrid';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import './App.css';

function App() {
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [currentView, setCurrentView] = useState('accueil'); // 'accueil', 'departements' ou 'regions'
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleViewChange = (newView) => {
    setCurrentView(newView);
    setSelectedDepartement(null); // Réinitialise la sélection lors du changement de vue
  };

  const handleSkipLogin = () => {
    setUser({ user: 'Visiteur', roles: ['GUEST'] });
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} onSkip={handleSkipLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} user={user} onLogout={handleLogout} />
      <main className="main-area">
        {currentView !== 'profil' && (
          <Header onDepartementSelect={setSelectedDepartement} currentView={currentView} onViewChange={handleViewChange} />
        )}
        {currentView === 'profil' ? (
          <Profile user={user} onBack={() => handleViewChange('accueil')} />
        ) : (
          <DashboardGrid selectedDepartement={selectedDepartement} currentView={currentView} />
        )}
      </main>
    </div>
  );
}

export default App;
