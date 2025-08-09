'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
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
  Phone,
  Mail,
  Download,
  ChevronLeft,
  ChevronRight,
  Star,
  Maximize
} from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { Property } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function PropertyDetailsPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Simulate API call to fetch property details
    setTimeout(() => {
      // Mock property data
      const mockProperty: Property = {
        id: propertyId,
        title: 'Premium Residential Plot in Whitefield',
        description: 'This beautiful residential plot is located in the heart of Whitefield, one of Bangalore\'s most sought-after areas. The plot comes with all modern amenities and excellent connectivity to major IT hubs. Perfect for building your dream home with easy access to schools, hospitals, and shopping centers.',
        type: 'residential_plot',
        price: 2500000,
        area: 1200,
        unit: 'sqft',
        location: {
          street: 'Whitefield Main Road, Near ITPL',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560066',
          country: 'India',
          latitude: 12.9698,
          longitude: 77.7500,
        },
        images: [
          {
            id: '1',
            url: '/api/placeholder/800/600',
            thumbnail: '/api/placeholder/200/150',
            caption: 'Front view of the plot',
            isPrimary: true,
          },
          {
            id: '2',
            url: '/api/placeholder/800/600',
            thumbnail: '/api/placeholder/200/150',
            caption: 'Side view',
            isPrimary: false,
          },
          {
            id: '3',
            url: '/api/placeholder/800/600',
            thumbnail: '/api/placeholder/200/150',
            caption: 'Road access',
            isPrimary: false,
          },
        ],
        amenities: [
          'Water Supply',
          'Electricity',
          'Road Access',
          'Drainage',
          'Security',
          'Street Lights',
          'Waste Management',
          'Park Nearby'
        ],
        features: [
          { name: 'Plot Type', value: 'Corner Plot', category: 'basic' },
          { name: 'Facing', value: 'East', category: 'basic' },
          { name: 'Road Width', value: '40 feet', category: 'location' },
          { name: 'BMRDA Approved', value: true, category: 'legal' },
          { name: 'Clear Title', value: true, category: 'legal' },
        ],
        documents: [
          {
            id: '1',
            type: 'encumbrance_certificate',
            url: '/documents/ec.pdf',
            name: 'Encumbrance Certificate',
            size: 1024000,
            uploadedAt: '2024-01-10T10:00:00Z',
            isVerified: true,
          },
          {
            id: '2',
            type: 'property_tax_receipt',
            url: '/documents/tax.pdf',
            name: 'Property Tax Receipt',
            size: 512000,
            uploadedAt: '2024-01-10T10:00:00Z',
            isVerified: true,
          },
        ],
        broker: {
          id: '1',
          name: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          phone: '9876543210',
          role: 'broker',
          isVerified: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          experience: 5,
          serviceAreas: ['Bangalore', 'Whitefield'],
          specializations: ['residential_plot'],
          rating: 4.5,
          reviewCount: 25,
          totalSales: 50,
          commission: 2,
          portfolio: [],
          isApproved: true,
        },
        status: 'available',
        isVerified: true,
        views: 245,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      };

      setProperty(mockProperty);
      setLoading(false);
    }, 1000);
  }, [propertyId]);

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    navigator.share?.({
      title: property?.title,
      url: window.location.href,
    });
  };

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container-custom py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Loading property details..." />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!property) {
    return (
      <MainLayout>
        <div className="container-custom py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Property Not Found
            </h1>
            <p className="text-text-secondary mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/properties">
              <Button variant="primary">Back to Properties</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const breadcrumbs = [
    { label: 'Properties', href: '/properties' },
    { label: property.title, current: true }
  ];

  return (
    <MainLayout>
      <div className="container-custom py-8">
        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="mb-8">
              <div className="relative">
                <div className="aspect-video bg-gray-light relative overflow-hidden rounded-t-2xl">
                  {property.images[currentImageIndex] ? (
                    <img
                      src={property.images[currentImageIndex].url}
                      alt={property.images[currentImageIndex].caption || property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Home className="w-16 h-16 text-primary/50" />
                    </div>
                  )}
                  
                  {/* Navigation Arrows */}
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                  
                  {/* Verification Badge */}
                  {property.isVerified && (
                    <div className="absolute top-4 left-4 bg-success text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center">
                      <Verified className="w-4 h-4 mr-1" />
                      Verified
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={handleSave}
                      className={`p-2 rounded-lg transition-colors ${
                        isSaved 
                          ? 'bg-error text-white' 
                          : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Thumbnail Strip */}
                {property.images.length > 1 && (
                  <div className="p-4 border-t border-gray-light">
                    <div className="flex space-x-2 overflow-x-auto">
                      {property.images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            index === currentImageIndex 
                              ? 'border-primary' 
                              : 'border-gray-light hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={image.thumbnail}
                            alt={image.caption || `Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Property Details */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center text-text-secondary mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location.street}, {property.location.city}, {property.location.state}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary mb-1">
                      {formatCurrency(property.price)}
                    </p>
                    <p className="text-text-secondary">
                      {formatCurrency(Math.round(property.price / property.area))} per {property.unit}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-light rounded-lg">
                    <Maximize className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-text-secondary">Area</p>
                    <p className="font-semibold">{property.area} {property.unit}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-light rounded-lg">
                    <Home className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-text-secondary">Type</p>
                    <p className="font-semibold">{property.type.replace('_', ' ')}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-light rounded-lg">
                    <Eye className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-text-secondary">Views</p>
                    <p className="font-semibold">{property.views}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-light rounded-lg">
                    <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-text-secondary">Listed</p>
                    <p className="font-semibold">{formatRelativeTime(property.createdAt)}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-text-secondary leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Features */}
                {property.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-light rounded-lg">
                          <span className="font-medium">{feature.name}</span>
                          <span className="text-text-secondary">
                            {typeof feature.value === 'boolean' 
                              ? (feature.value ? '✓' : '✗')
                              : feature.value
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {property.amenities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            {property.documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {property.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-light rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                            <Download className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-text-secondary">
                              {(doc.size / 1024 / 1024).toFixed(1)} MB
                              {doc.isVerified && (
                                <span className="ml-2 text-success">✓ Verified</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Broker Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Listed by</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{property.broker.name}</p>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-warning fill-current mr-1" />
                      <span className="text-sm">{property.broker.rating}</span>
                      <span className="text-sm text-text-secondary ml-1">
                        ({property.broker.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-text-secondary">
                    {property.broker.experience}+ years experience
                  </p>
                  <p className="text-sm text-text-secondary">
                    {property.broker.totalSales} properties sold
                  </p>
                </div>

                <div className="space-y-2">
                  <Button variant="primary" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {isAuthenticated && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Schedule Visit
                    </Button>
                    <Button variant="outline" className="w-full">
                      Request Callback
                    </Button>
                    <Button variant="outline" className="w-full">
                      Get Loan Info
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
