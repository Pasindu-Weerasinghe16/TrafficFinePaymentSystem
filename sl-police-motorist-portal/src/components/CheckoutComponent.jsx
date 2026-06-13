import { useState } from 'react';
import './CheckoutComponent.css';

/**
 * CheckoutComponent
 * Handles payment processing UI with card details form.
 */
export default function CheckoutComponent({ fineData, onPayment, onBack, isLoading }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCard = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const isValid = cardNumber.replace(/\s/g, '').length === 16 &&
    cardHolder.trim().length >= 3 &&
    expiry.length === 5 &&
    cvv.length >= 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || isLoading) return;
    onPayment({
      ...fineData,
      paymentDetails: {
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardHolder,
        expiry,
      },
      location: 'Online - Web Portal',
    });
  };

  return (
    <div className="checkout" id="checkout-component">
      <button className="checkout__back" onClick={onBack} disabled={isLoading} id="checkout-back-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Details
      </button>

      <div className="checkout__summary">
        <div className="checkout__summary-row">
          <span>{fineData.categoryName}</span>
          <span className="checkout__summary-ref">{fineData.referenceNumber}</span>
        </div>
        <div className="checkout__summary-amount">
          <span>Total</span>
          <span className="checkout__total">Rs. {fineData.amount.toLocaleString()}</span>
        </div>
      </div>

      <form className="checkout__form" onSubmit={handleSubmit}>
        <h3 className="checkout__form-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Secure Payment
        </h3>

        <div className="form-group">
          <label className="form-label" htmlFor="card-number">Card Number</label>
          <input id="card-number" className="form-input" type="text" placeholder="1234 5678 9012 3456"
            value={cardNumber} onChange={(e) => setCardNumber(formatCard(e.target.value))}
            required disabled={isLoading} autoComplete="cc-number" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="card-holder">Cardholder Name</label>
          <input id="card-holder" className="form-input" type="text" placeholder="JOHN DOE"
            value={cardHolder} onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
            required disabled={isLoading} autoComplete="cc-name" />
        </div>

        <div className="checkout__row">
          <div className="form-group">
            <label className="form-label" htmlFor="card-expiry">Expiry</label>
            <input id="card-expiry" className="form-input" type="text" placeholder="MM/YY"
              value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              required disabled={isLoading} autoComplete="cc-exp" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="card-cvv">CVV</label>
            <input id="card-cvv" className="form-input" type="password" placeholder="•••" maxLength={4}
              value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              required disabled={isLoading} autoComplete="cc-csc" />
          </div>
        </div>

        <button type="submit" className="btn btn--primary btn--lg btn--full checkout__pay-btn"
          disabled={!isValid || isLoading} id="pay-now-btn">
          {isLoading ? (
            <><span className="btn__spinner"></span>Processing Payment...</>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Pay Rs. {fineData.amount.toLocaleString()} Now
            </>
          )}
        </button>

        <p className="checkout__secure-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          256-bit SSL encrypted. Your payment details are secure.
        </p>
      </form>
    </div>
  );
}
