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

// Mock implementation of API endpoints
export const validateFine = async (
  referenceNumber: string,
  categoryId: string,
  officerBadge: string
): Promise<FineValidationResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (referenceNumber && categoryId && officerBadge) {
        resolve({
          amount: 1500,
          categoryName: 'Speeding',
          isAlreadyPaid: false,
        });
      } else {
        reject(new Error('Missing required fields'));
      }
    }, 1000);
  });
};

export const processPayment = async (
  paymentData: PaymentSubmission
): Promise<PaymentResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (paymentData.referenceNumber) {
        resolve({
          success: true,
          receiptNumber: `REC-${Math.floor(Math.random() * 1000000)}`,
        });
      } else {
        reject(new Error('Payment failed'));
      }
    }, 1500);
  });
};
