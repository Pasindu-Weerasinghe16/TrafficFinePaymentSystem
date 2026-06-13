import './TicketHelpModal.css';

export default function TicketHelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        <div className="modal-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <h3 className="modal-title">Locating Your Details</h3>
        </div>
        <p className="modal-desc">Refer to the yellow paper traffic fine ticket (Spot Fine) issued by the officer.</p>
        
        <div className="ticket-mockup">
          <div className="ticket-mockup__header">
            SRI LANKA POLICE<br/>
            <span>TRAFFIC OFFENSE TICKET</span>
          </div>
          <div className="ticket-mockup__body">
            <div className="ticket-mockup__row highlight highlight--ref">
              <span className="ticket-mockup__label">Reference No:</span> 
              <span className="ticket-mockup__val">REF-12345</span>
            </div>
            <div className="ticket-mockup__divider"></div>
            <div className="ticket-mockup__row">
              <span className="ticket-mockup__label">Date:</span> 
              <span className="ticket-mockup__val">2026-06-13</span>
            </div>
            <div className="ticket-mockup__row highlight highlight--cat">
              <span className="ticket-mockup__label">Offense Category ID:</span> 
              <span className="ticket-mockup__val">01 - Speeding</span>
            </div>
            <div className="ticket-mockup__divider"></div>
            <div className="ticket-mockup__row highlight highlight--badge">
              <span className="ticket-mockup__label">Officer Badge No:</span> 
              <span className="ticket-mockup__val">OFC-4521</span>
            </div>
          </div>
        </div>
        
        <div className="modal-legend">
          <div className="legend-item">
            <span className="legend-color legend-color--ref"></span> 
            <span><strong>Reference Number:</strong> Usually found at the top right of the ticket.</span>
          </div>
          <div className="legend-item">
            <span className="legend-color legend-color--cat"></span> 
            <span><strong>Category ID:</strong> A number (1-8) matching the traffic violation committed.</span>
          </div>
          <div className="legend-item">
            <span className="legend-color legend-color--badge"></span> 
            <span><strong>Officer Badge:</strong> Found near the officer's signature at the bottom.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
