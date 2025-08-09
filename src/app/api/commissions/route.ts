import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  calculateCommission,
  generatePaymentReference,
  formatCurrency
} from '@/lib/payments';

interface Commission {
  id: string;
  userId: string;
  propertyId: string;
  propertyTitle: string;
  buyerId: string;
  buyerName: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'approved' | 'paid' | 'disputed';
  saleAmount: number;
  saleDate: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CommissionSummary {
  totalEarned: number;
  totalPending: number;
  totalPaid: number;
  thisMonth: number;
  lastMonth: number;
  averageCommission: number;
  totalDeals: number;
}

// Mock commission data
const getMockCommissions = (userId: string): Commission[] => [
  {
    id: '1',
    userId,
    propertyId: 'prop_123',
    propertyTitle: 'Premium Villa in Whitefield',
    buyerId: 'buyer_456',
    buyerName: 'John Doe',
    amount: 75000,
    percentage: 3,
    status: 'paid',
    saleAmount: 2500000,
    saleDate: '2024-01-15T00:00:00Z',
    dueDate: '2024-01-30T00:00:00Z',
    paidDate: '2024-01-28T00:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-28T00:00:00Z'
  },
  {
    id: '2',
    userId,
    propertyId: 'prop_124',
    propertyTitle: 'Commercial Plot in Electronic City',
    buyerId: 'buyer_457',
    buyerName: 'Jane Smith',
    amount: 150000,
    percentage: 3,
    status: 'approved',
    saleAmount: 5000000,
    saleDate: '2024-01-20T00:00:00Z',
    dueDate: '2024-02-05T00:00:00Z',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z'
  },
  {
    id: '3',
    userId,
    propertyId: 'prop_125',
    propertyTitle: 'Residential Plot in Sarjapur',
    buyerId: 'buyer_458',
    buyerName: 'Mike Johnson',
    amount: 60000,
    percentage: 3,
    status: 'pending',
    saleAmount: 2000000,
    saleDate: '2024-01-22T00:00:00Z',
    dueDate: '2024-02-07T00:00:00Z',
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z'
  },
  {
    id: '4',
    userId,
    propertyId: 'prop_126',
    propertyTitle: 'Apartment in HSR Layout',
    buyerId: 'buyer_459',
    buyerName: 'Sarah Wilson',
    amount: 45000,
    percentage: 2.5,
    status: 'disputed',
    saleAmount: 1800000,
    saleDate: '2024-01-18T00:00:00Z',
    dueDate: '2024-02-02T00:00:00Z',
    notes: 'Buyer disputed the commission rate',
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z'
  }
];

const calculateCommissionSummary = (commissions: Commission[]): CommissionSummary => {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const totalEarned = commissions.reduce((sum, c) => sum + c.amount, 0);
  const totalPending = commissions
    .filter(c => c.status === 'pending' || c.status === 'approved')
    .reduce((sum, c) => sum + c.amount, 0);
  const totalPaid = commissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0);

  const thisMonth = commissions
    .filter(c => new Date(c.saleDate) >= thisMonthStart)
    .reduce((sum, c) => sum + c.amount, 0);

  const lastMonth = commissions
    .filter(c => {
      const saleDate = new Date(c.saleDate);
      return saleDate >= lastMonthStart && saleDate <= lastMonthEnd;
    })
    .reduce((sum, c) => sum + c.amount, 0);

  const averageCommission = commissions.length > 0 ? totalEarned / commissions.length : 0;

  return {
    totalEarned,
    totalPending,
    totalPaid,
    thisMonth,
    lastMonth,
    averageCommission,
    totalDeals: commissions.length,
  };
};

// Get commissions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is broker or contractor
    if (!['broker', 'contractor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Only brokers and contractors can view commissions.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const dateRange = searchParams.get('dateRange') || '30d';

    // Get mock commissions
    let commissions = getMockCommissions(session.user.id);

    // Apply status filter
    if (status && status !== 'all') {
      commissions = commissions.filter(c => c.status === status);
    }

    // Apply date range filter
    const now = new Date();
    const daysAgo = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }[dateRange] || 30;
    
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    commissions = commissions.filter(c => 
      new Date(c.saleDate) >= cutoffDate
    );

    // Calculate summary
    const summary = calculateCommissionSummary(getMockCommissions(session.user.id));

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCommissions = commissions.slice(startIndex, endIndex);

    return NextResponse.json({
      commissions: paginatedCommissions,
      summary,
      pagination: {
        page,
        limit,
        total: commissions.length,
        totalPages: Math.ceil(commissions.length / limit),
      },
    });

  } catch (error) {
    console.error('Commissions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create commission record
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is broker or contractor
    if (!['broker', 'contractor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Only brokers and contractors can create commission records.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      propertyId,
      propertyTitle,
      buyerId,
      buyerName,
      saleAmount,
      commissionRate,
      saleDate,
      notes
    } = body;

    // Validate required fields
    if (!propertyId || !propertyTitle || !buyerId || !buyerName || !saleAmount || !commissionRate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate commission
    const commissionCalculation = calculateCommission(saleAmount, commissionRate);
    
    // Generate commission ID
    const commissionId = generatePaymentReference('COM');
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days from now

    // Create commission record
    const commission: Commission = {
      id: commissionId,
      userId: session.user.id,
      propertyId,
      propertyTitle,
      buyerId,
      buyerName,
      amount: commissionCalculation.finalAmount,
      percentage: commissionRate,
      status: 'pending',
      saleAmount,
      saleDate: saleDate || currentDate.toISOString(),
      dueDate: dueDate.toISOString(),
      notes,
      createdAt: currentDate.toISOString(),
      updatedAt: currentDate.toISOString(),
    };

    // In production, save to database
    console.log('Commission record created:', commission);

    return NextResponse.json({
      commission,
      calculation: commissionCalculation,
      message: 'Commission record created successfully',
    });

  } catch (error) {
    console.error('Commission creation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update commission status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { commissionId, status, notes } = body;

    if (!commissionId || !status) {
      return NextResponse.json(
        { error: 'Commission ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'approved', 'paid', 'disputed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Mock commission update - In production, update database
    const updatedCommission = {
      id: commissionId,
      status,
      notes,
      updatedAt: new Date().toISOString(),
      ...(status === 'paid' && { paidDate: new Date().toISOString() }),
    };

    console.log('Commission updated:', updatedCommission);

    return NextResponse.json({
      commission: updatedCommission,
      message: 'Commission status updated successfully',
    });

  } catch (error) {
    console.error('Commission update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
