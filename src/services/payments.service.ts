/**
 * Payments Service
 */

import { apiClient, ApiResponse } from '@/lib/api-client'

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_account' | 'upi' | 'wallet'
  provider: 'stripe' | 'razorpay' | 'payu' | 'phonepe' | 'gpay'
  details: {
    last4?: string
    brand?: string
    expiryMonth?: number
    expiryYear?: number
    bankName?: string
    accountType?: string
    upiId?: string
    walletProvider?: string
  }
  isDefault: boolean
  isVerified: boolean
  createdAt: string
}

export interface Transaction {
  id: string
  type: 'payment' | 'refund' | 'commission' | 'withdrawal'
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  description: string
  reference?: string
  paymentMethodId?: string
  propertyId?: string
  brokerId?: string
  metadata?: Record<string, any>
  createdAt: string
  completedAt?: string
  failureReason?: string
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  description: string
  clientSecret: string
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'cancelled'
  metadata?: Record<string, any>
}

export interface Subscription {
  id: string
  planId: string
  planName: string
  status: 'active' | 'inactive' | 'cancelled' | 'past_due'
  currentPeriodStart: string
  currentPeriodEnd: string
  amount: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  paymentMethodId?: string
}

export interface Commission {
  id: string
  brokerId: string
  propertyId: string
  transactionId: string
  amount: number
  rate: number
  status: 'pending' | 'paid' | 'disputed'
  dueDate: string
  paidAt?: string
  description: string
}

export interface CreatePaymentIntentRequest {
  amount: number
  currency: string
  description: string
  paymentMethodId?: string
  propertyId?: string
  brokerId?: string
  metadata?: Record<string, any>
}

export interface ProcessPaymentRequest {
  paymentIntentId: string
  paymentMethodId: string
  billingDetails?: {
    name: string
    email: string
    phone?: string
    address?: {
      line1: string
      line2?: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  }
}

class PaymentsService {
  /**
   * Get user's payment methods
   */
  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    return apiClient.get<PaymentMethod[]>('/payments/methods')
  }

  /**
   * Add new payment method
   */
  async addPaymentMethod(paymentMethod: {
    type: 'card' | 'bank_account' | 'upi'
    token: string // Payment provider token
    setAsDefault?: boolean
  }): Promise<ApiResponse<PaymentMethod>> {
    return apiClient.post<PaymentMethod>('/payments/methods', paymentMethod, {
      showSuccessToast: true,
      successMessage: 'Payment method added successfully.',
    })
  }

  /**
   * Update payment method
   */
  async updatePaymentMethod(id: string, updates: {
    isDefault?: boolean
    billingDetails?: Record<string, any>
  }): Promise<ApiResponse<PaymentMethod>> {
    return apiClient.patch<PaymentMethod>(`/payments/methods/${id}`, updates, {
      showSuccessToast: true,
      successMessage: 'Payment method updated successfully.',
    })
  }

