'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { 
  Star, 
  MapPin, 
  User, 
  MessageCircle, 
  Phone,
  Mail,
  Verified,
  Wrench,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { ContractorProfile, PortfolioItem } from '@/types';
import { formatRelativeTime, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function ContractorProfilePage() {
  const params = useParams();
  const contractorId = params.id as string;
  const [contractor, setContractor] = useState<ContractorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');

  useEffect(() => {
    // Simulate API call to fetch contractor details
    setTimeout(() => {
      const mockContractor: ContractorProfile = {
        id: contractorId,
        name: 'Suresh Construction',
        email: 'suresh@example.com',
        phone: '9876543210',
        role: 'contractor',
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        experience: 8,
        serviceAreas: ['Bangalore', 'Whitefield', 'Electronic City', 'Sarjapur'],
        specializations: ['house_construction', 'renovation', 'interior_design'],
        rating: 4.7,
        reviewCount: 35,
        completedProjects: 125,
        portfolio: [
          {
            id: '1',
            title: 'Modern Villa Construction',
            description: 'Complete construction of a 3BHK villa with modern amenities',
            images: ['/api/placeholder/600/400'],
            category: 'house_construction',
            completedAt: '2024-01-15T00:00:00Z',
            cost: 2500000,
            duration: 8,
            location: 'Whitefield, Bangalore',
          },
          {
            id: '2',
            title: 'Office Interior Design',
            description: 'Complete interior renovation of a corporate office space',
            images: ['/api/placeholder/600/400'],
            category: 'interior_design',
            completedAt: '2024-02-20T00:00:00Z',
            cost: 800000,
            duration: 3,
            location: 'Electronic City, Bangalore',
          },
        ],
        isApproved: true,
        approvedAt: '2024-01-01T00:00:00Z',
        companyName: 'Suresh Construction Pvt Ltd',
        licenseNumber: 'CON/KA/2024/001',
        hourlyRate: 500,
        address: {
          street: '456 Construction Street',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          country: 'India',
        },
      };

      setContractor(mockContractor);
      setLoading(false);
    }, 1000);
  }, [contractorId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container-custom py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Loading contractor profile..." />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!contractor) {
    return (
      <MainLayout>
        <div className="container-custom py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Contractor Not Found
            </h1>
            <p className="text-text-secondary mb-6">
              The contractor profile you're looking for doesn't exist.
            </p>
            <Link href="/contractors">
              <Button variant="primary">Back to Contractors</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const breadcrumbs = [
    { label: 'Contractors', href: '/contractors' },
    { label: contractor.name, current: true }
  ];

  return (
    <MainLayout>
      <div className="container-custom py-8">
        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Contractor Header */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mr-6 mb-4 md:mb-0">
                    {contractor.avatar ? (
                      <img
                        src={contractor.avatar}
                        alt={contractor.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h1 className="text-3xl font-bold text-text-primary mr-3">
                        {contractor.name}
                      </h1>
                      {contractor.isVerified && (
                        <Verified className="w-6 h-6 text-success" />
                      )}
                    </div>
                    
                    {contractor.companyName && (
                      <p className="text-lg text-text-secondary mb-2">
                        {contractor.companyName}
                      </p>
                    )}
                    
                    <div className="flex items-center mb-3">
                      <Star className="w-5 h-5 text-warning fill-current mr-1" />
                      <span className="text-lg font-medium mr-2">{contractor.rating}</span>
                      <span className="text-text-secondary">
                        ({contractor.reviewCount} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center text-text-secondary mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{contractor.address?.city}, {contractor.address?.state}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {contractor.specializations.map((spec, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-medium"
                        >
                          {spec.replace('_', ' ').toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-text-primary">{contractor.completedProjects}</p>
                  <p className="text-sm text-text-secondary">Projects Done</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-text-primary">{contractor.portfolio.length}</p>
                  <p className="text-sm text-text-secondary">Portfolio Items</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-text-primary">{contractor.experience}+</p>
                  <p className="text-sm text-text-secondary">Years Experience</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-text-primary">
                    {contractor.hourlyRate ? `₹${contractor.hourlyRate}` : 'Quote'}
                  </p>
                  <p className="text-sm text-text-secondary">Per Hour</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-light">
                <nav className="flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'portfolio', label: 'Portfolio' },
                    { id: 'reviews', label: 'Reviews' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      Professional construction contractor with {contractor.experience}+ years of experience 
                      in residential and commercial construction. Specializing in quality construction, 
                      renovation, and interior design services across Bangalore.
                    </p>
                    
                    {/* Service Areas */}
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Service Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {contractor.serviceAreas.map((area, index) => (
                          <span
                            key={index}
                            className="bg-gray-light px-3 py-1 rounded-lg text-sm"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* License Info */}
                    {contractor.licenseNumber && (
                      <div className="flex items-center text-sm text-text-secondary">
                        <CheckCircle className="w-4 h-4 text-success mr-2" />
                        License: {contractor.licenseNumber}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contractor.portfolio.slice(0, 3).map((project) => (
                        <div key={project.id} className="flex items-center">
                          <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
                          <div className="flex-1">
                            <span className="text-sm font-medium">{project.title}</span>
                            <span className="text-xs text-text-secondary ml-2">
                              {formatRelativeTime(project.completedAt)}
                            </span>
                          </div>
                          <span className="text-sm text-text-secondary">
                            {formatCurrency(project.cost)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div>
                {contractor.portfolio.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <ImageIcon className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-text-primary mb-2">
                        No Portfolio Items
                      </h3>
                      <p className="text-text-secondary">
                        This contractor hasn't added any portfolio items yet.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {contractor.portfolio.map((project) => (
                      <Card key={project.id} className="overflow-hidden">
                        <div className="aspect-video bg-gray-light relative">
                          {project.images[0] ? (
                            <img
                              src={project.images[0]}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-primary/50" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{project.title}</h3>
                          <p className="text-sm text-text-secondary mb-3">
                            {project.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-text-secondary">{project.location}</span>
                            <span className="font-medium text-primary">
                              {formatCurrency(project.cost)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-text-secondary mt-2">
                            <span>{project.duration} months</span>
                            <span>{formatRelativeTime(project.completedAt)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Reviews Coming Soon
                  </h3>
                  <p className="text-text-secondary">
                    Review system will be available in the next update.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Contact Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contact {contractor.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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
                  <Button variant="outline" className="w-full">
                    Get Quote
                  </Button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-light">
                  <p className="text-sm text-text-secondary mb-2">Response Time</p>
                  <p className="text-sm font-medium">Usually responds within 4 hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Identity Verified</span>
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Licensed Contractor</span>
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Background Checked</span>
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Insurance Verified</span>
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-light">
                  <p className="text-xs text-text-secondary">
                    Member since {formatRelativeTime(contractor.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
