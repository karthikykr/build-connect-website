'use client';

import { DashboardLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ContractorDashboard } from '@/components/features/contractor/ContractorDashboard';
import { Button } from '@/components/ui/Button';
import { Hammer, User, Briefcase } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function ContractorDashboardPage() {
  const { user } = useAuth();

  const breadcrumbs = [{ label: 'Contractor Dashboard', current: true }];

  return (
    <ProtectedRoute allowedRoles={['contractor']}>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Contractor Dashboard"
        description={`Welcome back, ${user?.name || 'Contractor'}! Here's your business overview.`}
        actions={
          <div className="flex gap-3">
            <Link href="/projects">
              <Button variant="outline">
                <Briefcase className="mr-2 h-4 w-4" />
                Browse Projects
              </Button>
            </Link>
            <Link href="/contractor/profile">
              <Button variant="primary">
                <User className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </Link>
          </div>
        }
      >
        <ContractorDashboard user={user} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Clients
                </CardTitle>
                <Users className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-muted-foreground text-xs">
                  +5 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹8.2L</div>
                <p className="text-muted-foreground text-xs">
                  +15% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <TrendingUp className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.5%</div>
                <p className="text-muted-foreground text-xs">
                  +1.2% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Create New Project
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Update Portfolio
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Site Visit
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Client Messages
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Villa Construction - Whitefield
                      </p>
                      <p className="text-gray-500 text-xs">
                        In Progress - 75% complete
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Apartment Renovation - Koramangala
                      </p>
                      <p className="text-gray-500 text-xs">
                        Starting next week
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Office Interior - Electronic City
                      </p>
                      <p className="text-gray-500 text-xs">
                        Awaiting client approval
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session Debug Info */}
          <Card className="border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm">
                Debug: Session Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-gray-600 overflow-auto text-xs">
                {JSON.stringify(session, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
