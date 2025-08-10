'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldX,
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  UserCheck,
  UserX,
  Download,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { AdminUser } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

// Define UserFilters interface locally to avoid import issues
interface UserFilters {
  search?: string;
  role?: 'user' | 'broker' | 'contractor' | 'admin';
  status?: 'active' | 'inactive' | 'suspended';
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  page?: number;
  limit?: number;
}

interface UserManagementProps {
  user: any;
}

export function UserManagement({ user }: UserManagementProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Error boundary for component-level errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('UserManagement component error:', event.error);
      setError('An unexpected error occurred. Please refresh the page.');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [currentPage, selectedRole, selectedStatus, searchTerm]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const filters: UserFilters = {
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
        role: selectedRole !== 'all' ? (selectedRole as any) : undefined,
        status: selectedStatus !== 'all' ? (selectedStatus as any) : undefined,
      };

      const response = await adminService.getUsers(filters);
      if (response.success && response.data) {
        setUsers(response.data.users || []);
        setTotalPages(Math.ceil((response.data.total || 0) / 20));
      } else {
        throw new Error('Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users from the server.');

      // Simple mock data for demonstration
      const mockUsers: AdminUser[] = [];
      setUsers(mockUsers);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove the broken mock data and continue with the rest of the component
  const handleUserAction = async (userId: string, action: 'activate' | 'suspend' | 'delete' | 'verify') => {
    try {
      switch (action) {
        case 'activate':
          await adminService.updateUserStatus(userId, 'active');
          break;
        case 'suspend':
          await adminService.updateUserStatus(userId, 'suspended');
          break;
        case 'delete':
          await adminService.deleteUser(userId);
          break;
        case 'verify':
          await adminService.verifyUser(userId);
          break;
      }
      loadUsers();
    } catch (error) {
      console.error(`Error performing ${action} on user:`, error);
    }
  };

  const handleUserAction = async (userId: string, action: 'activate' | 'suspend' | 'delete' | 'verify') => {
    try {
      switch (action) {
        case 'activate':
          await adminService.updateUserStatus(userId, 'active');
          break;
        case 'suspend':
          await adminService.updateUserStatus(userId, 'suspended');
          break;
        case 'delete':
          await adminService.deleteUser(userId);
          break;
        case 'verify':
          await adminService.verifyUser(userId);
          break;
      }
      loadUsers();
    } catch (error) {
      console.error(`Error performing ${action} on user:`, error);
    }
  };

  const handleBulkAction = async (action: 'activate' | 'suspend' | 'delete') => {
    try {
      for (const userId of selectedUsers) {
        await handleUserAction(userId, action);
      }
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'site_owner': return 'text-blue-600 bg-blue-50';
      case 'contractor': return 'text-orange-600 bg-orange-50';
      case 'broker': return 'text-green-600 bg-green-50';
      case 'admin': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'suspended': return 'text-red-600 bg-red-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (isLoading) {
    return <Loading />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" text="Loading users..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Error Loading Users</h3>
              <p className="text-sm text-gray-600 mt-1">{error}</p>
            </div>
            <Button onClick={loadUsers} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Roles</option>
                <option value="site_owner">Site Owners</option>
                <option value="contractor">Contractors</option>
                <option value="broker">Brokers</option>
                <option value="admin">Admins</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>

              <Button variant="outline" onClick={loadUsers}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>

              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedUsers.length} user(s) selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
                  <UserCheck className="w-4 h-4 mr-1" />
                  Activate
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('suspend')}>
                  <UserX className="w-4 h-4 mr-1" />
                  Suspend
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(filteredUsers.map(u => u._id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Verification</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user._id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400">{user.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          {user.isVerified ? (
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                          ) : (
                            <ShieldX className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-xs ${user.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                            {user.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">
                          {formatRelativeTime(user.lastLoginAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <div className="relative">
                            <Button size="sm" variant="outline">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
