'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { ProjectForm } from '@/components/features/projects/ProjectForm';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/types';
import { sitesService, CreateProjectRequest } from '@/services/sites.service';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (projectData: CreateProjectRequest) => {
    setIsSubmitting(true);
    
    try {
      const response = await sitesService.updateProject(projectId, projectData);
      
      if (response.success) {
        // Redirect back to project detail page
        router.push(`/projects/${projectId}`);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsSubmitting(false);
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
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Project Not Found
            </h3>
            <p className="text-gray-600">
              The project you're trying to edit doesn't exist or you don't have permission to edit it.
            </p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const breadcrumbs = [
    { label: 'Projects', href: '/projects' },
    { label: project.projectName, href: `/projects/${project._id}` },
    { label: 'Edit', current: true }
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title={`Edit ${project.projectName}`}
        description="Update your project details and requirements"
      >
        <ProjectForm
          project={project}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          mode="edit"
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
