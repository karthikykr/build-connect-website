import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Home, 
  Users, 
  MessageCircle, 
  UserCheck, 
  FileText,
  Clock
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  type: 'property_view' | 'message' | 'broker_contact' | 'application' | 'listing';
  title: string;
  description: string;
  timestamp: string;
  link?: string;
  user?: {
    name: string;
    role: string;
  };
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  className?: string;
}

// Mock data for demonstration
const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'property_view',
    title: 'Property Viewed',
    description: 'Premium Residential Plot in Whitefield',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    link: '/properties/1',
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    description: 'Broker inquiry about your property listing',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    link: '/chat/2',
    user: {
      name: 'Rajesh Kumar',
      role: 'Broker',
    },
  },
  {
    id: '3',
    type: 'broker_contact',
    title: 'Broker Contact',
    description: 'Connected with site scout for property search',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    link: '/brokers/3',
    user: {
      name: 'Priya Sharma',
      role: 'Site Scout',
    },
  },
  {
    id: '4',
    type: 'application',
    title: 'Application Update',
    description: 'Broker verification documents approved',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    link: '/brokers/dashboard',
  },
  {
    id: '5',
    type: 'listing',
    title: 'New Listing',
    description: 'Commercial plot added to your portfolio',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    link: '/properties/my-listings',
  },
];

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'property_view':
      return <Home className="w-4 h-4" />;
    case 'message':
      return <MessageCircle className="w-4 h-4" />;
    case 'broker_contact':
      return <Users className="w-4 h-4" />;
    case 'application':
      return <UserCheck className="w-4 h-4" />;
    case 'listing':
      return <FileText className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'property_view':
      return 'bg-blue-100 text-blue-600';
    case 'message':
      return 'bg-green-100 text-green-600';
    case 'broker_contact':
      return 'bg-purple-100 text-purple-600';
    case 'application':
      return 'bg-orange-100 text-orange-600';
    case 'listing':
      return 'bg-primary/10 text-primary';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export function RecentActivity({ activities, className }: RecentActivityProps) {
  // Use mock activities only if no activities are provided (for demo purposes)
  const displayActivities = activities || mockActivities;
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Activity</span>
          <Link href="/activity">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              {/* Activity Icon */}
              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text-primary">
                    {activity.title}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
                
                <p className="text-sm text-text-secondary mt-1">
                  {activity.description}
                </p>
                
                {activity.user && (
                  <div className="flex items-center mt-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs text-white font-medium">
                        {activity.user.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-xs text-text-secondary">
                      {activity.user.name} • {activity.user.role}
                    </span>
                  </div>
                )}
                
                {activity.link && (
                  <Link href={activity.link}>
                    <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-primary">
                      View Details →
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {displayActivities.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
