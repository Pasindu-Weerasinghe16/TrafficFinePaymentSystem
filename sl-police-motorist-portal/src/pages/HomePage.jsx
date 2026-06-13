import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  const categories = [
    { id: 1, name: 'Speeding', amount: 1500, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
    { id: 2, name: 'Illegal Parking', amount: 1000, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 22V2h4a5 5 0 0 1 0 10H9"/></svg> },
    { id: 3, name: 'Running Red Light', amount: 2500, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg> },
    { id: 4, name: 'No License', amount: 3000, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
  ];

  const faqs = [
    {
      q: 'How long do I have to pay my fine?',
      a: 'You generally have 14 days from the date of issue to settle your traffic fine. Failure to do so may result in additional late fees or a court summons.'
    },
    {
      q: 'What happens to my physical driver\'s license?',
      a: 'When an officer issues a paper fine, they may hold your license. Once you pay online, an SMS is sent to the officer immediately. You can then visit the police station to retrieve your license.'
    },
    {
      q: 'Is this payment portal secure?',
      a: 'Yes. All payments are processed through a 256-bit SSL encrypted secure gateway. We do not store your credit card information.'
    },
    {
      q: 'Can I pay a fine that was issued in another district?',
      a: 'Absolutely. This is the centralized national portal. You can pay fines issued anywhere in Sri Lanka, provided you have the Reference Number, Category ID, and Officer Badge Number.'
    }
  ];

  return (
    <main className="home" id="home-page">
      <div className="bg-gradient-mesh"></div>

      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="container hero__inner">
          <div className="hero__content">
            <div className="hero__badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Official Government Portal
            </div>
            <h1 className="hero__title">
              Pay Your Traffic Fines <span className="hero__title-accent">Online</span>
            </h1>
            <p className="hero__desc">
              Lost your license to a traffic fine? Pay it conveniently from home and retrieve your license from the police station instantly.
            </p>
            <div className="hero__actions">
              <button className="btn btn--primary btn--lg hero__cta" onClick={() => navigate('/pay')} id="hero-pay-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Pay Fine Now
              </button>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__card-preview">
              <div className="hero__card-top">
                <span className="hero__card-dot"></span>
                <span className="hero__card-dot hero__card-dot--2"></span>
                <span className="hero__card-dot hero__card-dot--3"></span>
              </div>
              <div className="hero__card-line hero__card-line--1"></div>
              <div className="hero__card-line hero__card-line--2"></div>
              <div className="hero__card-line hero__card-line--3"></div>
              <div className="hero__card-btn-preview"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="steps-section" id="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-desc">Pay your traffic fine in three simple steps</p>
          <div className="steps">
            {[
              { num: '01', title: 'Enter Fine Details', desc: 'Type in the Reference Number, Category ID, and Officer Badge Number from your paper ticket.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
              { num: '02', title: 'Verify & Review', desc: 'The system validates your fine and displays the amount due. Review the details before proceeding.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
              { num: '03', title: 'Make Payment', desc: 'Complete the payment securely. An SMS is sent to the officer, and you can retrieve your license.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
            ].map((step) => (
              <div className="step-card" key={step.num}>
                <div className="step-card__num">{step.num}</div>
                <div className="step-card__icon">
                  {step.icon}
                </div>
                <h3 className="step-card__title">{step.title}</h3>
                <p className="step-card__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Fine Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-header">
            <div>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Common Violations</h2>
              <p className="section-desc" style={{ textAlign: 'left', marginBottom: '0' }}>Standard fine rates for frequent traffic offenses.</p>
            </div>
            <button className="btn btn-outline" onClick={() => navigate('/pay')}>View All</button>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <div className="category-card" key={cat.id}>
                <div className="category-card__icon">
                  {cat.icon}
                </div>
                <div className="category-card__content">
                  <span className="category-card__id">Category {cat.id}</span>
                  <h4 className="category-card__name">{cat.name}</h4>
                </div>
                <div className="category-card__amount">Rs. {cat.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section" id="info-section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-card__icon info-card__icon--blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h3 className="info-card__title">Secure Payments</h3>
              <p className="info-card__desc">256-bit SSL encryption protects all transactions end-to-end.</p>
            </div>
            <div className="info-card">
              <div className="info-card__icon info-card__icon--green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <h3 className="info-card__title">Instant SMS Alert</h3>
              <p className="info-card__desc">Officers are notified via SMS the moment your payment is confirmed.</p>
            </div>
            <div className="info-card">
              <div className="info-card__icon info-card__icon--purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3 className="info-card__title">24/7 Available</h3>
              <p className="info-card__desc">Pay your fines anytime, anywhere — no need to visit a police station.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-desc">Got questions? We've got answers.</p>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div className={`faq-item ${activeFaq === index ? 'faq-item--active' : ''}`} key={index}>
                <button className="faq-item__header" onClick={() => toggleFaq(index)}>
                  <span className="faq-item__q">{faq.q}</span>
                  <svg className="faq-item__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <div className="faq-item__body">
                  <div className="faq-item__content">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
