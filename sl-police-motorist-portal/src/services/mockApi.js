/**
 * Mock API Service
 * 
 * This module provides hardcoded JSON mocks that exactly match the structure
 * defined in docs/plan/api_endpoints.md.
 * 
 * As per the STRICT DEVELOPMENT RULES (rules.md):
 * - DO NOT connect to localhost:8080 or the Gateway.
 * - Use hardcoded JSON mocks until Dev 1 officially announces the Gateway is ready.
 * 
 * To switch to live API calls later, replace these functions with real HTTP requests
 * to the Gateway URL.
 */

// Simulates network delay for realistic UX
const simulateDelay = (ms = 1200) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock fine categories for reference
const FINE_CATEGORIES = {
  1: { name: 'Speeding', amount: 1500 },
  2: { name: 'Illegal Parking', amount: 1000 },
  3: { name: 'Running Red Light', amount: 2500 },
  4: { name: 'Driving Without License', amount: 3000 },
  5: { name: 'Reckless Driving', amount: 5000 },
  6: { name: 'Using Mobile While Driving', amount: 2000 },
  7: { name: 'Not Wearing Seatbelt', amount: 750 },
  8: { name: 'Overloading', amount: 1500 },
};

// Mock already-paid reference numbers
const PAID_REFERENCES = ['REF-99999', 'REF-00001'];

/**
 * Validate a traffic fine by reference number, category ID, and officer badge.
 * 
 * Endpoint: GET /api/fines/validate?referenceNumber={ref}&categoryId={id}&officerBadge={badge}
 * Response: { amount, categoryName, isAlreadyPaid }
 */
export async function validateFine(referenceNumber, categoryId, officerBadge) {
  await simulateDelay(1500);

  const catId = parseInt(categoryId, 10);
  const category = FINE_CATEGORIES[catId];

  // Simulate: unknown category
  if (!category) {
    throw new Error('Invalid fine category. Please check the Category ID on your ticket.');
  }

  // Simulate: badge validation (any badge with format OFC-XXXX is valid)
  if (!officerBadge || officerBadge.trim().length < 3) {
    throw new Error('Invalid Officer Badge Number. Please verify the badge number on your ticket.');
  }

  const isAlreadyPaid = PAID_REFERENCES.includes(referenceNumber.toUpperCase());

  return {
    amount: category.amount,
    categoryName: category.name,
    isAlreadyPaid,
    referenceNumber: referenceNumber.toUpperCase(),
    officerBadge: officerBadge.toUpperCase(),
    categoryId: catId,
  };
}

/**
 * Process a fine payment.
 * 
 * Endpoint: POST /api/payments
 * Body: { referenceNumber, categoryId, officerBadgeNumber, location, paymentDetails }
 * Response: { success, receiptNumber }
 */
export async function processPayment(paymentData) {
  await simulateDelay(2000);

  // Generate a mock receipt number
  const receiptNumber = `RCP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return {
    success: true,
    receiptNumber,
    timestamp: new Date().toISOString(),
    amount: paymentData.amount,
    referenceNumber: paymentData.referenceNumber,
    categoryName: paymentData.categoryName,
    officerBadge: paymentData.officerBadge,
    smsSent: true,
  };
}
