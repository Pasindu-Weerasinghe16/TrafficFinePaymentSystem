import { apiRequest } from './apiClient';

export interface FineValidationResult {
  amount: number;
  categoryName: string;
  isAlreadyPaid: boolean;
}

export interface PaymentSubmission {
  referenceNumber: string;
  categoryId: number;
  officerBadgeNumber: string;
  location: string;
  paymentDetails: {
    method: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
  };
}

export interface PaymentResult {
  success: boolean;
  receiptNumber: string;
  message?: string;
}

export const validateFine = async (
  referenceNumber: string,
  categoryId: number,
  officerBadge: string
): Promise<FineValidationResult> => {
  const query = [
    `referenceNumber=${encodeURIComponent(referenceNumber)}`,
    `categoryId=${encodeURIComponent(String(categoryId))}`,
    `officerBadge=${encodeURIComponent(officerBadge)}`,
  ].join('&');

  return apiRequest<FineValidationResult>(`/api/fines/validate?${query}`);
};

export const processPayment = async (
  paymentData: PaymentSubmission
): Promise<PaymentResult> => {
  return apiRequest<PaymentResult>('/api/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });
};
