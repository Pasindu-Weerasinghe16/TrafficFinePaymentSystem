import './PaymentConfirmation.css';

/**
 * PaymentConfirmation Component
 * Displays success message with receipt details after payment.
 */
export default function PaymentConfirmation({ receiptData, onNewPayment }) {
  if (!receiptData) return null;

  return (
    <div className="confirmation" id="payment-confirmation">
      <div className="confirmation__check-wrapper">
        <div className="confirmation__check-circle">
          <svg className="confirmation__check-svg" viewBox="0 0 52 52">
            <circle className="confirmation__check-bg" cx="26" cy="26" r="25" fill="none" />
            <path className="confirmation__check-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
      </div>

      <h2 className="confirmation__title">Payment Successful!</h2>
      <p className="confirmation__subtitle">
        Your traffic fine has been paid. An SMS notification has been sent to the issuing officer.
      </p>

      <div className="confirmation__receipt" id="payment-receipt">
        <div className="confirmation__receipt-header">
          <span className="confirmation__receipt-label">Receipt</span>
          <span className="confirmation__receipt-number" id="receipt-number">{receiptData.receiptNumber}</span>
        </div>

        <div className="confirmation__receipt-rows">
          <div className="confirmation__receipt-row">
            <span>Reference</span>
            <span className="confirmation__receipt-value">{receiptData.referenceNumber}</span>
          </div>
          <div className="confirmation__receipt-row">
            <span>Violation</span>
            <span className="confirmation__receipt-value">{receiptData.categoryName}</span>
          </div>
          <div className="confirmation__receipt-row">
            <span>Officer Badge</span>
            <span className="confirmation__receipt-value">{receiptData.officerBadge}</span>
          </div>
          <div className="confirmation__receipt-row">
            <span>Amount Paid</span>
            <span className="confirmation__receipt-value confirmation__receipt-value--amount">
              Rs. {receiptData.amount.toLocaleString()}
            </span>
          </div>
          <div className="confirmation__receipt-row">
            <span>Date & Time</span>
            <span className="confirmation__receipt-value">
              {new Date(receiptData.timestamp).toLocaleString()}
            </span>
          </div>
          <div className="confirmation__receipt-row">
            <span>SMS Notification</span>
            <span className="confirmation__receipt-value confirmation__receipt-value--sms">
              ✓ Sent to Officer
            </span>
          </div>
        </div>
      </div>

      <div className="confirmation__info">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <p>You may now visit your local police station to retrieve your license. The officer has been notified via SMS.</p>
      </div>

      <div className="confirmation__actions">
        <button className="btn btn--outline btn--lg" onClick={() => window.print()} id="print-receipt-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print Receipt
        </button>
        <button className="btn btn--primary btn--lg" onClick={onNewPayment} id="new-payment-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Pay Another Fine
        </button>
      </div>
    </div>
  );
}
