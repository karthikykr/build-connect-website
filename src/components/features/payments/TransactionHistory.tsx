'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { 
  Search, 
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  DollarSign
} from 'lucide-react';

interface Transaction {
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
  metadata?: {
    propertyId?: string;
    propertyTitle?: string;
    brokerId?: string;
    brokerName?: string;
    planId?: string;
    planName?: string;
  };
}

interface TransactionHistoryProps {
  userId?: string;
  userRole?: 'buyer' | 'broker' | 'contractor' | 'admin';
  className?: string;
}

export function TransactionHistory({
  userId,
  userRole = 'buyer',
  className
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    loadTransactions();
  }, [userId, userRole]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, typeFilter, statusFilter, dateRange]);

  const loadTransactions = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'subscription',
          status: 'completed',
          amount: 1999,
          currency: 'INR',
          description: 'Professional Plan - Monthly Subscription',
          paymentMethod: 'UPI',
          transactionId: 'txn_1234567890',
          createdAt: '2024-01-20T10:00:00Z',
          completedAt: '2024-01-20T10:01:00Z',
          metadata: {
            planId: 'broker-professional',
            planName: 'Professional Plan'
          }
        },
        {
          id: '2',
          type: 'commission',
          status: 'completed',
          amount: 75000,
          currency: 'INR',
          description: 'Commission from property sale',
          paymentMethod: 'Bank Transfer',
          transactionId: 'txn_1234567891',
          createdAt: '2024-01-18T14:30:00Z',
          completedAt: '2024-01-18T14:35:00Z',
          metadata: {
            propertyId: 'prop_123',
            propertyTitle: 'Premium Villa in Whitefield'
          }
        },
        {
          id: '3',
          type: 'payment',
          status: 'pending',
          amount: 5000,
          currency: 'INR',
          description: 'Property verification fee',
          paymentMethod: 'Credit Card',
          transactionId: 'txn_1234567892',
          createdAt: '2024-01-19T16:45:00Z'
        },
        {
          id: '4',
          type: 'refund',
          status: 'completed',
          amount: 299,
          currency: 'INR',
          description: 'Refund for cancelled subscription',
          paymentMethod: 'UPI',
          transactionId: 'txn_1234567893',
          createdAt: '2024-01-17T09:15:00Z',
          completedAt: '2024-01-17T09:20:00Z'
        },
        {
          id: '5',
          type: 'withdrawal',
          status: 'failed',
          amount: 25000,
          currency: 'INR',
          description: 'Withdrawal to bank account',
          paymentMethod: 'Bank Transfer',
          transactionId: 'txn_1234567894',
          createdAt: '2024-01-16T11:20:00Z'
        }
      ];

      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
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
    filtered = filtered.filter(transaction => 
      new Date(transaction.createdAt) >= cutoffDate
    );

    setFilteredTransactions(filtered);
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'payment':
        return <ArrowUpRight className="w-4 h-4 text-error" />;
      case 'commission':
        return <ArrowDownLeft className="w-4 h-4 text-success" />;
      case 'subscription':
        return <CreditCard className="w-4 h-4 text-primary" />;
      case 'refund':
        return <ArrowDownLeft className="w-4 h-4 text-success" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-warning" />;
      default:
        return <DollarSign className="w-4 h-4 text-text-secondary" />;
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const styles = {
      completed: 'bg-success/10 text-success',
      pending: 'bg-warning/10 text-warning',
      failed: 'bg-error/10 text-error',
      cancelled: 'bg-gray-light text-text-secondary'
    };

    const icons = {
      completed: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />,
      cancelled: <XCircle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        <span className="capitalize">{status}</span>
      </span>
    );
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotals = () => {
    const completed = filteredTransactions.filter(t => t.status === 'completed');
    const income = completed
      .filter(t => ['commission', 'refund'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = completed
      .filter(t => ['payment', 'subscription', 'withdrawal'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { income, expenses, net: income - expenses };
  };

  const totals = calculateTotals();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loading size="lg" text="Loading transactions..." />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-success font-medium">Income</p>
                    <p className="text-xl font-bold text-success">
                      {formatCurrency(totals.income)}
                    </p>
                  </div>
                  <ArrowDownLeft className="w-8 h-8 text-success" />
                </div>
              </div>
              
              <div className="bg-error/5 border border-error/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-error font-medium">Expenses</p>
                    <p className="text-xl font-bold text-error">
                      {formatCurrency(totals.expenses)}
                    </p>
                  </div>
                  <ArrowUpRight className="w-8 h-8 text-error" />
                </div>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary font-medium">Net</p>
                    <p className={`text-xl font-bold ${totals.net >= 0 ? 'text-success' : 'text-error'}`}>
                      {formatCurrency(totals.net)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <Input
                placeholder="Search transactions..."
                leftIcon={<Search className="w-4 h-4" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-80"
              />
              
              <select
                className="form-input"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="payment">Payments</option>
                <option value="commission">Commissions</option>
                <option value="subscription">Subscriptions</option>
                <option value="refund">Refunds</option>
                <option value="withdrawal">Withdrawals</option>
              </select>
              
              <select
                className="form-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
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

            {/* Transactions List */}
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  No transactions found
                </h3>
                <p className="text-text-secondary">
                  Try adjusting your filters or date range
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-light rounded-lg hover:bg-gray-light/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-light rounded-lg flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      
                      <div>
                        <p className="font-medium text-text-primary">
                          {transaction.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-text-secondary">
                          <span>ID: {transaction.transactionId}</span>
                          <span>{transaction.paymentMethod}</span>
                          <span>{formatDate(transaction.createdAt)}</span>
                        </div>
                        {transaction.metadata?.propertyTitle && (
                          <p className="text-xs text-text-secondary">
                            Property: {transaction.metadata.propertyTitle}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className={`font-semibold ${
                            ['commission', 'refund'].includes(transaction.type)
                              ? 'text-success'
                              : 'text-error'
                          }`}>
                            {['commission', 'refund'].includes(transaction.type) ? '+' : '-'}
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </p>
                          {getStatusBadge(transaction.status)}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
