'use client';

import { DashboardLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserManagement } from '@/components/features/admin/UserManagement';
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
          totalProperties: 15,
          totalTransactions: 8,
        },
        {
          id: '3',
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          phone: '+91 9876543212',
          role: 'contractor',
          status: 'pending',
          isVerified: false,
          createdAt: '2024-01-18T12:00:00Z',
          totalProperties: 0,
          totalTransactions: 0,
        },
        {
          id: '4',
          name: 'Admin User',
          email: 'admin@buildconnect.com',
          phone: '+91 9876543213',
          role: 'admin',
          status: 'active',
          isVerified: true,
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: '2024-01-20T18:00:00Z',
          totalProperties: 0,
          totalTransactions: 0,
        },
        {
          id: '5',
          name: 'Suspended User',
          email: 'suspended@example.com',
          phone: '+91 9876543214',
          role: 'buyer',
          status: 'suspended',
          isVerified: true,
          createdAt: '2024-01-12T15:00:00Z',
          lastLogin: '2024-01-15T10:00:00Z',
          totalProperties: 0,
          totalTransactions: 1,
        },
      ];

      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm)
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleUserAction = (
    userId: string,
    action: 'activate' | 'suspend' | 'delete' | 'verify'
  ) => {
    setUsers(prev =>
      prev.map(user => {
        if (user.id === userId) {
          switch (action) {
            case 'activate':
              return { ...user, status: 'active' as const };
            case 'suspend':
              return { ...user, status: 'suspended' as const };
            case 'verify':
              return { ...user, isVerified: true };
            case 'delete':
              // In real app, this would remove the user
              return user;
            default:
              return user;
          }
        }
        return user;
      })
    );
  };

  const handleBulkAction = (action: 'activate' | 'suspend' | 'delete') => {
    selectedUsers.forEach(userId => {
      handleUserAction(userId, action);
    });
    setSelectedUsers([]);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const getStatusBadge = (status: User['status']) => {
    const styles = {
      active: 'bg-success/10 text-success',
      inactive: 'bg-gray-light text-text-secondary',
      suspended: 'bg-error/10 text-error',
      pending: 'bg-warning/10 text-warning',
    };

    const icons = {
      active: <CheckCircle className="h-3 w-3" />,
      inactive: <XCircle className="h-3 w-3" />,
      suspended: <XCircle className="h-3 w-3" />,
      pending: <AlertTriangle className="h-3 w-3" />,
    };

    return (
      <span
        className={`inline-flex items-center space-x-1 rounded-lg px-2 py-1 text-xs font-medium ${styles[status]}`}
      >
        {icons[status]}
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const getRoleBadge = (role: User['role']) => {
    const colors = {
      buyer: 'bg-blue-100 text-blue-800',
      broker: 'bg-green-100 text-green-800',
      contractor: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`rounded-lg px-2 py-1 text-xs font-medium ${colors[role]}`}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'User Management', current: true },
  ];

  if (!isAdmin()) {
    return <div>Access Denied</div>;
  }

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="User Management"
        description="Manage users, roles, and permissions"
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
              Export
            </Button>
            <Button variant="primary" leftIcon={<Users className="h-4 w-4" />}>
              Add User
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loading size="lg" text="Loading users..." />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                  <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                    <Input
                      placeholder="Search users..."
                      leftIcon={<Search className="h-4 w-4" />}
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="md:w-80"
                    />

                    <select
                      className="form-input"
                      value={roleFilter}
                      onChange={e => setRoleFilter(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      <option value="buyer">Buyers</option>
                      <option value="broker">Brokers</option>
                      <option value="contractor">Contractors</option>
                      <option value="admin">Admins</option>
                    </select>

                    <select
                      className="form-input"
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {selectedUsers.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-text-secondary">
                        {selectedUsers.length} selected
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('activate')}
                      >
                        Activate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('suspend')}
                      >
                        Suspend
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-light">
                      <tr>
                        <th className="p-4 text-left">
                          <input
                            type="checkbox"
                            checked={
                              selectedUsers.length === filteredUsers.length &&
                              filteredUsers.length > 0
                            }
                            onChange={selectAllUsers}
                          />
                        </th>
                        <th className="p-4 text-left font-medium">User</th>
                        <th className="p-4 text-left font-medium">Role</th>
                        <th className="p-4 text-left font-medium">Status</th>
                        <th className="p-4 text-left font-medium">Verified</th>
                        <th className="p-4 text-left font-medium">Joined</th>
                        <th className="p-4 text-left font-medium">
                          Last Login
                        </th>
                        <th className="p-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr
                          key={user.id}
                          className="border-b border-gray-light hover:bg-gray-light/50"
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleUserSelection(user.id)}
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                <span className="font-medium text-white">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-text-primary">
                                  {user.name}
                                </p>
                                <p className="text-sm text-text-secondary">
                                  {user.email}
                                </p>
                                <p className="text-xs text-text-secondary">
                                  {user.phone}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">{getRoleBadge(user.role)}</td>
                          <td className="p-4">{getStatusBadge(user.status)}</td>
                          <td className="p-4">
                            {user.isVerified ? (
                              <CheckCircle className="h-5 w-5 text-success" />
                            ) : (
                              <XCircle className="h-5 w-5 text-error" />
                            )}
                          </td>
                          <td className="p-4 text-sm text-text-secondary">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="p-4 text-sm text-text-secondary">
                            {user.lastLogin
                              ? formatDate(user.lastLogin)
                              : 'Never'}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
