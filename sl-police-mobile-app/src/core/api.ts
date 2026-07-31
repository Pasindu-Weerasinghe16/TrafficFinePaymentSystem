export interface FineValidationResult {
  amount: number;
  categoryName: string;
  isAlreadyPaid: boolean;
}

export interface PaymentSubmission {
  referenceNumber: string;
  categoryId: string;
  officerBadgeNumber: string;
  location: string;
  paymentDetails: any;
}

export interface PaymentResult {
  success: boolean;
  receiptNumber: string;
}

const API_BASE_URL = 'http://localhost:8089/api';

export const validateFine = async (
  referenceNumber: string,
  categoryId: string,
  officerBadge: string
): Promise<FineValidationResult> => {
  const response = await fetch(
    `${API_BASE_URL}/fines/validate?referenceNumber=${encodeURIComponent(referenceNumber)}&categoryId=${encodeURIComponent(categoryId)}&officerBadge=${encodeURIComponent(officerBadge)}`
  );
  if (!response.ok) {
    throw new Error(await response.text() || 'Failed to validate fine');
  }
  return response.json();
};

export const processPayment = async (
  paymentData: PaymentSubmission
): Promise<PaymentResult> => {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  });
  if (!response.ok) {
    throw new Error(await response.text() || 'Payment failed');
  }
  return response.json();
};
