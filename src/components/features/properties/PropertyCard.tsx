import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  MapPin,
  Home,
  Eye,
  Heart,
  Share2,
  Verified,
  Calendar,
  User,
  MessageCircle,
} from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  onSave?: (propertyId: string) => void;
  onShare?: (propertyId: string) => void;
  isSaved?: boolean;
  className?: string;
}

export function PropertyCard({
  property,
  onSave,
  onShare,
  isSaved = false,
  className,
}: PropertyCardProps) {
  const primaryImage =
    property.images.find(img => img.isPrimary) || property.images[0];

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSave?.(property.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(property.id);
  };

  return (
    <Card
      className={`hover:shadow-card-hover overflow-hidden transition-shadow duration-300 ${className}`}
    >
      <Link href={`/properties/${property.id}`}>
        <div className="relative">
          {/* Property Image */}
          <div className="bg-gray-light relative aspect-video overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={property.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="from-primary/20 to-secondary/20 flex h-full w-full items-center justify-center bg-gradient-to-br">
                <Home className="text-primary/50 h-12 w-12" />
              </div>
            )}

            {/* Verification Badge */}
            {property.isVerified && (
              <div className="bg-success absolute left-3 top-3 flex items-center rounded-lg px-2 py-1 text-xs font-medium text-white">
                <Verified className="mr-1 h-3 w-3" />
                Verified
              </div>
            )}

            {/* Property Type Badge */}
            <div className="absolute right-3 top-3 rounded-lg bg-black/50 px-2 py-1 text-xs text-white">
              {property.type.replace('_', ' ').toUpperCase()}
            </div>

            {/* Views Count */}
            <div className="absolute bottom-3 left-3 flex items-center rounded-lg bg-black/50 px-2 py-1 text-xs text-white">
              <Eye className="mr-1 h-3 w-3" />
              {property.views}
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-3 right-3 flex space-x-2">
              <button
                onClick={handleSave}
                className={`rounded-lg p-2 transition-colors ${
                  isSaved
                    ? 'bg-error text-white'
                    : 'bg-black/50 text-white hover:bg-black/70'
                }`}
              >
                <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="rounded-lg bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Property Title */}
          <h3 className="text-text-primary mb-2 line-clamp-2 font-semibold">
            {property.title}
          </h3>

          {/* Location */}
          <div className="text-text-secondary mb-3 flex items-center text-sm">
            <MapPin className="mr-1 h-4 w-4" />
            <span className="truncate">
              {property.location.city}, {property.location.state}
            </span>
          </div>

          {/* Price and Area */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-primary text-xl font-bold">
                {formatCurrency(property.price)}
              </p>
              <p className="text-text-secondary text-sm">
                {property.area} {property.unit}
              </p>
            </div>
            <div className="text-right">
              <p className="text-text-secondary text-sm">
                {formatCurrency(Math.round(property.price / property.area))} per{' '}
                {property.unit}
              </p>
            </div>
          </div>

          {/* Broker Info */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-primary mr-2 flex h-8 w-8 items-center justify-center rounded-full">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-text-primary text-sm font-medium">
                  {property.broker.name}
                </p>
                <p className="text-text-secondary text-xs">
                  {property.broker.experience}+ years exp
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-text-secondary flex items-center text-xs">
                <Calendar className="mr-1 h-3 w-3" />
                {formatRelativeTime(property.createdAt)}
              </p>
            </div>
          </div>

          {/* Amenities Preview */}
          {property.amenities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-gray-light text-text-secondary rounded px-2 py-1 text-xs"
                  >
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="text-text-secondary text-xs">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button variant="primary" className="flex-1">
              View Details
            </Button>
            <Button variant="outline" size="icon">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
