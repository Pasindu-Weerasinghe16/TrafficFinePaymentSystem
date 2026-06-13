import { useState } from 'react';
import SearchFineForm from '../components/SearchFineForm';
import FineDetailsCard from '../components/FineDetailsCard';
import CheckoutComponent from '../components/CheckoutComponent';
import PaymentConfirmation from '../components/PaymentConfirmation';
import { validateFine, processPayment } from '../services/mockApi';
import './PayFinePage.css';

/**
 * PayFinePage
 *
 * Orchestrates the full fine payment flow:
 * 1. Search / Validate fine
 * 2. View fine details
 * 3. Checkout with payment
 * 4. Payment confirmation
 */
export default function PayFinePage() {
  const [step, setStep] = useState('search'); // search | details | checkout | confirmation
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fineData, setFineData] = useState(null);
  const [receiptData, setReceiptData] = useState(null);

  const handleSearch = async ({ referenceNumber, categoryId, officerBadge }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await validateFine(referenceNumber, categoryId, officerBadge);
      setFineData(result);
      setStep('details');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    setStep('checkout');
  };

  const handlePayment = async (paymentData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await processPayment(paymentData);
      setReceiptData(result);
      setStep('confirmation');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('search');
    setFineData(null);
    setReceiptData(null);
    setError(null);
  };

  const handleBackToDetails = () => {
    setStep('details');
  };

  return (
    <main className="pay-page" id="pay-fine-page">
      <div className="bg-gradient-mesh"></div>
      <div className="container pay-page__inner">
        {/* Progress Steps */}
        <div className="progress-bar" id="payment-progress">
          {['Search', 'Details', 'Payment', 'Done'].map((label, i) => {
            const stepNames = ['search', 'details', 'checkout', 'confirmation'];
            const currentIndex = stepNames.indexOf(step);
            const isCompleted = i < currentIndex;
            const isActive = i === currentIndex;
            return (
              <div className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`} key={label}>
                <div className="progress-step__circle">
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span className="progress-step__label">{label}</span>
                {i < 3 && <div className="progress-step__line"></div>}
              </div>
            );
          })}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-banner" id="error-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <span>{error}</span>
            <button className="error-banner__close" onClick={() => setError(null)} aria-label="Close error">✕</button>
          </div>
        )}

        {/* Step Content */}
        <div className="pay-page__content">
          {step === 'search' && (
            <SearchFineForm onSearch={handleSearch} isLoading={isLoading} />
          )}
          {step === 'details' && (
            <FineDetailsCard fineData={fineData} onProceedToPayment={handleProceedToPayment} onReset={handleReset} />
          )}
          {step === 'checkout' && (
            <CheckoutComponent fineData={fineData} onPayment={handlePayment} onBack={handleBackToDetails} isLoading={isLoading} />
          )}
          {step === 'confirmation' && (
            <PaymentConfirmation receiptData={receiptData} onNewPayment={handleReset} />
          )}
        </div>
      </div>
    </main>
  );
}
