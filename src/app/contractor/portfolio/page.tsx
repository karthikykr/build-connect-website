'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  Calendar,
  MapPin,
  DollarSign,
  Star,
  Image as ImageIcon,
  FileText,
  CheckCircle,
  Clock,
  Home,
  Building,
  Hammer,
  Palette,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

interface PortfolioProject {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  completedDate: string;
  projectValue: number;
  clientName: string;
  images: string[];
  status: 'completed' | 'ongoing' | 'planned';
  rating?: number;
  testimonial?: string;
}

const PROJECT_CATEGORIES = [
  { value: 'residential', label: 'Residential Construction', icon: Home },
  { value: 'commercial', label: 'Commercial Construction', icon: Building },
  { value: 'renovation', label: 'Renovation', icon: Hammer },
  { value: 'interior', label: 'Interior Design', icon: Palette },
];

const PROJECT_STATUS_CONFIG = {
  completed: { label: 'Completed', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle },
  ongoing: { label: 'Ongoing', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: Clock },
  planned: { label: 'Planned', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: Calendar },
};

export default function ContractorPortfolioPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      setIsLoading(true);
      // Mock data for demonstration
      const mockProjects: PortfolioProject[] = [
        {
          _id: '1',
          title: 'Modern Villa Construction',
          description: 'Complete construction of a 4BHK modern villa with contemporary design and premium finishes.',
          category: 'residential',
          location: 'Whitefield, Bangalore',
          completedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          projectValue: 8500000,
          clientName: 'Rajesh Kumar',
          images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
          status: 'completed',
          rating: 5,
          testimonial: 'Excellent work quality and timely delivery. Highly recommended!'
        },
        {
          _id: '2',
          title: 'Office Complex Renovation',
          description: 'Complete renovation of a 3-floor office complex including modern interiors and electrical upgrades.',
          category: 'commercial',
          location: 'Koramangala, Bangalore',
          completedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          projectValue: 12000000,
          clientName: 'Tech Solutions Pvt Ltd',
          images: ['/api/placeholder/400/300'],
          status: 'completed',
          rating: 4.8,
        },
        {
          _id: '3',
          title: 'Luxury Apartment Interior',
          description: 'High-end interior design and execution for a 3BHK luxury apartment.',
          category: 'interior',
          location: 'HSR Layout, Bangalore',
          completedDate: new Date().toISOString(),
          projectValue: 2500000,
          clientName: 'Priya Sharma',
          images: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
          status: 'ongoing',
        },
      ];
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => 
    selectedCategory === 'all' || project.category === selectedCategory
  );

  const breadcrumbs = [
    { label: 'Contractor Dashboard', href: '/contractor/dashboard' },
    { label: 'Portfolio', current: true }
  ];

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['contractor']}>
        <DashboardLayout
          breadcrumbs={breadcrumbs}
          title="My Portfolio"
          description="Showcase your completed projects and work"
        >
          <Loading />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['contractor']}>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="My Portfolio"
        description="Showcase your completed projects and work"
        actions={
          <Button variant="primary" onClick={() => setIsAddingProject(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        }
      >
        <div className="space-y-6">
          {/* Portfolio Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projects.filter(p => p.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(projects.reduce((sum, p) => sum + p.projectValue, 0))}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(projects.filter(p => p.rating).reduce((sum, p) => sum + (p.rating || 0), 0) / 
                        projects.filter(p => p.rating).length || 0).toFixed(1)}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  All Projects
                </Button>
                {PROJECT_CATEGORIES.map(category => {
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.value}
                      variant={selectedCategory === category.value ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      <IconComponent className="w-4 h-4 mr-1" />
                      {category.label}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {projects.length === 0 ? 'No projects in portfolio' : 'No projects in this category'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {projects.length === 0 
                    ? 'Start building your portfolio by adding your completed projects.'
                    : 'Try selecting a different category or add projects in this category.'
                  }
                </p>
                {projects.length === 0 && (
                  <Button variant="primary" onClick={() => setIsAddingProject(true)}>
                    Add Your First Project
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const statusConfig = PROJECT_STATUS_CONFIG[project.status];
                const StatusIcon = statusConfig.icon;
                const categoryConfig = PROJECT_CATEGORIES.find(c => c.value === project.category);
                const CategoryIcon = categoryConfig?.icon || FileText;
                
                return (
                  <Card key={project._id} className="hover:shadow-lg transition-shadow">
                    <div className="relative">
                      {/* Project Image */}
                      <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                        {project.images[0] ? (
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} ${statusConfig.bgColor}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{project.title}</h3>
                        <div className="flex items-center gap-1 ml-2">
                          <CategoryIcon className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {project.location}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {project.status === 'completed' ? 'Completed' : 'Started'} {formatRelativeTime(project.completedDate)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(project.projectValue)}
                        </div>
                      </div>

                      {project.rating && (
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{project.rating}</span>
                          <span className="text-xs text-gray-500">by {project.clientName}</span>
                        </div>
                      )}

                      {project.testimonial && (
                        <blockquote className="text-xs text-gray-600 italic mb-3 line-clamp-2">
                          "{project.testimonial}"
                        </blockquote>
                      )}

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Add Project Modal */}
          {isAddingProject && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Add New Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Title *
                      </label>
                      <Input placeholder="Enter project title" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                        {PROJECT_CATEGORIES.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Describe the project..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <Input placeholder="Project location" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Value (₹) *
                      </label>
                      <Input type="number" placeholder="Enter project value" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Upload project images</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddingProject(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary">
                      Add Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
