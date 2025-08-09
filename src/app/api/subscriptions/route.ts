import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  SubscriptionPlan,
  calculateSubscriptionDiscount,
  getNextBillingDate,
  generatePaymentReference
} from '@/lib/payments';

// Mock subscription plans
const getSubscriptionPlans = (userRole: string): SubscriptionPlan[] => {
  const basePlans = {
    buyer: [
      {
        id: 'buyer-free',
        name: 'Free',
        price: 0,
        duration: 'monthly' as const,
        features: [
          'Browse unlimited properties',
          'Contact up to 5 brokers/month',
          'Basic property alerts',
          'Standard support'
        ],
        limits: {
          properties: 'unlimited' as const,
          contacts: 5,
          support: 'Email',
          analytics: false,
          verification: false,
          commission: 0
        }
      },
      {
        id: 'buyer-premium',
        name: 'Premium',
        price: 299,
        originalPrice: 399,
        duration: 'monthly' as const,
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
          properties: 'unlimited' as const,
          contacts: 'unlimited' as const,
          support: 'Phone & Email',
          analytics: true,
          verification: true,
          commission: 0
        }
      }
    ],
    broker: [
      {
        id: 'broker-starter',
        name: 'Starter',
        price: 999,
        originalPrice: 1199,
        duration: 'monthly' as const,
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
        }
      },
      {
        id: 'broker-professional',
        name: 'Professional',
        price: 1999,
        originalPrice: 2399,
        duration: 'monthly' as const,
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
        }
      },
      {
        id: 'broker-enterprise',
        name: 'Enterprise',
        price: 4999,
        originalPrice: 5999,
        duration: 'monthly' as const,
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
          properties: 'unlimited' as const,
          contacts: 'unlimited' as const,
          support: 'Dedicated Manager',
          analytics: true,
          verification: true,
          commission: 2
        }
      }
    ],
    contractor: [
      {
        id: 'contractor-basic',
        name: 'Basic',
        price: 799,
        originalPrice: 999,
        duration: 'monthly' as const,
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
        }
      },
      {
        id: 'contractor-professional',
        name: 'Professional',
        price: 1499,
        originalPrice: 1799,
        duration: 'monthly' as const,
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
          properties: 'unlimited' as const,
          contacts: 100,
          support: 'Phone & Email',
          analytics: true,
          verification: true,
          commission: 3
        }
      }
    ]
  };

  return basePlans[userRole as keyof typeof basePlans] || [];
};

// Get subscription plans
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const billingCycle = searchParams.get('billing') as 'monthly' | 'yearly' || 'monthly';

    const plans = getSubscriptionPlans(session.user.role);

    // Adjust prices for yearly billing
    const adjustedPlans = plans.map(plan => {
      if (billingCycle === 'yearly') {
        const yearlyPrice = plan.price * 10; // 2 months free
        const yearlyOriginalPrice = plan.originalPrice ? plan.originalPrice * 12 : undefined;
        
        return {
          ...plan,
          price: yearlyPrice,
          originalPrice: yearlyOriginalPrice,
          duration: 'yearly' as const,
        };
      }
      return plan;
    });

    return NextResponse.json({
      plans: adjustedPlans,
      billingCycle,
    });

  } catch (error) {
    console.error('Subscription plans API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create or update subscription
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId, billingCycle = 'monthly' } = body;

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Get the selected plan
    const plans = getSubscriptionPlans(session.user.role);
    const selectedPlan = plans.find(plan => plan.id === planId);

    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Calculate pricing based on billing cycle
    let finalPrice = selectedPlan.price;
    if (billingCycle === 'yearly') {
      finalPrice = selectedPlan.price * 10; // 2 months free
    }

    // Generate subscription ID
    const subscriptionId = generatePaymentReference('SUB');
    const currentDate = new Date();
    const nextBillingDate = getNextBillingDate(currentDate, billingCycle);

    // Mock subscription creation - In production, save to database
    const subscription = {
      id: subscriptionId,
      userId: session.user.id,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      status: 'active',
      amount: finalPrice,
      currency: 'INR',
      billingCycle,
      currentPeriodStart: currentDate.toISOString(),
      currentPeriodEnd: nextBillingDate.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: currentDate.toISOString(),
    };

    console.log('Subscription created:', subscription);

    return NextResponse.json({
      subscription,
      message: 'Subscription created successfully',
    });

  } catch (error) {
    console.error('Subscription creation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('id');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Mock subscription cancellation - In production, update database
    console.log('Subscription cancelled:', {
      subscriptionId,
      userId: session.user.id,
      cancelledAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: 'Subscription cancelled successfully',
      cancelledAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Subscription cancellation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
