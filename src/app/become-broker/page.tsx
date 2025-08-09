'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BrokerApplicationForm } from '@/components/features/broker/BrokerApplicationForm';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle,
  Shield,
  Award,
  Users,
  TrendingUp,
  Home,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  brokersService,
  BrokerApplicationRequest,
} from '@/services/brokers.service';
import Link from 'next/link';

export default function BecomeBrokerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (applicationData: BrokerApplicationRequest) => {
    setIsSubmitting(true);

    try {
      const response = await brokersService.applyToBroker(applicationData);

      if (response.success) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting broker application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [{ label: 'Become a Broker', current: true }];

  if (submitted) {
    return (
      <ProtectedRoute>
        <DashboardLayout
          breadcrumbs={breadcrumbs}
          title="Application Submitted"
          description="Your broker application has been submitted successfully"
        >
          <div className="mx-auto max-w-2xl py-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-gray-900 mb-4 text-2xl font-bold">
              Application Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-8">
              Thank you for applying to become a broker on BUILD-CONNECT. Our
              team will review your application and documents within 3-5
              business days. You will receive an email notification once the
              review is complete.
            </p>
            <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-2 font-semibold text-blue-900">
                What happens next?
              </h3>
              <ul className="space-y-2 text-left text-sm text-blue-800">
                <li>• Document verification (1-2 business days)</li>
                <li>
                  • Background check and reference verification (2-3 business
                  days)
                </li>
                <li>• Final approval and account activation</li>
                <li>• Welcome email with broker dashboard access</li>
              </ul>
            </div>
            <div className="flex justify-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Link href="/brokers">
                <Button variant="primary">Browse Brokers</Button>
              </Link>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const benefits = [
    {
      icon: Shield,
      title: 'Verified Professional Status',
      description: 'Get verified broker badge and build trust with clients',
    },
    {
      icon: Users,
      title: 'Access to Quality Leads',
      description: 'Connect with serious property buyers and sellers',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Expand your reach and increase your income potential',
    },
    {
      icon: Award,
      title: 'Professional Tools',
      description:
        'Access advanced tools for property management and client communication',
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Become a Broker"
        description="Join our network of verified real estate professionals"
      >
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center py-12 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Join BUILD-CONNECT as a Verified Broker
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Expand your real estate business and connect with quality clients through our platform
              </p>
              <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Verified Professional Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Quality Lead Generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Advanced Business Tools</span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="text-center p-6">
                  <CardContent className="space-y-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Application Form */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Broker Application Form
              </h2>
              <p className="text-gray-600">
                Complete the application form below to join our network of verified brokers
              </p>
            </div>

            <BrokerApplicationForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Additional Information */}
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Application Requirements
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Valid Aadhaar Card
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Valid PAN Card
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Minimum 1 year experience in real estate
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Service area specification
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    What You'll Get
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary-600" />
                      Verified broker badge
                    </li>
                    <li className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-primary-600" />
                      Access to property listings
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary-600" />
                      Client management tools
                    </li>
                    <li className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary-600" />
                      Commission tracking
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
