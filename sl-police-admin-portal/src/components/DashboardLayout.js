
export default function DashboardLayout({ currentView, setCurrentView, isLiveMode, onToggleLiveMode, onLogout, children }) {
  // Determine view title
  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Command Center Overview';
      case 'fines': return 'Fines & Payments Database';
      case 'officers': return 'Traffic Police Officers Registry';
      case 'categories': return 'Fine Categories Configuration';
      default: return 'SL Police Administration';
    }
  };

  return (
    React.createElement('div', { className: 'dashboard-wrapper' },
      
      // Fixed Sidebar Navigation
      React.createElement('aside', { className: 'sidebar' },
        React.createElement('div', { className: 'sidebar-brand' },
                    React.createElement('img', { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0lrdzQWrLJUaaNjKeMlPaWDiIKq8L15BeRqm2848C2g&s=10', alt: 'Police Icon', className: 'police-icon' }),
          React.createElement('span', null, 'SL POLICE ADMIN')
        ),
        
        React.createElement('nav', { className: 'sidebar-nav' },
          // Navigation Link: Dashboard Overview
          React.createElement('a', {
            className: `sidebar-nav-item ${currentView === 'dashboard' ? 'active' : ''}`,
            onClick: () => setCurrentView('dashboard')
          },
            React.createElement('i', { className: 'fa-solid fa-chart-line' }),
            React.createElement('span', null, 'Dashboard')
          ),

          // Navigation Link: Fines List
          React.createElement('a', {
            className: `sidebar-nav-item ${currentView === 'fines' ? 'active' : ''}`,
            onClick: () => setCurrentView('fines')
          },
            React.createElement('i', { className: 'fa-solid fa-receipt' }),
            React.createElement('span', null, 'Fines Management')
          ),

          // Navigation Link: Officers Registry
          React.createElement('a', {
            className: `sidebar-nav-item ${currentView === 'officers' ? 'active' : ''}`,
            onClick: () => setCurrentView('officers')
          },
            React.createElement('i', { className: 'fa-solid fa-user-shield' }),
            React.createElement('span', null, 'Officers Registry')
          ),

          // Navigation Link: Categories Setup
          React.createElement('a', {
            className: `sidebar-nav-item ${currentView === 'categories' ? 'active' : ''}`,
            onClick: () => setCurrentView('categories')
          },
            React.createElement('i', { className: 'fa-solid fa-sliders' }),
            React.createElement('span', null, 'Fine Categories')
          )
        ),
        
        // Sidebar Logout Button
        React.createElement('div', { className: 'sidebar-footer' },
          React.createElement('button', {
            className: 'btn btn-secondary',
            style: { width: '100%', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#f43f5e' },
            onClick: onLogout
          },
            React.createElement('i', { className: 'fa-solid fa-right-from-bracket' }),
            React.createElement('span', null, 'Log Out')
          )
        )
      ),

      // Main Content Area
      React.createElement('main', { className: 'main-content' },
        
        // Dynamic Header
        React.createElement('header', { className: 'header' },
          React.createElement('h2', { className: 'header-title' }, getViewTitle()),
          
          React.createElement('div', { className: 'header-actions' },
            
            // Gateway Live API Toggle
            React.createElement('div', { className: 'toggle-container' },
              React.createElement('span', { className: 'toggle-label', style: { color: isLiveMode ? 'var(--accent-emerald)' : 'var(--text-muted)' } }, 
                isLiveMode ? 'Live Gateway API' : 'Mock Simulator'
              ),
              React.createElement('label', { className: 'toggle-switch' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: isLiveMode,
                  onChange: (e) => onToggleLiveMode(e.target.checked)
                }),
                React.createElement('span', { className: 'toggle-slider' })
              )
            ),

            // Logged in User Badge
            React.createElement('div', { className: 'user-badge' },
              React.createElement('div', { className: 'user-avatar' }, 'SP'),
              React.createElement('span', { className: 'user-name' }, 'Senior Official')
            )
          )
        ),

        // Render Page View Body
        children
      )
    )
  );
}
