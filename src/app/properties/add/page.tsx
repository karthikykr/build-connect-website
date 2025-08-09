'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { PropertyForm } from '@/components/features/properties/PropertyForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Property } from '@/types';

export default function AddPropertyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isBroker } = useAuth();
  const router = useRouter();

  const handleSubmit = async (propertyData: Partial<Property>) => {
    setIsSubmitting(true);
    
    try {
      // In production, this would be an API call
      console.log('Creating property:', propertyData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to properties list or property detail
      router.push('/properties');
    } catch (error) {
      console.error('Error creating property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Properties', href: '/properties' },
    { label: 'Add Property', current: true }
  ];

  // Check if user is authorized to add properties
  if (!isBroker()) {
    return (
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Access Denied"
        description="Only brokers can add properties"
      >
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Access Restricted
          </h3>
          <p className="text-text-secondary">
            You need to be a verified broker to add properties.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Add New Property"
        description="List your property on BUILD-CONNECT"
      >
        <PropertyForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          mode="create"
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
