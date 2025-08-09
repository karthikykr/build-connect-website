'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { 
  CreditCard, 
  Smartphone,
  Building,
  Shield,
  CheckCircle,
  AlertTriangle,
  Lock,
  Wallet
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  name: string;
  icon: React.ReactNode;
  description: string;
  processingFee: number;
}

interface PaymentGatewayProps {
  amount: number;
  currency?: string;
  description: string;
  onSuccess: (paymentId: string, transactionId: string) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
  className?: string;
}

export function PaymentGateway({
  amount,
  currency = 'INR',
  description,
  onSuccess,
  onError,
  onCancel,
  className
}: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      type: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, RuPay',
      processingFee: 2.5
    },
    {
      id: 'upi',
      type: 'upi',
      name: 'UPI',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Google Pay, PhonePe, Paytm',
      processingFee: 0
    },
    {
      id: 'netbanking',
      type: 'netbanking',
      name: 'Net Banking',
      icon: <Building className="w-6 h-6" />,
      description: 'All major banks',
      processingFee: 1.5
    },
    {
      id: 'wallet',
      type: 'wallet',
      name: 'Digital Wallet',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Paytm, Amazon Pay',
      processingFee: 1.0
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotal = () => {
    const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);
    const processingFee = selectedPaymentMethod ? (amount * selectedPaymentMethod.processingFee / 100) : 0;
    return amount + processingFee;
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      onError('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock payment success
      const paymentId = `pay_${Date.now()}`;
      const transactionId = `txn_${Date.now()}`;
      
      onSuccess(paymentId, transactionId);
    } catch (error) {
      onError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Card Number"
              value={cardDetails.number}
              onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
              maxLength={19}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                maxLength={5}
              />
              <Input
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                maxLength={4}
                type="password"
              />
            </div>
            <Input
              placeholder="Cardholder Name"
              value={cardDetails.name}
              onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
        );
      
      case 'upi':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Enter UPI ID (e.g., user@paytm)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">GPay</span>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">PE</span>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">PTM</span>
              </div>
            </div>
          </div>
        );
      
      case 'netbanking':
        return (
          <div className="space-y-4">
            <select className="form-input">
              <option value="">Select your bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="kotak">Kotak Mahindra Bank</option>
              <option value="pnb">Punjab National Bank</option>
            </select>
          </div>
        );
      
      case 'wallet':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-light rounded-lg cursor-pointer hover:border-primary">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xs">PTM</span>
                  </div>
                  <span className="font-medium">Paytm</span>
                </div>
              </div>
              <div className="p-4 border border-gray-light rounded-lg cursor-pointer hover:border-primary">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-xs">AP</span>
                  </div>
                  <span className="font-medium">Amazon Pay</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-gray-light p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Payment Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">{description}</span>
                <span className="font-medium">{formatCurrency(amount)}</span>
              </div>
              {selectedMethod && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Processing Fee</span>
                  <span className="font-medium">
                    {formatCurrency(calculateTotal() - amount)}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
                <span>Total Amount</span>
                <span className="text-primary">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold mb-4">Select Payment Method</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedMethod === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-light hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedMethod === method.id ? 'bg-primary text-white' : 'bg-gray-light'
                    }`}>
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-text-secondary">{method.description}</p>
                      {method.processingFee > 0 && (
                        <p className="text-xs text-warning">
                          +{method.processingFee}% processing fee
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          {selectedMethod && (
            <div>
              <h4 className="font-semibold mb-4">Payment Details</h4>
              {renderPaymentForm()}
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-start space-x-3 p-4 bg-success/5 border border-success/20 rounded-lg">
            <Lock className="w-5 h-5 text-success mt-0.5" />
            <div>
              <p className="text-sm font-medium text-success">Secure Payment</p>
              <p className="text-xs text-text-secondary">
                Your payment information is encrypted and secure. We don't store your card details.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing}
              className="flex-1"
              leftIcon={isProcessing ? <Loading size="sm" /> : <CheckCircle className="w-4 h-4" />}
            >
              {isProcessing ? 'Processing...' : `Pay ${formatCurrency(calculateTotal())}`}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
