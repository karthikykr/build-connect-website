'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProjectOverview } from '@/components/features/projects/ProjectOverview';
import { ProjectRequirements } from '@/components/features/projects/ProjectRequirements';
import { ProjectProgress } from '@/components/features/projects/ProjectProgress';
import { ServiceRequests } from '@/components/features/projects/ServiceRequests';
import { 
  Edit,
  MessageSquare,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle
} from 'lucide-react';
import { Project, ProjectStatus } from '@/types';
import { sitesService } from '@/services/sites.service';
import { useAuth } from '@/hooks/useAuth';
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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const projectId = params.id as string;

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      const response = await sitesService.getProject(projectId);
      if (response.success && response.data) {
        setProject(response.data);
      } else {
        router.push('/projects');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      router.push('/projects');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout
          breadcrumbs={[
            { label: 'Projects', href: '/projects' },
            { label: 'Loading...', current: true }
          ]}
          title="Loading Project"
          description="Please wait while we load the project details"
        >
          <Loading />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!project) {
    return (
      <ProtectedRoute>
        <DashboardLayout
          breadcrumbs={[
            { label: 'Projects', href: '/projects' },
            { label: 'Not Found', current: true }
          ]}
          title="Project Not Found"
          description="The requested project could not be found"
        >
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Project Not Found
              </h3>
              <p className="text-gray-600 mb-6">
                The project you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Link href="/projects">
                <Button variant="primary">
                  Back to Projects
                </Button>
              </Link>
            </CardContent>
          </Card>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const statusConfig = PROJECT_STATUS_CONFIG[project.status];
  const StatusIcon = statusConfig.icon;

  const breadcrumbs = [
    { label: 'Projects', href: '/projects' },
    { label: project.projectName, current: true }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'requirements', label: 'Requirements', icon: CheckCircle },
    { id: 'progress', label: 'Progress', icon: Clock },
    { id: 'requests', label: 'Service Requests', icon: MessageSquare },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title={project.projectName}
        description={`Project Status: ${statusConfig.label}`}
        actions={
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color} ${statusConfig.bgColor}`}>
              <StatusIcon className="w-4 h-4" />
              {statusConfig.label}
            </span>
            <Link href={`/projects/${project._id}/edit`}>
              <Button variant="outline" leftIcon={<Edit className="w-4 h-4" />}>
                Edit Project
              </Button>
            </Link>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Tabs */}
          <Card>
            <CardContent className="p-0">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <TabIcon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </CardContent>
          </Card>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <ProjectOverview project={project} onUpdate={loadProject} />
            )}
            
            {activeTab === 'requirements' && (
              <ProjectRequirements project={project} onUpdate={loadProject} />
            )}
            
            {activeTab === 'progress' && (
              <ProjectProgress project={project} onUpdate={loadProject} />
            )}
            
            {activeTab === 'requests' && (
              <ServiceRequests project={project} onUpdate={loadProject} />
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
