'use client';

import { DashboardLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminDashboard } from '@/components/features/admin/AdminDashboard';
import { Button } from '@/components/ui/Button';
import { Settings, BarChart3, Download, Users, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();

  const breadcrumbs = [{ label: 'Admin Dashboard', current: true }];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Admin Dashboard"
        description={`Welcome back, ${user?.name || 'Admin'}! Here's your platform overview.`}
        actions={
          <div className="flex gap-3">
            <Link href="/admin/analytics">
              <Button variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Button variant="primary">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        }
      >
        <AdminDashboard user={user} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
