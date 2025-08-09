import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Star,
  MapPin,
  User,
  MessageCircle,
  Phone,
  Verified,
  TrendingUp,
  Home,
  Calendar,
  Shield,
  Award,
  Clock,
  Eye,
  DollarSign,
} from 'lucide-react';
import { BrokerProfile } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

// Enhanced broker interface for new broker system
interface EnhancedBroker {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  experience: string;
  specializations: string[];
  location: {
    city: string;
    state: string;
    areas: string[];
  };
  stats: {
    totalProperties: number;
    propertiesSold: number;
    activeListings: number;
    totalRevenue: number;
  };
  certifications: string[];
  languages: string[];
  description: string;
  joinedDate: string;
  lastActive: string;
  responseTime: string;
  successRate: number;
}

interface BrokerCardProps {
  broker: BrokerProfile | EnhancedBroker;
  onContact?: (brokerId: string) => void;
  viewMode?: 'grid' | 'list';
  className?: string;
}

export function BrokerCard({ broker, onContact, className }: BrokerCardProps) {
  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContact?.(broker.id);
  };

  return (
    <Card
      className={`hover:shadow-card-hover overflow-hidden transition-shadow duration-300 ${className}`}
    >
      <Link href={`/brokers/${broker.id}`}>
        <CardContent className="p-6">
          {/* Broker Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center">
              <div className="bg-primary mr-4 flex h-16 w-16 items-center justify-center rounded-full">
                {broker.avatar ? (
                  <img
                    src={broker.avatar}
                    alt={broker.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <div className="mb-1 flex items-center">
                  <h3 className="text-text-primary mr-2 text-lg font-semibold">
                    {broker.name}
                  </h3>
                  {broker.isVerified && (
                    <Verified className="text-success h-4 w-4" />
                  )}
                </div>
                <div className="mb-2 flex items-center">
                  <Star className="text-warning mr-1 h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{broker.rating}</span>
                  <span className="text-text-secondary ml-1 text-sm">
                    ({broker.reviewCount} reviews)
                  </span>
                </div>
                <p className="text-text-secondary text-sm">
                  {broker.experience}+ years experience
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`rounded-lg px-3 py-1 text-xs font-medium ${
                broker.isApproved
                  ? 'bg-success/10 text-success'
                  : 'bg-warning/10 text-warning'
              }`}
            >
              {broker.isApproved ? 'Verified' : 'Pending'}
            </div>
          </div>

          {/* Service Areas */}
          <div className="mb-4">
            <div className="mb-2 flex items-center">
              <MapPin className="text-text-secondary mr-1 h-4 w-4" />
              <span className="text-text-primary text-sm font-medium">
                Service Areas
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {broker.serviceAreas.slice(0, 3).map((area, index) => (
                <span
                  key={index}
                  className="bg-gray-light text-text-secondary rounded px-2 py-1 text-xs"
                >
                  {area}
                </span>
              ))}
              {broker.serviceAreas.length > 3 && (
                <span className="text-text-secondary text-xs">
                  +{broker.serviceAreas.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Specializations */}
          <div className="mb-4">
            <div className="mb-2 flex items-center">
              <Home className="text-text-secondary mr-1 h-4 w-4" />
              <span className="text-text-primary text-sm font-medium">
                Specializations
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {broker.specializations.slice(0, 2).map((spec, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary rounded px-2 py-1 text-xs"
                >
                  {spec.replace('_', ' ').toUpperCase()}
                </span>
              ))}
              {broker.specializations.length > 2 && (
                <span className="text-text-secondary text-xs">
                  +{broker.specializations.length - 2} more
                </span>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="mb-1 flex items-center justify-center">
                <TrendingUp className="text-primary mr-1 h-4 w-4" />
              </div>
              <p className="text-text-primary text-lg font-bold">
                {broker.totalSales}
              </p>
              <p className="text-text-secondary text-xs">Sales</p>
            </div>
            <div className="text-center">
              <div className="mb-1 flex items-center justify-center">
                <Home className="text-primary mr-1 h-4 w-4" />
              </div>
              <p className="text-text-primary text-lg font-bold">
                {broker.portfolio.length}
              </p>
              <p className="text-text-secondary text-xs">Listings</p>
            </div>
            <div className="text-center">
              <div className="mb-1 flex items-center justify-center">
                <Calendar className="text-primary mr-1 h-4 w-4" />
              </div>
              <p className="text-text-primary text-lg font-bold">
                {broker.commission}%
              </p>
              <p className="text-text-secondary text-xs">Commission</p>
            </div>
          </div>

          {/* Join Date */}
          <div className="mb-4">
            <p className="text-text-secondary text-xs">
              Member since {formatRelativeTime(broker.createdAt)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button variant="primary" className="flex-1">
              View Profile
            </Button>
            <Button variant="outline" size="icon" onClick={handleContact}>
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
