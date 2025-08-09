'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ContractorApplicationForm } from '@/components/features/contractor/ContractorApplicationForm';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle,
  Shield,
  Award,
  Users,
  TrendingUp,
  Hammer,
  DollarSign,
  Star,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  contractorsService,
  ContractorApplicationRequest,
} from '@/services/contractors.service';
import Link from 'next/link';

export default function BecomeContractorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (applicationData: ContractorApplicationRequest) => {
    setIsSubmitting(true);

    try {
      const response = await contractorsService.applyToContractor(applicationData);

      if (response.success) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting contractor application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [{ label: 'Become a Contractor', current: true }];

  if (submitted) {
    return (
      <ProtectedRoute>
        <DashboardLayout
          breadcrumbs={breadcrumbs}
          title="Application Submitted"
          description="Your contractor application has been submitted successfully"
        >
          <div className="mx-auto max-w-2xl py-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-gray-900 mb-4 text-2xl font-bold">
              Application Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-8">
              Thank you for applying to become a contractor on BUILD-CONNECT. Our
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
                <li>• Welcome email with contractor dashboard access</li>
              </ul>
            </div>
            <div className="flex justify-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Link href="/contractors">
                <Button variant="primary">Browse Contractors</Button>
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
      description: 'Get verified contractor badge and build trust with clients',
    },
    {
      icon: Briefcase,
      title: 'Access to Quality Projects',
      description: 'Connect with serious property owners and developers',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Expand your reach and increase your project opportunities',
    },
    {
      icon: Award,
      title: 'Professional Tools',
      description:
        'Access advanced tools for project management and client communication',
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Become a Contractor"
        description="Join our network of verified construction professionals"
      >
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center py-12 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Join BUILD-CONNECT as a Verified Contractor
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Expand your construction business and connect with quality projects through our platform
              </p>
              <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Verified Professional Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Quality Project Access</span>
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
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="w-6 h-6 text-orange-600" />
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
                Contractor Application Form
              </h2>
              <p className="text-gray-600">
                Complete the application form below to join our network of verified contractors
              </p>
            </div>

            <ContractorApplicationForm
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
                      Minimum 1 year experience in construction
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Service area and specialization specification
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    What You'll Get
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-orange-600" />
                      Verified contractor badge
                    </li>
                    <li className="flex items-center gap-2">
                      <Hammer className="w-4 h-4 text-orange-600" />
                      Access to construction projects
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-600" />
                      Client management tools
                    </li>
                    <li className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                      Project tracking and billing
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
