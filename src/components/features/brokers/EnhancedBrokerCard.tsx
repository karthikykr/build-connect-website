'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Star,
  MapPin,
  User,
  MessageCircle,
  Phone,
  Shield,
  Award,
  Clock,
  Eye,
  DollarSign,
  Home,
  TrendingUp,
  Calendar,
  CheckCircle
} from 'lucide-react';

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
  broker: EnhancedBroker;
  onContact?: (brokerId: string) => void;
  viewMode?: 'grid' | 'list';
  className?: string;
}

export function BrokerCard({ broker, onContact, viewMode = 'grid', className }: BrokerCardProps) {
  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContact?.(broker.id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (viewMode === 'list') {
    return (
      <Card className={`overflow-hidden hover:shadow-card-hover transition-shadow duration-300 ${className}`}>
        <Link href={`/brokers/${broker.id}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  {broker.profileImage ? (
                    <img
                      src={broker.profileImage}
                      alt={broker.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h3 className="text-lg font-semibold text-text-primary mr-2">
                      {broker.name}
                    </h3>
                    {broker.verified && (
                      <Shield className="w-5 h-5 text-success" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{broker.location.city}, {broker.location.state}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{broker.experience} experience</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Responds in {broker.responseTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-warning fill-current mr-1" />
                      <span className="font-semibold">{broker.rating}</span>
                      <span className="text-text-secondary ml-1">({broker.reviewCount})</span>
                    </div>
                    <div className="flex items-center">
                      <Home className="w-4 h-4 mr-1" />
                      <span>{broker.stats.totalProperties} properties</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>{broker.successRate}% success rate</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleContact}>
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Contact
                </Button>
                <Button variant="primary" size="sm">
                  View Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden hover:shadow-card-hover transition-shadow duration-300 ${className}`}>
      <Link href={`/brokers/${broker.id}`}>
        <CardContent className="p-6">
          {/* Broker Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mr-4">
                {broker.profileImage ? (
                  <img
                    src={broker.profileImage}
                    alt={broker.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <h3 className="text-lg font-semibold text-text-primary mr-2">
                    {broker.name}
                  </h3>
                  {broker.verified && (
                    <Shield className="w-5 h-5 text-success" />
                  )}
                </div>
                <div className="flex items-center text-sm text-text-secondary mb-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{broker.location.city}, {broker.location.state}</span>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{broker.experience} experience</span>
                </div>
              </div>
            </div>
            
            {/* Rating */}
            <div className="text-right">
              <div className="flex items-center mb-1">
                <Star className="w-4 h-4 text-warning fill-current mr-1" />
                <span className="font-semibold text-text-primary">{broker.rating}</span>
                <span className="text-sm text-text-secondary ml-1">
                  ({broker.reviewCount})
                </span>
              </div>
              <div className="text-xs text-text-secondary">
                {broker.successRate}% success rate
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {broker.specializations.slice(0, 3).map((spec, index) => (
                <span
                  key={index}
                  className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium"
                >
                  {spec}
                </span>
              ))}
              {broker.specializations.length > 3 && (
                <span className="inline-block bg-gray-light text-text-secondary px-2 py-1 rounded text-xs">
                  +{broker.specializations.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-text-primary">{broker.stats.totalProperties}</p>
              <p className="text-xs text-text-secondary">Properties</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-text-primary">{broker.stats.propertiesSold}</p>
              <p className="text-xs text-text-secondary">Sold</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary mb-4 line-clamp-2">
            {broker.description}
          </p>

          {/* Response Time */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-text-secondary">
              <Clock className="w-4 h-4 mr-1" />
              <span>Responds in {broker.responseTime}</span>
            </div>
            <div className="text-sm text-text-secondary">
              Active {formatRelativeTime(broker.lastActive)}
            </div>
          </div>

          {/* Certifications */}
          {broker.certifications.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-warning" />
                <span className="text-xs text-text-secondary">
                  {broker.certifications.join(', ')}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleContact}
              className="flex-1"
              leftIcon={<MessageCircle className="w-4 h-4" />}
            >
              Contact
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              leftIcon={<Eye className="w-4 h-4" />}
            >
              View Profile
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
