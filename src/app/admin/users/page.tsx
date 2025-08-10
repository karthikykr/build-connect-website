'use client';

import { DashboardLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserManagementSimple as UserManagement } from '@/components/features/admin/UserManagementSimple';
import { Button } from '@/components/ui/Button';
import { Users, Download, UserPlus, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'broker' | 'contractor' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  totalProperties?: number;
  totalTransactions?: number;
}

export default function AdminUsersPage() {
  const { user, isAdmin } = useAuth();

  const breadcrumbs = [
    { label: 'Admin Dashboard', href: '/admin' },
    { label: 'User Management', current: true },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="User Management"
        description="Manage platform users, roles, and permissions"
        actions={
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Users
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              User Settings
            </Button>
            <Button variant="primary">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        }
      >
        <UserManagement user={user} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
