'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  DollarSign, 
  TrendingUp,
  Calendar,
  Download,
  Eye,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Home,
  User,
  Wallet
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Commission {
  id: string;
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
}

interface CommissionSummary {
  totalEarned: number;
  totalPending: number;
  totalPaid: number;
  thisMonth: number;
  lastMonth: number;
  averageCommission: number;
}

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [filteredCommissions, setFilteredCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const { user } = useAuth();

  useEffect(() => {
    loadCommissions();
  }, [user]);

  useEffect(() => {
    filterCommissions();
  }, [commissions, searchTerm, statusFilter, dateRange]);

  const loadCommissions = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockCommissions: Commission[] = [
        {
          id: '1',
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
          paidDate: '2024-01-28T00:00:00Z'
        },
        {
          id: '2',
          propertyId: 'prop_124',
          propertyTitle: 'Commercial Plot in Electronic City',
          buyerId: 'buyer_457',
          buyerName: 'Jane Smith',
          amount: 150000,
          percentage: 3,
          status: 'approved',
          saleAmount: 5000000,
          saleDate: '2024-01-20T00:00:00Z',
          dueDate: '2024-02-05T00:00:00Z'
        },
        {
          id: '3',
          propertyId: 'prop_125',
          propertyTitle: 'Residential Plot in Sarjapur',
          buyerId: 'buyer_458',
          buyerName: 'Mike Johnson',
          amount: 60000,
          percentage: 3,
          status: 'pending',
          saleAmount: 2000000,
          saleDate: '2024-01-22T00:00:00Z',
          dueDate: '2024-02-07T00:00:00Z'
        },
        {
          id: '4',
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
          notes: 'Buyer disputed the commission rate'
        }
      ];

      const mockSummary: CommissionSummary = {
        totalEarned: 330000,
        totalPending: 105000,
        totalPaid: 225000,
        thisMonth: 285000,
        lastMonth: 180000,
        averageCommission: 82500
      };

      setCommissions(mockCommissions);
      setSummary(mockSummary);
      setLoading(false);
    }, 1000);
  };

  const filterCommissions = () => {
    let filtered = [...commissions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(commission =>
        commission.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commission.buyerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(commission => commission.status === statusFilter);
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
    filtered = filtered.filter(commission => 
      new Date(commission.saleDate) >= cutoffDate
    );

    setFilteredCommissions(filtered);
  };

  const getStatusBadge = (status: Commission['status']) => {
    const styles = {
      pending: 'bg-warning/10 text-warning',
      approved: 'bg-blue-100 text-blue-800',
      paid: 'bg-success/10 text-success',
      disputed: 'bg-error/10 text-error'
    };

    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      paid: <CheckCircle className="w-3 h-3" />,
      disputed: <XCircle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const breadcrumbs = [
    { label: 'Commissions', current: true }
  ];

  // Check if user is broker or contractor
  if (!user || !['broker', 'contractor'].includes(user.role)) {
    return (
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Access Denied"
        description="This page is only available for brokers and contractors"
      >
        <Card>
          <CardContent className="p-12 text-center">
            <DollarSign className="w-16 h-16 text-error mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Access Restricted
            </h3>
            <p className="text-text-secondary">
              Commission management is only available for brokers and contractors.
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Commission Management"
        description="Track your earnings and commission payments"
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              Export Report
            </Button>
            <Button variant="primary" leftIcon={<Wallet className="w-4 h-4" />}>
              Request Withdrawal
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Loading commission data..." />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-2xl font-bold text-text-primary">
                      {formatCurrency(summary.totalEarned)}
                    </p>
                    <p className="text-sm text-text-secondary">Total Earned</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 text-warning mx-auto mb-3" />
                    <p className="text-2xl font-bold text-text-primary">
                      {formatCurrency(summary.totalPending)}
                    </p>
                    <p className="text-sm text-text-secondary">Pending</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-8 h-8 text-success mx-auto mb-3" />
                    <p className="text-2xl font-bold text-text-primary">
                      {formatCurrency(summary.totalPaid)}
                    </p>
                    <p className="text-sm text-text-secondary">Paid Out</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-2xl font-bold text-text-primary">
                      {formatCurrency(summary.thisMonth)}
                    </p>
                    <p className="text-sm text-text-secondary">This Month</p>
                    <div className="flex items-center justify-center mt-1">
                      <span className={`text-xs ${
                        summary.thisMonth > summary.lastMonth ? 'text-success' : 'text-error'
                      }`}>
                        {summary.thisMonth > summary.lastMonth ? '+' : ''}
                        {((summary.thisMonth - summary.lastMonth) / summary.lastMonth * 100).toFixed(1)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <Input
                    placeholder="Search by property or buyer..."
                    leftIcon={<Search className="w-4 h-4" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:w-80"
                  />
                  
                  <select
                    className="form-input"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="paid">Paid</option>
                    <option value="disputed">Disputed</option>
                  </select>
                  
                  <select
                    className="form-input"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Commissions List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Commission History ({filteredCommissions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredCommissions.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      No commissions found
                    </h3>
                    <p className="text-text-secondary">
                      Try adjusting your filters or date range
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCommissions.map((commission) => (
                      <div
                        key={commission.id}
                        className="flex items-center justify-between p-4 border border-gray-light rounded-lg hover:bg-gray-light/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Home className="w-6 h-6 text-primary" />
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-text-primary">
                              {commission.propertyTitle}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-text-secondary">
                              <div className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span>{commission.buyerName}</span>
                              </div>
                              <span>Sale: {formatCurrency(commission.saleAmount)}</span>
                              <span>Rate: {commission.percentage}%</span>
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-text-secondary mt-1">
                              <span>Sale Date: {formatDate(commission.saleDate)}</span>
                              <span>Due: {formatDate(commission.dueDate)}</span>
                              {commission.paidDate && (
                                <span>Paid: {formatDate(commission.paidDate)}</span>
                              )}
                            </div>
                            {commission.notes && (
                              <p className="text-xs text-warning mt-1">{commission.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="text-xl font-bold text-success">
                                {formatCurrency(commission.amount)}
                              </p>
                              {getStatusBadge(commission.status)}
                            </div>
                            
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
