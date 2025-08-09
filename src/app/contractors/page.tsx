'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { ContractorCard } from '@/components/features/contractors/ContractorCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { 
  Search, 
  Filter, 
  MapPin,
  Star,
  Wrench,
  UserPlus,
  SlidersHorizontal,
  TrendingUp,
  Award
} from 'lucide-react';
import { ContractorProfile } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

// Mock data for demonstration
const mockContractors: ContractorProfile[] = [
  {
    id: '1',
    name: 'Suresh Construction',
    email: 'suresh@example.com',
    phone: '9876543210',
    role: 'contractor',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    experience: 8,
    serviceAreas: ['Bangalore', 'Whitefield', 'Electronic City'],
    specializations: ['house_construction', 'renovation'],
    rating: 4.7,
    reviewCount: 35,
    completedProjects: 125,
    portfolio: [],
    isApproved: true,
    approvedAt: '2024-01-01T00:00:00Z',
    companyName: 'Suresh Construction Pvt Ltd',
    licenseNumber: 'CON/KA/2024/001',
    hourlyRate: 500,
  },
  {
    id: '2',
    name: 'Priya Interiors',
    email: 'priya@example.com',
    phone: '9876543211',
    role: 'contractor',
    isVerified: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    experience: 5,
    serviceAreas: ['Bangalore', 'Koramangala', 'HSR Layout'],
    specializations: ['interior_design', 'renovation'],
    rating: 4.9,
    reviewCount: 28,
    completedProjects: 85,
    portfolio: [],
    isApproved: true,
    approvedAt: '2024-01-02T00:00:00Z',
    companyName: 'Priya Interiors',
    licenseNumber: 'INT/KA/2024/002',
    hourlyRate: 750,
  },
  {
    id: '3',
    name: 'Amit Plumbing Services',
    email: 'amit@example.com',
    phone: '9876543212',
    role: 'contractor',
    isVerified: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    experience: 12,
    serviceAreas: ['Bangalore', 'Indiranagar', 'Sarjapur'],
    specializations: ['plumbing', 'electrical'],
    rating: 4.5,
    reviewCount: 42,
    completedProjects: 200,
    portfolio: [],
    isApproved: true,
    approvedAt: '2024-01-03T00:00:00Z',
    companyName: 'Amit Services',
    licenseNumber: 'PLB/KA/2024/003',
    hourlyRate: 400,
  },
];

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<ContractorProfile[]>([]);
  const [filteredContractors, setFilteredContractors] = useState<ContractorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [maxHourlyRate, setMaxHourlyRate] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setContractors(mockContractors);
      setFilteredContractors(mockContractors);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...contractors];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(contractor =>
        contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contractor.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contractor.serviceAreas.some(area => 
          area.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply area filter
    if (selectedArea) {
      filtered = filtered.filter(contractor =>
        contractor.serviceAreas.includes(selectedArea)
      );
    }

    // Apply specialization filter
    if (selectedSpecialization) {
      filtered = filtered.filter(contractor =>
        contractor.specializations.includes(selectedSpecialization as any)
      );
    }

    // Apply rating filter
    if (minRating > 0) {
      filtered = filtered.filter(contractor => contractor.rating >= minRating);
    }

    // Apply hourly rate filter
    if (maxHourlyRate > 0) {
      filtered = filtered.filter(contractor => 
        !contractor.hourlyRate || contractor.hourlyRate <= maxHourlyRate
      );
    }

    setFilteredContractors(filtered);
  }, [contractors, searchTerm, selectedArea, selectedSpecialization, minRating, maxHourlyRate]);

  const handleContact = (contractorId: string) => {
    // Implement contact functionality
    console.log('Contact contractor:', contractorId);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedArea('');
    setSelectedSpecialization('');
    setMinRating(0);
    setMaxHourlyRate(0);
  };

  const breadcrumbs = [
    { label: 'Contractors', current: true }
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="container-custom py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Loading contractors..." />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-custom py-8">
        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Contractors & Service Providers
            </h1>
            <p className="text-text-secondary">
              Find {filteredContractors.length} verified construction professionals
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {/* Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            >
              Filters
            </Button>

            {/* Become a Contractor */}
            {isAuthenticated && user?.role === 'buyer' && (
              <Link href="/contractors/apply">
                <Button variant="primary" leftIcon={<UserPlus className="w-4 h-4" />}>
                  Join as Contractor
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Wrench className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">{contractors.length}</p>
              <p className="text-sm text-text-secondary">Total Contractors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-warning mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {(contractors.reduce((sum, c) => sum + c.rating, 0) / contractors.length).toFixed(1)}
              </p>
              <p className="text-sm text-text-secondary">Average Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {contractors.reduce((sum, c) => sum + c.completedProjects, 0)}
              </p>
              <p className="text-sm text-text-secondary">Projects Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {contractors.filter(c => c.isVerified).length}
              </p>
              <p className="text-sm text-text-secondary">Verified Contractors</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-80">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Filter className="w-5 h-5 mr-2" />
                      Filters
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Search */}
                  <div className="mb-4">
                    <Input
                      placeholder="Search contractors..."
                      leftIcon={<Search className="w-4 h-4" />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Service Area */}
                  <div className="mb-4">
                    <label className="form-label">Service Area</label>
                    <select
                      className="form-input"
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                    >
                      <option value="">All Areas</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Whitefield">Whitefield</option>
                      <option value="Electronic City">Electronic City</option>
                      <option value="Koramangala">Koramangala</option>
                      <option value="HSR Layout">HSR Layout</option>
                      <option value="Indiranagar">Indiranagar</option>
                      <option value="Sarjapur">Sarjapur</option>
                    </select>
                  </div>

                  {/* Specialization */}
                  <div className="mb-4">
                    <label className="form-label">Specialization</label>
                    <select
                      className="form-input"
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                    >
                      <option value="">All Services</option>
                      <option value="house_construction">House Construction</option>
                      <option value="renovation">Renovation</option>
                      <option value="interior_design">Interior Design</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="painting">Painting</option>
                      <option value="landscaping">Landscaping</option>
                    </select>
                  </div>

                  {/* Minimum Rating */}
                  <div className="mb-4">
                    <label className="form-label">Minimum Rating</label>
                    <select
                      className="form-input"
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                    >
                      <option value={0}>Any Rating</option>
                      <option value={3}>3+ Stars</option>
                      <option value={4}>4+ Stars</option>
                      <option value={4.5}>4.5+ Stars</option>
                    </select>
                  </div>

                  {/* Max Hourly Rate */}
                  <div className="mb-4">
                    <label className="form-label">Max Hourly Rate (₹)</label>
                    <Input
                      type="number"
                      placeholder="Max rate per hour"
                      value={maxHourlyRate || ''}
                      onChange={(e) => setMaxHourlyRate(Number(e.target.value) || 0)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Contractors Grid */}
          <div className="flex-1">
            {filteredContractors.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-12 h-12 text-text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  No contractors found
                </h3>
                <p className="text-text-secondary mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button variant="primary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredContractors.map((contractor) => (
                  <ContractorCard
                    key={contractor.id}
                    contractor={contractor}
                    onContact={handleContact}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
