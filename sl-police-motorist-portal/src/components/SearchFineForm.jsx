import { useState } from 'react';
import TicketHelpModal from './TicketHelpModal';
import './SearchFineForm.css';

/**
 * SearchFineForm Component
 * 
 * Accepts Reference Number, Category ID, and Officer Badge Number
 * as per the frontend architecture spec (docs/plan/frontend_architecture.md).
 */
export default function SearchFineForm({ onSearch, isLoading }) {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [officerBadge, setOfficerBadge] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!referenceNumber.trim() || !categoryId.trim() || !officerBadge.trim()) return;
    onSearch({ referenceNumber: referenceNumber.trim(), categoryId: categoryId.trim(), officerBadge: officerBadge.trim() });
  };

  return (
    <div className="search-form-wrapper" id="search-fine-form-section">
      <form className="search-form" onSubmit={handleSubmit} id="search-fine-form">
        <div className="search-form__header">
          <div className="search-form__icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <div>
            <h2 className="search-form__title">Look Up Your Fine</h2>
            <div className="search-form__desc-row">
              <p className="search-form__desc">Enter the details from your paper ticket to view and pay your fine.</p>
              <button type="button" className="search-form__help-link" onClick={() => setIsHelpOpen(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Where to find this?
              </button>
            </div>
          </div>
        </div>

        <div className="search-form__fields">
          <div className="form-group">
            <label className="form-label" htmlFor="reference-number">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Reference Number
            </label>
            <input
              id="reference-number"
              className="form-input"
              type="text"
              placeholder="e.g. REF-12345"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="off"
            />
            <span className="form-hint">The unique reference on your ticket</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category-id">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
              Category ID
            </label>
            <select
              id="category-id"
              className="form-input form-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="" disabled>Select violation category</option>
              <option value="1">1 — Speeding</option>
              <option value="2">2 — Illegal Parking</option>
              <option value="3">3 — Running Red Light</option>
              <option value="4">4 — Driving Without License</option>
              <option value="5">5 — Reckless Driving</option>
              <option value="6">6 — Using Mobile While Driving</option>
              <option value="7">7 — Not Wearing Seatbelt</option>
              <option value="8">8 — Overloading</option>
            </select>
            <span className="form-hint">Match the category on your paper ticket</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="officer-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Officer Badge Number
            </label>
            <input
              id="officer-badge"
              className="form-input"
              type="text"
              placeholder="e.g. OFC-4521"
              value={officerBadge}
              onChange={(e) => setOfficerBadge(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="off"
            />
            <span className="form-hint">The issuing officer's badge number</span>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn--primary btn--lg btn--full"
          disabled={isLoading || !referenceNumber.trim() || !categoryId || !officerBadge.trim()}
          id="search-fine-btn"
        >
          {isLoading ? (
            <>
              <span className="btn__spinner"></span>
              Validating Fine...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Search & Validate Fine
            </>
          )}
        </button>
      </form>
      
      <TicketHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
