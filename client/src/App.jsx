/* App.jsx - Main Application entry point and layout orchestrator */
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Import CSS stylesheets
import './styles/theme.css';
import './styles/global.css';

// Import pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ChatbotPage from './pages/ChatbotPage';
import WorkoutPlansPage from './pages/WorkoutPlansPage';
import DietNutritionPage from './pages/DietNutritionPage';
import ProgressTrackerPage from './pages/ProgressTrackerPage';
import SupportPage from './pages/SupportPage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('landing');
  const { user, loading } = useAuth();

  const handleNavigate = (page) => {
    // Auth route guarding
    const protectedPages = ['dashboard', 'chat', 'workouts', 'diet', 'progress'];
    if (protectedPages.includes(page) && !user) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
        <p style={styles.spinnerText}>Decrypting Core Database...</p>
      </div>
    );
  }

  // Identify active workspace view
  const renderActivePage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'chat':
        return <ChatbotPage />;
      case 'workouts':
        return <WorkoutPlansPage onNavigate={handleNavigate} />;
      case 'diet':
        return <DietNutritionPage />;
      case 'progress':
        return <ProgressTrackerPage />;
      case 'support':
        return <SupportPage />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  const isProtectedRoute = ['dashboard', 'chat', 'workouts', 'diet', 'progress'].includes(currentPage);

  return (
    <div style={styles.appContainer}>
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      
      {isProtectedRoute && user ? (
        <div style={styles.dashboardShell}>
          <Sidebar onNavigate={handleNavigate} currentPage={currentPage} />
          <main style={styles.dashboardWorkspace}>
            {renderActivePage()}
          </main>
        </div>
      ) : (
        <div style={styles.publicContent}>
          {renderActivePage()}
        </div>
      )}
    </div>
  );
}

// Wrap in AuthProvider boundary
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
  },
  loadingScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#060a13',
    color: '#f8fafc',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255,255,255,0.05)',
    borderTopColor: '#00f0ff',
    borderRadius: '50%',
    animation: 'rotate 1s linear infinite',
  },
  spinnerText: {
    marginTop: '1.25rem',
    fontFamily: 'Outfit, sans-serif',
    fontSize: '0.9rem',
    color: '#94a3b8',
  },
  dashboardShell: {
    display: 'flex',
    flex: 1,
    width: '100%',
  },
  dashboardWorkspace: {
    flex: 1,
    overflowY: 'auto',
    background: '#060a13',
  },
  publicContent: {
    flex: 1,
    width: '100%',
  }
};