  /**
   * Delete payment method
   */
  async deletePaymentMethod(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/payments/methods/${id}`, {
      showSuccessToast: true,
      successMessage: 'Payment method deleted successfully.',
    })
  }

  /**
   * Create payment intent
   */
  async createPaymentIntent(request: CreatePaymentIntentRequest): Promise<ApiResponse<PaymentIntent>> {
    return apiClient.post<PaymentIntent>('/payments/intents', request)
  }

  /**
   * Confirm payment intent
   */
  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string): Promise<ApiResponse<PaymentIntent>> {
    return apiClient.post<PaymentIntent>(`/payments/intents/${paymentIntentId}/confirm`, {
      paymentMethodId,
    })
  }

  /**
   * Process payment
   */
  async processPayment(request: ProcessPaymentRequest): Promise<ApiResponse<Transaction>> {
    return apiClient.post<Transaction>('/payments/process', request, {
      showSuccessToast: true,
      successMessage: 'Payment processed successfully.',
    })
  }

  /**
   * Get transaction history
   */
  async getTransactions(filters?: {
    type?: 'payment' | 'refund' | 'commission' | 'withdrawal'
    status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<{
    transactions: Transaction[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>> {
    return apiClient.get('/payments/transactions', {
      params: filters,
    })
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(id: string): Promise<ApiResponse<Transaction>> {
    return apiClient.get<Transaction>(`/payments/transactions/${id}`)
  }

  /**
   * Request refund
   */
  async requestRefund(transactionId: string, reason: string, amount?: number): Promise<ApiResponse<Transaction>> {
    return apiClient.post<Transaction>(`/payments/transactions/${transactionId}/refund`, {
      reason,
      amount,
    }, {
      showSuccessToast: true,
      successMessage: 'Refund request submitted successfully.',
    })
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats(dateRange?: {
    startDate: string
    endDate: string
  }): Promise<ApiResponse<{
    totalRevenue: number
    totalTransactions: number
    successfulPayments: number
    failedPayments: number
    averageTransactionValue: number
    revenueOverTime: Array<{
      date: string
      revenue: number
      transactions: number
    }>
    paymentMethodDistribution: Record<string, number>
    topProperties: Array<{
      propertyId: string
      propertyTitle: string
      revenue: number
      transactions: number
    }>
  }>> {
    return apiClient.get('/payments/stats', {
      params: dateRange,
    })
  }

  /**
   * Get subscription plans
   */
  async getSubscriptionPlans(): Promise<ApiResponse<Array<{
    id: string
    name: string
    description: string
    price: number
    currency: string
    interval: 'month' | 'year'
    features: string[]
    popular?: boolean
    trialDays?: number
  }>>> {
    return apiClient.get('/payments/subscription-plans')
  }

  /**
   * Subscribe to plan
   */
  async subscribeToPlan(planId: string, paymentMethodId: string): Promise<ApiResponse<Subscription>> {
    return apiClient.post<Subscription>('/payments/subscriptions', {
      planId,
      paymentMethodId,
    }, {
      showSuccessToast: true,
      successMessage: 'Subscription activated successfully.',
    })
  }

  /**
   * Get current subscription
   */
  async getCurrentSubscription(): Promise<ApiResponse<Subscription | null>> {
    return apiClient.get<Subscription | null>('/payments/subscriptions/current')
  }

  /**
   * Update subscription
   */
  async updateSubscription(subscriptionId: string, updates: {
    planId?: string
    paymentMethodId?: string
  }): Promise<ApiResponse<Subscription>> {
    return apiClient.patch<Subscription>(`/payments/subscriptions/${subscriptionId}`, updates, {
      showSuccessToast: true,
      successMessage: 'Subscription updated successfully.',
    })
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, reason?: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/payments/subscriptions/${subscriptionId}`, {
      data: { reason },
      showSuccessToast: true,
      successMessage: 'Subscription cancelled successfully.',
    })
  }

  /**
   * Get commission details (for brokers)
   */
  async getCommissions(filters?: {
    status?: 'pending' | 'paid' | 'disputed'
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<{
    commissions: Commission[]
    total: number
    totalAmount: number
    pendingAmount: number
    paidAmount: number
  }>> {
    return apiClient.get('/payments/commissions', {
      params: filters,
    })
  }

  /**
   * Request commission withdrawal
   */
  async requestCommissionWithdrawal(amount: number, bankAccountId: string): Promise<ApiResponse<Transaction>> {
    return apiClient.post<Transaction>('/payments/commissions/withdraw', {
      amount,
      bankAccountId,
    }, {
      showSuccessToast: true,
      successMessage: 'Withdrawal request submitted successfully.',
    })
  }

  /**
   * Get payment settings
   */
  async getPaymentSettings(): Promise<ApiResponse<{
    autoPayEnabled: boolean
    defaultPaymentMethodId?: string
    currency: string
    taxSettings: {
      gstNumber?: string
      panNumber?: string
      businessType?: string
    }
    notificationSettings: {
      emailNotifications: boolean
      smsNotifications: boolean
      paymentReminders: boolean
    }
  }>> {
    return apiClient.get('/payments/settings')
  }

  /**
   * Update payment settings
   */
  async updatePaymentSettings(settings: {
    autoPayEnabled?: boolean
    defaultPaymentMethodId?: string
    currency?: string
    taxSettings?: {
      gstNumber?: string
      panNumber?: string
      businessType?: string
    }
    notificationSettings?: {
      emailNotifications?: boolean
      smsNotifications?: boolean
      paymentReminders?: boolean
    }
  }): Promise<ApiResponse<void>> {
    return apiClient.patch('/payments/settings', settings, {
      showSuccessToast: true,
      successMessage: 'Payment settings updated successfully.',
    })
  }

  /**
   * Generate invoice
   */
  async generateInvoice(transactionId: string): Promise<ApiResponse<{
    invoiceUrl: string
    invoiceNumber: string
  }>> {
    return apiClient.post<{
      invoiceUrl: string
      invoiceNumber: string
    }>(`/payments/transactions/${transactionId}/invoice`)
  }

  /**
   * Verify payment status
   */
  async verifyPaymentStatus(paymentIntentId: string): Promise<ApiResponse<{
    status: string
    amount: number
    currency: string
    verified: boolean
  }>> {
    return apiClient.get(`/payments/verify/${paymentIntentId}`)
  }

  /**
   * Get payment analytics
   */
  async getPaymentAnalytics(dateRange?: {
    startDate: string
    endDate: string
  }): Promise<ApiResponse<{
    revenue: {
      total: number
      growth: number
      trend: Array<{ date: string; amount: number }>
    }
    transactions: {
      total: number
      successful: number
      failed: number
      successRate: number
    }
    averageOrderValue: number
    topPaymentMethods: Array<{
      method: string
      count: number
      percentage: number
    }>
    refunds: {
      total: number
      amount: number
      rate: number
    }
  }>> {
    return apiClient.get('/payments/analytics', {
      params: dateRange,
    })
  }
}

// Create singleton instance
export const paymentsService = new PaymentsService()

// Export for testing
export { PaymentsService }
