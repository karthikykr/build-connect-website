// Payment utility functions and types

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  name: string;
  description: string;
  processingFee: number;
  isActive: boolean;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  paymentMethodId: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  error?: string;
  redirectUrl?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: 'monthly' | 'yearly';
  features: string[];
  limits: {
    properties: number | 'unlimited';
    contacts: number | 'unlimited';
    support: string;
    analytics: boolean;
    verification: boolean;
    commission: number;
  };
  popular?: boolean;
}

export interface Transaction {
  id: string;
  type: 'payment' | 'commission' | 'subscription' | 'refund' | 'withdrawal';
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  description: string;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, any>;
}

// Payment gateway configurations
export const PAYMENT_GATEWAYS = {
  RAZORPAY: {
    name: 'Razorpay',
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  },
  STRIPE: {
    name: 'Stripe',
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  PAYU: {
    name: 'PayU',
    merchantKey: process.env.PAYU_MERCHANT_KEY,
    merchantSalt: process.env.PAYU_MERCHANT_SALT,
  },
};

// Commission calculation utilities
export const calculateCommission = (
  saleAmount: number,
  commissionRate: number,
  platformFee: number = 0.5
): {
  grossCommission: number;
  platformFee: number;
  netCommission: number;
  gst: number;
  totalDeduction: number;
  finalAmount: number;
} => {
  const grossCommission = (saleAmount * commissionRate) / 100;
  const platformFeeAmount = (grossCommission * platformFee) / 100;
  const gst = (grossCommission * 18) / 100; // 18% GST
  const totalDeduction = platformFeeAmount + gst;
  const netCommission = grossCommission - totalDeduction;
  
  return {
    grossCommission,
    platformFee: platformFeeAmount,
    netCommission,
    gst,
    totalDeduction,
    finalAmount: netCommission,
  };
};

// Currency formatting
export const formatCurrency = (
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Payment method validation
export const validatePaymentMethod = (
  type: string,
  details: Record<string, any>
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  switch (type) {
    case 'card':
      if (!details.number || details.number.length < 13) {
        errors.push('Invalid card number');
      }
      if (!details.expiry || !/^\d{2}\/\d{2}$/.test(details.expiry)) {
        errors.push('Invalid expiry date (MM/YY)');
      }
      if (!details.cvv || details.cvv.length < 3) {
        errors.push('Invalid CVV');
      }
      if (!details.name || details.name.trim().length < 2) {
        errors.push('Invalid cardholder name');
      }
      break;

    case 'upi':
      if (!details.upiId || !/^[\w.-]+@[\w.-]+$/.test(details.upiId)) {
        errors.push('Invalid UPI ID');
      }
      break;

    case 'netbanking':
      if (!details.bankCode) {
        errors.push('Please select a bank');
      }
      break;

    case 'wallet':
      if (!details.walletType) {
        errors.push('Please select a wallet');
      }
      break;

    default:
      errors.push('Invalid payment method');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Generate payment reference
export const generatePaymentReference = (prefix: string = 'PAY'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

// Payment status helpers
export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
    case 'paid':
      return 'text-success';
    case 'pending':
    case 'processing':
      return 'text-warning';
    case 'failed':
    case 'cancelled':
      return 'text-error';
    default:
      return 'text-text-secondary';
  }
};

export const getPaymentStatusBadge = (status: string): string => {
  switch (status) {
    case 'completed':
    case 'paid':
      return 'bg-success/10 text-success';
    case 'pending':
    case 'processing':
      return 'bg-warning/10 text-warning';
    case 'failed':
    case 'cancelled':
      return 'bg-error/10 text-error';
    default:
      return 'bg-gray-light text-text-secondary';
  }
};

// Subscription utilities
export const calculateSubscriptionDiscount = (
  monthlyPrice: number,
  yearlyPrice: number
): number => {
  const yearlyEquivalent = monthlyPrice * 12;
  return Math.round(((yearlyEquivalent - yearlyPrice) / yearlyEquivalent) * 100);
};

export const getNextBillingDate = (
  currentDate: Date,
  billingCycle: 'monthly' | 'yearly'
): Date => {
  const nextDate = new Date(currentDate);
  
  if (billingCycle === 'monthly') {
    nextDate.setMonth(nextDate.getMonth() + 1);
  } else {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  }
  
  return nextDate;
};

// Tax calculations
export const calculateTax = (
  amount: number,
  taxRate: number = 18,
  includesTax: boolean = false
): {
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
} => {
  if (includesTax) {
    const baseAmount = amount / (1 + taxRate / 100);
    const taxAmount = amount - baseAmount;
    return {
      baseAmount,
      taxAmount,
      totalAmount: amount,
    };
  } else {
    const taxAmount = (amount * taxRate) / 100;
    const totalAmount = amount + taxAmount;
    return {
      baseAmount: amount,
      taxAmount,
      totalAmount,
    };
  }
};

// Payment gateway integration helpers
export const initializeRazorpay = (options: any) => {
  if (typeof window !== 'undefined' && (window as any).Razorpay) {
    return new (window as any).Razorpay(options);
  }
  throw new Error('Razorpay SDK not loaded');
};

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    } else {
      resolve(false);
    }
  });
};

// Error handling
export class PaymentError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

export const handlePaymentError = (error: any): PaymentError => {
  if (error instanceof PaymentError) {
    return error;
  }

  // Handle different types of payment errors
  if (error.code === 'PAYMENT_CANCELLED') {
    return new PaymentError('Payment was cancelled by user', 'PAYMENT_CANCELLED');
  }

  if (error.code === 'INSUFFICIENT_FUNDS') {
    return new PaymentError('Insufficient funds in account', 'INSUFFICIENT_FUNDS');
  }

  if (error.code === 'INVALID_CARD') {
    return new PaymentError('Invalid card details', 'INVALID_CARD');
  }

  if (error.code === 'NETWORK_ERROR') {
    return new PaymentError('Network error occurred', 'NETWORK_ERROR');
  }

  // Generic error
  return new PaymentError(
    error.message || 'An unexpected payment error occurred',
    'UNKNOWN_ERROR',
    error
  );
};
