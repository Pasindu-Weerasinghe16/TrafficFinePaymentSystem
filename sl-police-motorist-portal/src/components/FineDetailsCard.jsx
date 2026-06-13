import './FineDetailsCard.css';

/**
 * FineDetailsCard Component
 * 
 * Displays validated fine details including amount, category, reference, and officer badge.
 * Shows a warning if the fine is already paid, or a CTA to proceed to payment.
 */
export default function FineDetailsCard({ fineData, onProceedToPayment, onReset }) {
  if (!fineData) return null;

  const { amount, categoryName, isAlreadyPaid, referenceNumber, officerBadge } = fineData;

  return (
    <div className="fine-card" id="fine-details-card">
      <div className="fine-card__status-bar">
        {isAlreadyPaid ? (
          <span className="fine-card__badge fine-card__badge--paid" id="fine-status-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Already Paid
          </span>
        ) : (
          <span className="fine-card__badge fine-card__badge--pending" id="fine-status-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Payment Required
          </span>
        )}
      </div>

      <div className="fine-card__header">
        <span className="fine-card__category">{categoryName}</span>
        <div className="fine-card__amount-wrapper">
          <span className="fine-card__currency">Rs.</span>
          <span className="fine-card__amount">{amount.toLocaleString()}</span>
        </div>
      </div>

      <div className="fine-card__details">
        <div className="fine-card__detail-row">
          <span className="fine-card__detail-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Reference
          </span>
          <span className="fine-card__detail-value" id="fine-reference-value">{referenceNumber}</span>
        </div>
        <div className="fine-card__detail-row">
          <span className="fine-card__detail-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Officer Badge
          </span>
          <span className="fine-card__detail-value" id="fine-officer-value">{officerBadge}</span>
        </div>
        <div className="fine-card__detail-row">
          <span className="fine-card__detail-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
            Violation
          </span>
          <span className="fine-card__detail-value" id="fine-category-value">{categoryName}</span>
        </div>
      </div>

      {isAlreadyPaid ? (
        <div className="fine-card__paid-notice" id="fine-already-paid-notice">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div>
            <p className="fine-card__paid-title">This fine has already been paid</p>
            <p className="fine-card__paid-text">
              No further action is needed. If you believe this is an error, please contact your local police station.
            </p>
          </div>
        </div>
      ) : (
        <div className="fine-card__actions">
          <button
            className="btn btn--primary btn--lg btn--full"
            onClick={onProceedToPayment}
            id="proceed-to-payment-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Proceed to Payment
          </button>
        </div>
      )}

      <button
        className="fine-card__reset-btn"
        onClick={onReset}
        id="search-again-btn"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
        Search Again
      </button>
    </div>
  );
}
