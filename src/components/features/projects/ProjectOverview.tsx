'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Calendar,
  User,
  MapPin,
  DollarSign,
  Clock,
  FileText,
  Edit,
  Users,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Project } from '@/types';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

interface ProjectOverviewProps {
  project: Project;
  onUpdate: () => void;
}

export function ProjectOverview({ project, onUpdate }: ProjectOverviewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const projectStats = [
    {
      label: 'Progress Updates',
      value: project.progressLogs.length,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      label: 'Days Active',
      value: project.actualStartDate 
        ? Math.ceil((new Date().getTime() - new Date(project.actualStartDate).getTime()) / (1000 * 60 * 60 * 24))
        : 0,
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      label: 'Team Members',
      value: [project.contractorId, project.brokerId].filter(Boolean).length,
      icon: Users,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projectStats.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                    <StatIcon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Project Name</label>
              <p className="text-gray-900 font-medium">{project.projectName}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <p className="text-gray-900">{project.status}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Created</label>
              <p className="text-gray-900">{formatRelativeTime(project.createdAt)}</p>
            </div>

            {project.actualStartDate && (
              <div>
                <label className="text-sm font-medium text-gray-600">Started</label>
                <p className="text-gray-900">{formatRelativeTime(project.actualStartDate)}</p>
              </div>
            )}

            {project.actualEndDate && (
              <div>
                <label className="text-sm font-medium text-gray-600">Completed</label>
                <p className="text-gray-900">{formatRelativeTime(project.actualEndDate)}</p>
              </div>
            )}

            {project.remarks && (
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900">{project.remarks}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Project Team
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Project Owner</label>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">You</p>
                  <p className="text-sm text-gray-600">Project Owner</p>
                </div>
              </div>
            </div>

            {project.contractorId && (
              <div>
                <label className="text-sm font-medium text-gray-600">Contractor</label>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Contractor</p>
                    <p className="text-sm text-gray-600">Construction Lead</p>
                  </div>
                </div>
              </div>
            )}

            {project.brokerId && (
              <div>
                <label className="text-sm font-medium text-gray-600">Broker</label>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Broker</p>
                    <p className="text-sm text-gray-600">Property Consultant</p>
                  </div>
                </div>
              </div>
            )}

            {!project.contractorId && !project.brokerId && (
              <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No team members assigned yet</p>
                <p className="text-gray-500 text-xs mt-1">
                  Send service requests to add professionals to your project
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {project.progressLogs.length > 0 ? (
            <div className="space-y-4">
              {project.progressLogs.slice(0, 5).map((log, index) => (
                <div key={log._id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{log.stage}</h4>
                      <span className="text-xs text-gray-500">{formatRelativeTime(log.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{log.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      by {log.addedByRole} • {formatRelativeTime(log.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              
              {project.progressLogs.length > 5 && (
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm">
                    View All Activity
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
              <p className="text-gray-600">
                Progress updates and activities will appear here as your project moves forward.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start" leftIcon={<Edit className="w-4 h-4" />}>
              Update Project Status
            </Button>
            <Button variant="outline" className="justify-start" leftIcon={<Users className="w-4 h-4" />}>
              Find Professionals
            </Button>
            <Button variant="outline" className="justify-start" leftIcon={<CheckCircle className="w-4 h-4" />}>
              Add Progress Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
