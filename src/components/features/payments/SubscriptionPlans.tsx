'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  CheckCircle, 
  Star,
  Crown,
  Zap,
  Users,
  Home,
  MessageCircle,
  Shield,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: 'monthly' | 'yearly';
  popular?: boolean;
  features: string[];
  limits: {
    properties: number | 'unlimited';
    contacts: number | 'unlimited';
    support: string;
    analytics: boolean;
    verification: boolean;
    commission: number;
  };
  icon: React.ReactNode;
  color: string;
}

interface SubscriptionPlansProps {
  userRole: 'buyer' | 'broker' | 'contractor';
  currentPlan?: string;
  onSelectPlan: (planId: string) => void;
  className?: string;
}

export function SubscriptionPlans({
  userRole,
  currentPlan,
  onSelectPlan,
  className
}: SubscriptionPlansProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const getPlansForRole = (): SubscriptionPlan[] => {
    const basePlans = {
      buyer: [
        {
          id: 'buyer-free',
          name: 'Free',
          price: 0,
          duration: billingCycle,
          features: [
            'Browse unlimited properties',
            'Contact up to 5 brokers/month',
            'Basic property alerts',
            'Standard support'
          ],
          limits: {
            properties: 'unlimited',
            contacts: 5,
            support: 'Email',
            analytics: false,
            verification: false,
            commission: 0
          },
          icon: <Users className="w-6 h-6" />,
          color: 'bg-gray-500'
        },
        {
          id: 'buyer-premium',
          name: 'Premium',
          price: billingCycle === 'monthly' ? 299 : 2999,
          originalPrice: billingCycle === 'yearly' ? 3588 : undefined,
          duration: billingCycle,
          popular: true,
          features: [
            'Everything in Free',
            'Unlimited broker contacts',
            'Priority property alerts',
            'Advanced search filters',
            'Property comparison tool',
            'Investment analytics',
            'Priority support'
          ],
          limits: {
            properties: 'unlimited',
            contacts: 'unlimited',
            support: 'Phone & Email',
            analytics: true,
            verification: true,
            commission: 0
          },
          icon: <Star className="w-6 h-6" />,
          color: 'bg-primary'
        }
      ],
      broker: [
        {
          id: 'broker-starter',
          name: 'Starter',
          price: billingCycle === 'monthly' ? 999 : 9999,
          originalPrice: billingCycle === 'yearly' ? 11988 : undefined,
          duration: billingCycle,
          features: [
            'List up to 10 properties',
            'Basic lead management',
            'Standard verification',
            'Email support',
            '5% commission on deals'
          ],
          limits: {
            properties: 10,
            contacts: 50,
            support: 'Email',
            analytics: false,
            verification: true,
            commission: 5
          },
          icon: <Home className="w-6 h-6" />,
          color: 'bg-blue-500'
        },
        {
          id: 'broker-professional',
          name: 'Professional',
          price: billingCycle === 'monthly' ? 1999 : 19999,
          originalPrice: billingCycle === 'yearly' ? 23988 : undefined,
          duration: billingCycle,
          popular: true,
          features: [
            'List up to 50 properties',
            'Advanced lead management',
            'Priority verification',
            'Analytics dashboard',
            'Phone & email support',
            '3% commission on deals'
          ],
          limits: {
            properties: 50,
            contacts: 200,
            support: 'Phone & Email',
            analytics: true,
            verification: true,
            commission: 3
          },
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'bg-primary'
        },
        {
          id: 'broker-enterprise',
          name: 'Enterprise',
          price: billingCycle === 'monthly' ? 4999 : 49999,
          originalPrice: billingCycle === 'yearly' ? 59988 : undefined,
          duration: billingCycle,
          features: [
            'Unlimited property listings',
            'Premium lead management',
            'Instant verification',
            'Advanced analytics',
            'Dedicated support',
            '2% commission on deals',
            'API access'
          ],
          limits: {
            properties: 'unlimited',
            contacts: 'unlimited',
            support: 'Dedicated Manager',
            analytics: true,
            verification: true,
            commission: 2
          },
          icon: <Crown className="w-6 h-6" />,
          color: 'bg-purple-500'
        }
      ],
      contractor: [
        {
          id: 'contractor-basic',
          name: 'Basic',
          price: billingCycle === 'monthly' ? 799 : 7999,
          originalPrice: billingCycle === 'yearly' ? 9588 : undefined,
          duration: billingCycle,
          features: [
            'Create professional profile',
            'Showcase up to 10 projects',
            'Basic lead management',
            'Standard verification',
            'Email support'
          ],
          limits: {
            properties: 10,
            contacts: 30,
            support: 'Email',
            analytics: false,
            verification: true,
            commission: 4
          },
          icon: <Zap className="w-6 h-6" />,
          color: 'bg-green-500'
        },
        {
          id: 'contractor-professional',
          name: 'Professional',
          price: billingCycle === 'monthly' ? 1499 : 14999,
          originalPrice: billingCycle === 'yearly' ? 17988 : undefined,
          duration: billingCycle,
          popular: true,
          features: [
            'Everything in Basic',
            'Unlimited project showcase',
            'Advanced portfolio tools',
            'Priority verification',
            'Analytics dashboard',
            'Phone & email support'
          ],
          limits: {
            properties: 'unlimited',
            contacts: 100,
            support: 'Phone & Email',
            analytics: true,
            verification: true,
            commission: 3
          },
          icon: <Shield className="w-6 h-6" />,
          color: 'bg-primary'
        }
      ]
    };

    return basePlans[userRole] || [];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateSavings = (price: number, originalPrice?: number) => {
    if (!originalPrice) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const plans = getPlansForRole();

  return (
    <div className={className}>
      {/* Billing Toggle */}
      <div className="flex items-center justify-center mb-8">
        <div className="bg-gray-light p-1 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Yearly
            <span className="ml-1 text-xs bg-success text-white px-1.5 py-0.5 rounded">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-card-hover ${
              plan.popular ? 'ring-2 ring-primary' : ''
            } ${currentPlan === plan.id ? 'ring-2 ring-success' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-2 text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <CardHeader className={plan.popular ? 'pt-12' : ''}>
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${plan.color} rounded-lg flex items-center justify-center text-white`}>
                  {plan.icon}
                </div>
                {currentPlan === plan.id && (
                  <span className="bg-success text-white text-xs px-2 py-1 rounded-lg">
                    Current Plan
                  </span>
                )}
              </div>
              
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              
              <div className="space-y-1">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-text-primary">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-text-secondary ml-1">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                
                {plan.originalPrice && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-text-secondary line-through">
                      {formatPrice(plan.originalPrice)}
                    </span>
                    <span className="text-sm bg-success/10 text-success px-2 py-1 rounded">
                      Save {calculateSavings(plan.price, plan.originalPrice)}%
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Features */}
                <div>
                  <h4 className="font-semibold mb-3">Features</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Limits */}
                <div className="pt-4 border-t border-gray-light">
                  <h4 className="font-semibold mb-3">Plan Limits</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Properties</span>
                      <span className="font-medium">
                        {plan.limits.properties === 'unlimited' ? 'Unlimited' : plan.limits.properties}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Contacts</span>
                      <span className="font-medium">
                        {plan.limits.contacts === 'unlimited' ? 'Unlimited' : `${plan.limits.contacts}/month`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Support</span>
                      <span className="font-medium">{plan.limits.support}</span>
                    </div>
                    {userRole !== 'buyer' && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Commission</span>
                        <span className="font-medium">{plan.limits.commission}%</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Button */}
                <Button
                  variant={currentPlan === plan.id ? 'outline' : 'primary'}
                  className="w-full"
                  onClick={() => onSelectPlan(plan.id)}
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id ? 'Current Plan' : 'Choose Plan'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Additional Info */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-6 text-sm text-text-secondary">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Secure payments</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>24/7 support</span>
          </div>
        </div>
        
        <p className="mt-4 text-xs text-text-secondary">
          All plans include GST. Prices may vary based on location and applicable taxes.
        </p>
      </div>
    </div>
  );
}
