import { apiClient } from './apiClient';

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

export const validateFine = async (
  referenceNumber: string,
  categoryId: string,
  officerBadge: string
): Promise<FineValidationResult> => {
  const url = `${apiClient.baseUrl}/fines/validate?referenceNumber=${encodeURIComponent(referenceNumber)}&categoryId=${encodeURIComponent(categoryId)}&officerBadge=${encodeURIComponent(officerBadge)}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to validate fine');
  }
  
  return response.json();
};

export const processPayment = async (
  paymentData: PaymentSubmission
): Promise<PaymentResult> => {
  const response = await fetch(`${apiClient.baseUrl}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });
  
  if (!response.ok) {
    throw new Error('Payment failed');
  }
  
  return response.json();
};
