import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="header" id="main-header">
      <div className="header__inner container">
        <div className="header__brand" onClick={() => navigate('/')} role="button" tabIndex={0} id="header-brand-link">
          <div className="header__logo">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="header__logo-svg">
              <rect width="40" height="40" rx="10" fill="url(#logo-gradient)" />
              <path d="M12 28V14L20 10L28 14V28L20 24L12 28Z" fill="white" fillOpacity="0.9" />
              <path d="M20 10V24" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="#2563eb" />
                  <stop offset="1" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="header__brand-text">
            <span className="header__title">SL Police</span>
            <span className="header__subtitle">Traffic Fine Portal</span>
          </div>
        </div>

        <nav className="header__nav" id="main-nav">
          <button
            className={`header__nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => navigate('/')}
            id="nav-home"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </button>
          <button
            className={`header__nav-link ${location.pathname === '/pay' ? 'active' : ''}`}
            onClick={() => navigate('/pay')}
            id="nav-pay-fine"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Pay Fine
          </button>
        </nav>
      </div>
    </header>
  );
}
