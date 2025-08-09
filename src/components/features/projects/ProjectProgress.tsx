'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Plus,
  Calendar,
  User,
  Image as ImageIcon,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload
} from 'lucide-react';
import { Project, ProgressLog } from '@/types';
import { sitesService, CreateProgressLogRequest } from '@/services/sites.service';
import { formatRelativeTime } from '@/lib/utils';

interface ProjectProgressProps {
  project: Project;
  onUpdate: () => void;
}

export function ProjectProgress({ project, onUpdate }: ProjectProgressProps) {
  const [isAddingProgress, setIsAddingProgress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateProgressLogRequest>({
    title: '',
    description: '',
    stage: '',
    images: [],
  });

  const handleInputChange = (field: keyof CreateProgressLogRequest, value: string | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, images: files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.stage.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await sitesService.addProgressLog(project._id, formData);
      
      if (response.success) {
        setFormData({
          title: '',
          description: '',
          stage: '',
          images: [],
        });
        setIsAddingProgress(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error adding progress log:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProgress = async (logId: string) => {
    if (!confirm('Are you sure you want to delete this progress update?')) {
      return;
    }

    try {
      const response = await sitesService.deleteProgressLog(project._id, logId);
      if (response.success) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting progress log:', error);
    }
  };

  const getProgressIcon = (index: number, total: number) => {
    if (index === total - 1) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    return <Clock className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Add Progress Button */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
              <p className="text-gray-600">Track and document project milestones</p>
            </div>
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddingProgress(true)}
            >
              Add Progress Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Progress Form */}
      {isAddingProgress && (
        <Card>
          <CardHeader>
            <CardTitle>Add Progress Update</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stage/Milestone *
                  </label>
                  <Input
                    value={formData.stage}
                    onChange={e => handleInputChange('stage', e.target.value)}
                    placeholder="e.g., Foundation Complete, Framing Started"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    placeholder="Progress update title"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                  placeholder="Describe the progress made..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                        <span>Upload images</span>
                        <input
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                  
                  {formData.images && formData.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {formData.images.length} image(s) selected
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(formData.images).map((file, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800">
                            {file.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingProgress(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Add Progress Update
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Progress Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Progress Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {project.progressLogs.length > 0 ? (
            <div className="space-y-6">
              {project.progressLogs
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((log, index) => (
                  <div key={log._id} className="relative">
                    {/* Timeline line */}
                    {index < project.progressLogs.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      {/* Timeline icon */}
                      <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                        {getProgressIcon(index, project.progressLogs.length)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">{log.stage}</h4>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-500">{formatRelativeTime(log.date)}</span>
                              </div>
                              
                              <p className="text-gray-700 mb-3">{log.description}</p>
                              
                              {log.images && log.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                                  {log.images.map((image, imgIndex) => (
                                    <div key={imgIndex} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                      <img
                                        src={image}
                                        alt={`Progress ${imgIndex + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {log.addedByRole}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatRelativeTime(log.createdAt)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProgress(log._id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No progress updates yet</h3>
              <p className="text-gray-600 mb-6">
                Start documenting your project progress by adding the first update.
              </p>
              <Button
                variant="primary"
                onClick={() => setIsAddingProgress(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add First Progress Update
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
