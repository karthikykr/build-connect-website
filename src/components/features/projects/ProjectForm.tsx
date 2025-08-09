'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Plus,
  X,
  Home,
  FileText,
  DollarSign,
  Calendar,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { Project } from '@/types';
import { CreateProjectRequest, ProjectRequirement } from '@/services/sites.service';
import { sitesService } from '@/services/sites.service';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: CreateProjectRequest) => void;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
}

interface FormData {
  projectName: string;
  siteId: string;
  requirements: ProjectRequirement[];
  budget: string;
  timeline: string;
  description: string;
}

const REQUIREMENT_CATEGORIES = [
  'Foundation',
  'Structure',
  'Electrical',
  'Plumbing',
  'Interior',
  'Exterior',
  'Landscaping',
  'Other'
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'text-green-600 bg-green-50' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-50' },
  { value: 'high', label: 'High', color: 'text-red-600 bg-red-50' }
];

export function ProjectForm({ project, onSubmit, isSubmitting = false, mode }: ProjectFormProps) {
  const [formData, setFormData] = useState<FormData>({
    projectName: project?.projectName || '',
    siteId: '',
    requirements: [],
    budget: '',
    timeline: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sites, setSites] = useState<any[]>([]);
  const [isLoadingSites, setIsLoadingSites] = useState(true);

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const response = await sitesService.getSites();
      if (response.success && response.data) {
        setSites(response.data);
      }
    } catch (error) {
      console.error('Error loading sites:', error);
    } finally {
      setIsLoadingSites(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addRequirement = () => {
    const newRequirement: ProjectRequirement = {
      title: '',
      description: '',
      category: 'Other',
      priority: 'medium',
      estimatedCost: 0,
    };
    
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, newRequirement],
    }));
  };

  const updateRequirement = (index: number, field: keyof ProjectRequirement, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => 
        i === index ? { ...req, [field]: value } : req
      ),
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    if (formData.requirements.length === 0) {
      newErrors.requirements = 'At least one requirement is needed';
    }

    // Validate each requirement
    formData.requirements.forEach((req, index) => {
      if (!req.title.trim()) {
        newErrors[`requirement_${index}_title`] = 'Requirement title is required';
      }
      if (!req.description.trim()) {
        newErrors[`requirement_${index}_description`] = 'Requirement description is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const projectData: CreateProjectRequest = {
      projectName: formData.projectName,
      siteId: formData.siteId || undefined,
      requirements: formData.requirements,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      timeline: formData.timeline || undefined,
      description: formData.description,
    };

    onSubmit(projectData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Project Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <Input
                value={formData.projectName}
                onChange={e => handleInputChange('projectName', e.target.value)}
                placeholder="Enter project name"
                error={errors.projectName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Associated Site
              </label>
              <select
                value={formData.siteId}
                onChange={e => handleInputChange('siteId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isLoadingSites}
              >
                <option value="">Select a site (optional)</option>
                {sites.map(site => (
                  <option key={site._id} value={site._id}>
                    {site.name} - {site.location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget (₹)
              </label>
              <Input
                type="number"
                value={formData.budget}
                onChange={e => handleInputChange('budget', e.target.value)}
                placeholder="Enter estimated budget"
                leftIcon={<DollarSign className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeline
              </label>
              <Input
                value={formData.timeline}
                onChange={e => handleInputChange('timeline', e.target.value)}
                placeholder="e.g., 6 months, 1 year"
                leftIcon={<Calendar className="w-4 h-4" />}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Description *
            </label>
            <textarea
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="Describe your project in detail..."
              rows={5}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Project Requirements
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRequirement}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Requirement
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.requirements.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requirements added</h3>
              <p className="text-gray-600 mb-4">Add project requirements to help professionals understand your needs.</p>
              <Button
                type="button"
                variant="primary"
                onClick={addRequirement}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add First Requirement
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.requirements.map((requirement, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        Requirement #{index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title *
                        </label>
                        <Input
                          value={requirement.title}
                          onChange={e => updateRequirement(index, 'title', e.target.value)}
                          placeholder="Requirement title"
                          error={errors[`requirement_${index}_title`]}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={requirement.category}
                          onChange={e => updateRequirement(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {REQUIREMENT_CATEGORIES.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors[`requirement_${index}_description`] ? 'border-red-500' : ''}`}
                        value={requirement.description}
                        onChange={e => updateRequirement(index, 'description', e.target.value)}
                        placeholder="Describe this requirement in detail..."
                        rows={3}
                      />
                      {errors[`requirement_${index}_description`] && (
                        <p className="text-sm text-red-600 mt-1">{errors[`requirement_${index}_description`]}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Priority
                        </label>
                        <select
                          value={requirement.priority}
                          onChange={e => updateRequirement(index, 'priority', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {PRIORITY_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estimated Cost (₹)
                        </label>
                        <Input
                          type="number"
                          value={requirement.estimatedCost?.toString() || ''}
                          onChange={e => updateRequirement(index, 'estimatedCost', parseFloat(e.target.value) || 0)}
                          placeholder="Estimated cost"
                          leftIcon={<DollarSign className="w-4 h-4" />}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {errors.requirements && (
            <p className="text-sm text-red-600">{errors.requirements}</p>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {mode === 'create' ? 'Create Project' : 'Update Project'}
        </Button>
      </div>
    </form>
  );
}
