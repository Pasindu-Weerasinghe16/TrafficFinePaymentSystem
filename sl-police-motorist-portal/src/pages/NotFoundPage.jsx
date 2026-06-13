import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="not-found" id="not-found-page">
      <div className="bg-gradient-mesh"></div>
      <div className="container not-found__inner">
        <div className="not-found__content">
          <div className="not-found__icon-wrapper">
            <svg className="not-found__icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h1 className="not-found__title">404</h1>
          <h2 className="not-found__subtitle">Page Not Found</h2>
          <p className="not-found__desc">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="not-found__actions">
            <button className="btn btn--primary btn--lg" onClick={() => navigate('/')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Back to Home
            </button>
            <button className="btn not-found__btn-outline btn--lg" onClick={() => navigate('/pay')}>
              Pay a Fine
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
