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
  Wrench,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import { ContractorProfile } from '@/types';
import { formatRelativeTime, formatCurrency } from '@/lib/utils';

interface ContractorCardProps {
  contractor: ContractorProfile;
  onContact?: (contractorId: string) => void;
  className?: string;
}

export function ContractorCard({ contractor, onContact, className }: ContractorCardProps) {
  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContact?.(contractor.id);
  };

  return (
    <Card className={`overflow-hidden hover:shadow-card-hover transition-shadow duration-300 ${className}`}>
      <Link href={`/contractors/${contractor.id}`}>
        <CardContent className="p-6">
          {/* Contractor Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mr-4">
                {contractor.avatar ? (
                  <img
                    src={contractor.avatar}
                    alt={contractor.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <h3 className="text-lg font-semibold text-text-primary mr-2">
                    {contractor.name}
                  </h3>
                  {contractor.isVerified && (
                    <Verified className="w-4 h-4 text-success" />
                  )}
                </div>
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-warning fill-current mr-1" />
                  <span className="text-sm font-medium">{contractor.rating}</span>
                  <span className="text-sm text-text-secondary ml-1">
                    ({contractor.reviewCount} reviews)
                  </span>
                </div>
                <p className="text-sm text-text-secondary">
                  {contractor.experience}+ years experience
                </p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
              contractor.isApproved 
                ? 'bg-success/10 text-success' 
                : 'bg-warning/10 text-warning'
            }`}>
              {contractor.isApproved ? 'Verified' : 'Pending'}
            </div>
          </div>

          {/* Company Info */}
          {contractor.companyName && (
            <div className="mb-4">
              <p className="text-sm font-medium text-text-primary">
                {contractor.companyName}
              </p>
              {contractor.licenseNumber && (
                <p className="text-xs text-text-secondary">
                  License: {contractor.licenseNumber}
                </p>
              )}
            </div>
          )}

          {/* Service Areas */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <MapPin className="w-4 h-4 text-text-secondary mr-1" />
              <span className="text-sm font-medium text-text-primary">Service Areas</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {contractor.serviceAreas.slice(0, 3).map((area, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-light px-2 py-1 rounded text-text-secondary"
                >
                  {area}
                </span>
              ))}
              {contractor.serviceAreas.length > 3 && (
                <span className="text-xs text-text-secondary">
                  +{contractor.serviceAreas.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Specializations */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Wrench className="w-4 h-4 text-text-secondary mr-1" />
              <span className="text-sm font-medium text-text-primary">Specializations</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {contractor.specializations.slice(0, 2).map((spec, index) => (
                <span
                  key={index}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                >
                  {spec.replace('_', ' ').toUpperCase()}
                </span>
              ))}
              {contractor.specializations.length > 2 && (
                <span className="text-xs text-text-secondary">
                  +{contractor.specializations.length - 2} more
                </span>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-4 h-4 text-primary mr-1" />
              </div>
              <p className="text-lg font-bold text-text-primary">{contractor.completedProjects}</p>
              <p className="text-xs text-text-secondary">Projects</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Award className="w-4 h-4 text-primary mr-1" />
              </div>
              <p className="text-lg font-bold text-text-primary">{contractor.portfolio.length}</p>
              <p className="text-xs text-text-secondary">Portfolio</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-4 h-4 text-primary mr-1" />
              </div>
              <p className="text-lg font-bold text-text-primary">
                {contractor.hourlyRate ? `₹${contractor.hourlyRate}` : 'Quote'}
              </p>
              <p className="text-xs text-text-secondary">Per Hour</p>
            </div>
          </div>

          {/* Join Date */}
          <div className="mb-4">
            <p className="text-xs text-text-secondary">
              Member since {formatRelativeTime(contractor.createdAt)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button variant="primary" className="flex-1">
              View Profile
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleContact}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
