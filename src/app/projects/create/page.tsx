'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { ProjectForm } from '@/components/features/projects/ProjectForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { sitesService, CreateProjectRequest } from '@/services/sites.service';

export default function CreateProjectPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (projectData: CreateProjectRequest) => {
    setIsSubmitting(true);
    
    try {
      const response = await sitesService.createProject(projectData);
      
      if (response.success && response.data) {
        // Redirect to the created project
        router.push(`/projects/${response.data._id}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Projects', href: '/projects' },
    { label: 'Create Project', current: true }
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Create New Project"
        description="Start a new construction project with detailed requirements"
      >
        <ProjectForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          mode="create"
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
