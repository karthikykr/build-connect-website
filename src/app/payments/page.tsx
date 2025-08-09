'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { SubscriptionPlans } from '@/components/features/payments/SubscriptionPlans';
import { TransactionHistory } from '@/components/features/payments/TransactionHistory';
import { PaymentGateway } from '@/components/features/payments/PaymentGateway';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  CreditCard, 
  DollarSign,
  TrendingUp,
  Calendar,
  Settings,
  Plus,
  Wallet,
  Receipt,
  Crown,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'transactions' | 'payment'>('overview');
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadUserSubscription();
  }, [user]);

  const loadUserSubscription = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockSubscription: UserSubscription = {
        id: 'sub_123',
        planId: 'broker-professional',
        planName: 'Professional Plan',
        status: 'active',
        currentPeriodStart: '2024-01-01T00:00:00Z',
        currentPeriodEnd: '2024-02-01T00:00:00Z',
        cancelAtPeriodEnd: false,
        amount: 1999,
        currency: 'INR'
      };

      setSubscription(mockSubscription);
      setLoading(false);
    }, 1000);
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentGateway(true);
    setActiveTab('payment');
  };

  const handlePaymentSuccess = (paymentId: string, transactionId: string) => {
    console.log('Payment successful:', { paymentId, transactionId });
    setShowPaymentGateway(false);
    setActiveTab('overview');
    // Refresh subscription data
    loadUserSubscription();
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    alert('Payment failed: ' + error);
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-success/10 text-success',
      cancelled: 'bg-warning/10 text-warning',
      expired: 'bg-error/10 text-error'
    };

    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const breadcrumbs = [
    { label: 'Payments & Billing', current: true }
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Payments & Billing"
        description="Manage your subscription, payments, and billing information"
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" leftIcon={<Receipt className="w-4 h-4" />}>
              Download Invoice
            </Button>
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Add Payment Method
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Loading payment information..." />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-light">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: DollarSign },
                  { id: 'plans', label: 'Subscription Plans', icon: Crown },
                  { id: 'transactions', label: 'Transaction History', icon: Receipt },
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Current Subscription */}
                {subscription && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Crown className="w-5 h-5 mr-2" />
                        Current Subscription
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                            <Crown className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-text-primary">
                              {subscription.planName}
                            </h3>
                            <p className="text-text-secondary">
                              {formatCurrency(subscription.amount)} per month
                            </p>
                            <div className="flex items-center space-x-3 mt-1">
                              {getStatusBadge(subscription.status)}
                              <span className="text-sm text-text-secondary">
                                Renews on {formatDate(subscription.currentPeriodEnd)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Manage
                          </Button>
                          <Button variant="primary" onClick={() => setActiveTab('plans')}>
                            Upgrade Plan
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-light rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-text-secondary">Expires 12/25</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-success/10 text-success text-xs px-2 py-1 rounded">
                            Default
                          </span>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-light rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">UPI: user@paytm</p>
                            <p className="text-sm text-text-secondary">Verified</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>

                {/* Billing Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <DollarSign className="w-8 h-8 text-primary mx-auto mb-3" />
                      <p className="text-2xl font-bold text-text-primary">₹5,997</p>
                      <p className="text-sm text-text-secondary">Total Spent</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Calendar className="w-8 h-8 text-success mx-auto mb-3" />
                      <p className="text-2xl font-bold text-text-primary">3</p>
                      <p className="text-sm text-text-secondary">Months Active</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-8 h-8 text-warning mx-auto mb-3" />
                      <p className="text-2xl font-bold text-text-primary">₹75,000</p>
                      <p className="text-sm text-text-secondary">Commissions Earned</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'plans' && (
              <SubscriptionPlans
                userRole={user?.role || 'buyer'}
                currentPlan={subscription?.planId}
                onSelectPlan={handlePlanSelection}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionHistory
                userId={user?.id}
                userRole={user?.role}
              />
            )}

            {activeTab === 'payment' && showPaymentGateway && (
              <div className="max-w-2xl mx-auto">
                <PaymentGateway
                  amount={1999}
                  description="Professional Plan - Monthly Subscription"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onCancel={() => {
                    setShowPaymentGateway(false);
                    setActiveTab('plans');
                  }}
                />
              </div>
            )}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
