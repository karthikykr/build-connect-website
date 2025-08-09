'use client';

import { DashboardLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { VerificationManagement } from '@/components/features/admin/VerificationManagement';
import { Button } from '@/components/ui/Button';
import { Shield, Download, Settings, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'broker' | 'contractor';
  type: 'identity' | 'professional' | 'business';
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }[];
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  priority: 'low' | 'medium' | 'high';
}

export default function AdminVerificationsPage() {
  const { user, isAdmin } = useAuth();

  const breadcrumbs = [
    { label: 'Admin Dashboard', href: '/admin' },
    { label: 'Verifications', current: true },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Verification Management"
        description="Review and manage broker and contractor verification requests"
        actions={
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Verification Settings
            </Button>
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">5 Pending</span>
            </div>
          </div>
        }
      >
        <VerificationManagement user={user} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
