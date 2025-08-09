'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  MessageSquare,
  MoreVertical
} from 'lucide-react';
import { Project, ProjectStatus } from '@/types';
import { sitesService } from '@/services/sites.service';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

const PROJECT_STATUS_CONFIG: Record<ProjectStatus, { 
  label: string; 
  color: string; 
  bgColor: string; 
  icon: React.ComponentType<any> 
}> = {
  'Initiated': { 
    label: 'Initiated', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50', 
    icon: Clock 
  },
  'Planning': { 
    label: 'Planning', 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-50', 
    icon: AlertTriangle 
  },
  'In Progress': { 
    label: 'In Progress', 
    color: 'text-green-600', 
    bgColor: 'bg-green-50', 
    icon: Clock 
  },
  'On Hold': { 
    label: 'On Hold', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-50', 
    icon: AlertTriangle 
  },
  'Completed': { 
    label: 'Completed', 
    color: 'text-green-700', 
    bgColor: 'bg-green-100', 
    icon: CheckCircle 
  },
  'Cancelled': { 
    label: 'Cancelled', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50', 
    icon: XCircle 
  },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const { user } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await sitesService.getProjects();
      if (response.success && response.data) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: ProjectStatus) => {
    const config = PROJECT_STATUS_CONFIG[status];
    const IconComponent = config.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  const breadcrumbs = [
    { label: 'Projects', current: true }
  ];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout
          breadcrumbs={breadcrumbs}
          title="Projects"
          description="Manage your construction projects"
        >
          <Loading />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Projects"
        description="Manage your construction projects"
        actions={
          <Link href="/projects/create">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Create Project
            </Button>
          </Link>
        }
      >
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Status</option>
                    {Object.entries(PROJECT_STATUS_CONFIG).map(([status, config]) => (
                      <option key={status} value={status}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects List */}
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {projects.length === 0 ? 'No projects yet' : 'No projects found'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {projects.length === 0 
                    ? 'Create your first project to get started with construction management.'
                    : 'Try adjusting your search or filters.'
                  }
                </p>
                {projects.length === 0 && (
                  <Link href="/projects/create">
                    <Button variant="primary">
                      Create Your First Project
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredProjects.map((project) => {
                const statusConfig = PROJECT_STATUS_CONFIG[project.status];
                return (
                  <Card key={project._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {project.projectName}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} ${statusConfig.bgColor}`}>
                              {getStatusIcon(project.status)}
                              {statusConfig.label}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Created {formatRelativeTime(project.createdAt)}
                            </div>
                            {project.actualStartDate && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Started {formatRelativeTime(project.actualStartDate)}
                              </div>
                            )}
                          </div>

                          {project.remarks && (
                            <p className="text-gray-700 mb-3 line-clamp-2">
                              {project.remarks}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {project.progressLogs.length} progress updates
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Link href={`/projects/${project._id}`}>
                            <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                              View
                            </Button>
                          </Link>
                          <Link href={`/projects/${project._id}/edit`}>
                            <Button variant="outline" size="sm" leftIcon={<Edit className="w-4 h-4" />}>
                              Edit
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
