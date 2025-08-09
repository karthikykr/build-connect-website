'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Edit,
  Plus,
  FileText,
  Tag
} from 'lucide-react';
import { Project } from '@/types';
import { ProjectRequirement } from '@/services/sites.service';
import { formatCurrency } from '@/lib/utils';

interface ProjectRequirementsProps {
  project: Project;
  onUpdate: () => void;
}

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle },
  medium: { label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: AlertTriangle },
  high: { label: 'High', color: 'text-red-600', bgColor: 'bg-red-50', icon: AlertTriangle },
};

const CATEGORY_COLORS = {
  'Foundation': 'bg-blue-100 text-blue-800',
  'Structure': 'bg-green-100 text-green-800',
  'Electrical': 'bg-yellow-100 text-yellow-800',
  'Plumbing': 'bg-purple-100 text-purple-800',
  'Interior': 'bg-pink-100 text-pink-800',
  'Exterior': 'bg-indigo-100 text-indigo-800',
  'Landscaping': 'bg-emerald-100 text-emerald-800',
  'Other': 'bg-gray-100 text-gray-800',
};

export function ProjectRequirements({ project, onUpdate }: ProjectRequirementsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Mock requirements data - in real app, this would come from project.requirements
  const mockRequirements: ProjectRequirement[] = [
    {
      title: 'Foundation Excavation',
      description: 'Excavate foundation area according to architectural plans. Depth should be 4 feet minimum with proper drainage.',
      category: 'Foundation',
      priority: 'high',
      estimatedCost: 150000,
    },
    {
      title: 'Electrical Wiring',
      description: 'Install electrical wiring throughout the building including main panel, outlets, and lighting fixtures.',
      category: 'Electrical',
      priority: 'medium',
      estimatedCost: 80000,
    },
    {
      title: 'Plumbing Installation',
      description: 'Install water supply and drainage systems including pipes, fixtures, and connections.',
      category: 'Plumbing',
      priority: 'medium',
      estimatedCost: 120000,
    },
    {
      title: 'Interior Painting',
      description: 'Paint all interior walls with premium quality paint. Include primer and two coats.',
      category: 'Interior',
      priority: 'low',
      estimatedCost: 45000,
    },
  ];

  const filteredRequirements = mockRequirements.filter(req => {
    const matchesCategory = selectedCategory === 'all' || req.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || req.priority === selectedPriority;
    return matchesCategory && matchesPriority;
  });

  const totalEstimatedCost = mockRequirements.reduce((sum, req) => sum + (req.estimatedCost || 0), 0);
  const categories = Array.from(new Set(mockRequirements.map(req => req.category)));

  const getPriorityIcon = (priority: 'low' | 'medium' | 'high') => {
    const config = PRIORITY_CONFIG[priority];
    const IconComponent = config.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requirements</p>
                <p className="text-2xl font-bold text-gray-900">{mockRequirements.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockRequirements.filter(req => req.priority === 'high').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-50 text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estimated Cost</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalEstimatedCost)}</p>
              </div>
              <div className="p-3 rounded-full bg-green-50 text-green-600">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Priority
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Project Requirements
            </div>
            <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Requirement
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequirements.length > 0 ? (
            <div className="space-y-4">
              {filteredRequirements.map((requirement, index) => {
                const priorityConfig = PRIORITY_CONFIG[requirement.priority];
                const categoryColor = CATEGORY_COLORS[requirement.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other;
                
                return (
                  <Card key={index} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {requirement.title}
                            </h4>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color} ${priorityConfig.bgColor}`}>
                              {getPriorityIcon(requirement.priority)}
                              {priorityConfig.label} Priority
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
                              <Tag className="w-3 h-3 mr-1" />
                              {requirement.category}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{requirement.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {requirement.estimatedCost && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                Estimated: {formatCurrency(requirement.estimatedCost)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {mockRequirements.length === 0 ? 'No requirements defined' : 'No requirements match your filters'}
              </h3>
              <p className="text-gray-600 mb-6">
                {mockRequirements.length === 0 
                  ? 'Define project requirements to help professionals understand your needs.'
                  : 'Try adjusting your filters to see more requirements.'
                }
              </p>
              {mockRequirements.length === 0 && (
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                  Add First Requirement
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Requirements by Category */}
      {mockRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Requirements by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map(category => {
                const categoryRequirements = mockRequirements.filter(req => req.category === category);
                const categoryColor = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other;
                const categoryCost = categoryRequirements.reduce((sum, req) => sum + (req.estimatedCost || 0), 0);
                
                return (
                  <div key={category} className="text-center p-4 border border-gray-200 rounded-lg">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryColor} mb-2`}>
                      {category}
                    </span>
                    <p className="text-2xl font-bold text-gray-900">{categoryRequirements.length}</p>
                    <p className="text-sm text-gray-600">requirements</p>
                    {categoryCost > 0 && (
                      <p className="text-sm text-gray-500 mt-1">{formatCurrency(categoryCost)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
