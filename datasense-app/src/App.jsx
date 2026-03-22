import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import DashboardGrid from './components/DashboardGrid/DashboardGrid';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import FranceMap from './components/Map/FranceMap';
import ComparisonView from './components/Comparison/ComparisonView';
import './App.css';

function App() {
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [currentView, setCurrentView] = useState('accueil'); // 'accueil', 'departements' ou 'regions'
  const [user, setUser] = useState(null);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('datasense_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Erreur lors de la récupération de la session :", e);
        localStorage.removeItem('datasense_user');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('datasense_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('datasense_user');
  };

  const handleViewChange = (newView) => {
    setCurrentView(newView);
    setSelectedDepartement(null); // Réinitialise la sélection lors du changement de vue
  };

  const handleSkipLogin = () => {
    const guestUser = { user: 'Visiteur', roles: ['GUEST'] };
    setUser(guestUser);
    localStorage.setItem('datasense_user', JSON.stringify(guestUser));
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
        ) : currentView === 'carte' ? (
          <div className="content-wrapper">
            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
              <FranceMap 
                onDepartementSelect={(dpt) => {
                  setSelectedDepartement(dpt);
                  setCurrentView('departements');
                }}
                selectedId={selectedDepartement?.code}
              />
            </div>
          </div>
        ) : currentView === 'comparaison' ? (
          <div className="content-wrapper">
            <ComparisonView />
          </div>
        ) : (
          <DashboardGrid selectedDepartement={selectedDepartement} currentView={currentView} />
        )}
      </main>
    </div>
  );
}

export default App;
