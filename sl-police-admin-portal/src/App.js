import { api } from './services/api.js';
import Login from './components/Login.js';
import DashboardLayout from './components/DashboardLayout.js';
import OverviewWidgets from './dashboard/OverviewWidgets.js';
import DistrictStatsChart from './dashboard/DistrictStatsChart.js';
import CategoryBreakdownChart from './dashboard/CategoryBreakdownChart.js';
import FinesList from './components/FinesList.js';
import OfficersList from './components/OfficersList.js';
import CategoriesList from './components/CategoriesList.js';

const { useState, useEffect } = React;

export default function App() {
  const [token, setToken] = useState(api.getToken());
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, fines, officers, categories
  const [isLiveMode, setIsLiveMode] = useState(api.isLiveMode());

  // Check auth state on load
  useEffect(() => {
    const activeToken = api.getToken();
    if (activeToken) {
      setToken(activeToken);
    } else {
      setToken(null);
    }
  }, []);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    api.clearToken();
    setToken(null);
    setCurrentView('dashboard');
  };

  const handleToggleLiveMode = (useLive) => {
    api.setLiveMode(useLive);
    setIsLiveMode(useLive);
    // When changing modes, clear the token and force login to ensure credentials align
    api.clearToken();
    setToken(null);
  };

  // If not authenticated, render Login Page
  if (!token) {
    return React.createElement(Login, { 
      onLoginSuccess: handleLoginSuccess,
      isLiveMode: isLiveMode,
      onToggleLiveMode: handleToggleLiveMode
    });
  }

  // Render Dashboard Content
  const renderViewContent = () => {
    switch (currentView) {
      case 'dashboard':
        return React.createElement('div', { className: 'page-container' },
          React.createElement(OverviewWidgets, { isLiveMode }),
          React.createElement('div', { className: 'charts-grid' },
            React.createElement(DistrictStatsChart, { isLiveMode }),
            React.createElement(CategoryBreakdownChart, { isLiveMode })
          )
        );
      case 'fines':
        return React.createElement(FinesList, { isLiveMode });
      case 'officers':
        return React.createElement(OfficersList, { isLiveMode });
      case 'categories':
        return React.createElement(CategoriesList, { isLiveMode });
      default:
        return React.createElement('div', null, 'View Not Found');
    }
  };

  return React.createElement(DashboardLayout, {
    currentView,
    setCurrentView,
    isLiveMode,
    onToggleLiveMode: handleToggleLiveMode,
    onLogout: handleLogout
  }, renderViewContent());
}
