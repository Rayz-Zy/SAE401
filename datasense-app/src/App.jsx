import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import DashboardGrid from './components/DashboardGrid/DashboardGrid';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-area">
        <Header />
        <DashboardGrid />
      </main>
    </div>
  );
}

export default App;
