import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <span className="footer__logo-text">SL Police</span>
          <span className="footer__tagline">Traffic Fine Payment System</span>
        </div>
        <div className="footer__info">
          <p className="footer__text">
            © {new Date().getFullYear()} Sri Lanka Police Department. All rights reserved.
          </p>
          <p className="footer__text footer__text--muted">
            Secure online payment portal for traffic violation fines.
          </p>
        </div>
      </div>
    </footer>
  );
}
