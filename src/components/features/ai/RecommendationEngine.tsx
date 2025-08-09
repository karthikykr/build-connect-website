'use client';

import { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/features/properties/PropertyCard';
import { BrokerCard } from '@/components/features/brokers/BrokerCard';
import { ContractorCard } from '@/components/features/contractors/ContractorCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { 
  Sparkles, 
  TrendingUp, 
  MapPin,
  Heart,
  Eye,
  RefreshCw,
  Settings,
  Filter
} from 'lucide-react';
import { Property, BrokerProfile, ContractorProfile } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface RecommendationEngineProps {
  type: 'properties' | 'brokers' | 'contractors';
  limit?: number;
  showFilters?: boolean;
  className?: string;
}

export function RecommendationEngine({
  type,
  limit = 6,
  showFilters = false,
  className
}: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [preferences, setPreferences] = useState({
    budget: '',
    location: '',
    propertyType: '',
    experience: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    loadRecommendations();
  }, [type, user]);

  const loadRecommendations = async () => {
    setLoading(true);
    
    // Simulate AI recommendation generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let mockRecommendations: any[] = [];
    
    if (type === 'properties') {
      mockRecommendations = generatePropertyRecommendations();
    } else if (type === 'brokers') {
      mockRecommendations = generateBrokerRecommendations();
    } else if (type === 'contractors') {
      mockRecommendations = generateContractorRecommendations();
    }
    
    setRecommendations(mockRecommendations.slice(0, limit));
    setLoading(false);
  };

  const refreshRecommendations = async () => {
    setRefreshing(true);
    await loadRecommendations();
    setRefreshing(false);
  };

  const generatePropertyRecommendations = (): Property[] => {
    return [
      {
        id: 'rec-1',
        title: 'Premium Villa Plot - Perfect for Your Family',
        description: 'Based on your search history, this villa plot matches your preferences.',
        type: 'residential_plot',
        price: 3200000,
        area: 1800,
        unit: 'sqft',
        location: {
          street: 'Sarjapur Road',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560035',
          country: 'India',
          latitude: 12.9279,
          longitude: 77.6271,
        },
        images: [
          {
            id: '1',
            url: '/api/placeholder/400/300',
            thumbnail: '/api/placeholder/200/150',
            isPrimary: true,
          },
        ],
        amenities: ['Water Supply', 'Electricity', 'Road Access', 'Security'],
        features: [],
        documents: [],
        broker: {
          id: '1',
          name: 'Recommended Broker',
          email: 'broker@example.com',
          phone: '9876543210',
          role: 'broker',
          isVerified: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          experience: 5,
          serviceAreas: ['Bangalore'],
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
        views: 298,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        recommendationScore: 0.95,
        recommendationReasons: [
          'Matches your budget range',
          'Located in your preferred area',
          'Similar to properties you viewed',
          'High-rated broker'
        ],
      },
      // Add more mock properties...
    ];
  };

  const generateBrokerRecommendations = (): BrokerProfile[] => {
    return [
      {
        id: 'broker-rec-1',
        name: 'Top Rated Broker for You',
        email: 'topbroker@example.com',
        phone: '9876543210',
        role: 'broker',
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        experience: 8,
        serviceAreas: ['Bangalore', 'Whitefield'],
        specializations: ['residential_plot', 'villa'],
        rating: 4.8,
        reviewCount: 45,
        totalSales: 120,
        commission: 2.5,
        portfolio: [],
        isApproved: true,
        approvedAt: '2024-01-01T00:00:00Z',
        recommendationScore: 0.92,
        recommendationReasons: [
          'Specializes in your property type',
          'Works in your preferred locations',
          'Excellent customer reviews',
          'Quick response time'
        ],
      },
      // Add more mock brokers...
    ];
  };

  const generateContractorRecommendations = (): ContractorProfile[] => {
    return [
      {
        id: 'contractor-rec-1',
        name: 'Expert Construction Services',
        email: 'expert@example.com',
        phone: '9876543210',
        role: 'contractor',
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        experience: 12,
        serviceAreas: ['Bangalore', 'Sarjapur'],
        specializations: ['house_construction', 'renovation'],
        rating: 4.9,
        reviewCount: 67,
        completedProjects: 200,
        portfolio: [],
        isApproved: true,
        approvedAt: '2024-01-01T00:00:00Z',
        companyName: 'Expert Construction Pvt Ltd',
        licenseNumber: 'CON/KA/2024/001',
        hourlyRate: 600,
        recommendationScore: 0.88,
        recommendationReasons: [
          'Highly experienced in your project type',
          'Available in your area',
          'Excellent portfolio',
          'Competitive pricing'
        ],
      },
      // Add more mock contractors...
    ];
  };

  const getRecommendationTitle = () => {
    switch (type) {
      case 'properties':
        return 'Recommended Properties for You';
      case 'brokers':
        return 'Top Brokers for Your Needs';
      case 'contractors':
        return 'Best Contractors for Your Project';
      default:
        return 'Recommendations';
    }
  };

  const getRecommendationDescription = () => {
    switch (type) {
      case 'properties':
        return 'AI-curated properties based on your preferences and search history';
      case 'brokers':
        return 'Expert brokers matched to your property requirements';
      case 'contractors':
        return 'Skilled contractors perfect for your construction needs';
      default:
        return 'Personalized recommendations just for you';
    }
  };

  const renderRecommendationItem = (item: any, index: number) => {
    const commonProps = {
      key: item.id,
      className: "relative"
    };

    const recommendationBadge = (
      <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center z-10">
        <Sparkles className="w-3 h-3 mr-1" />
        {Math.round(item.recommendationScore * 100)}% Match
      </div>
    );

    switch (type) {
      case 'properties':
        return (
          <div {...commonProps}>
            {recommendationBadge}
            <PropertyCard property={item} />
          </div>
        );
      case 'brokers':
        return (
          <div {...commonProps}>
            {recommendationBadge}
            <BrokerCard broker={item} />
          </div>
        );
      case 'contractors':
        return (
          <div {...commonProps}>
            {recommendationBadge}
            <ContractorCard contractor={item} />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loading size="lg" text="Generating personalized recommendations..." />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-primary" />
              {getRecommendationTitle()}
            </CardTitle>
            <p className="text-text-secondary mt-1">
              {getRecommendationDescription()}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {showFilters && (
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Preferences
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshRecommendations}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No Recommendations Yet
            </h3>
            <p className="text-text-secondary mb-4">
              Start browsing {type} to get personalized recommendations
            </p>
            <Button variant="primary">
              Explore {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          </div>
        ) : (
          <div>
            {/* Recommendation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-lg font-bold text-text-primary">
                  {Math.round(recommendations.reduce((sum, item) => sum + item.recommendationScore, 0) / recommendations.length * 100)}%
                </p>
                <p className="text-sm text-text-secondary">Avg Match Score</p>
              </div>
              <div className="text-center p-4 bg-success/5 rounded-lg">
                <Eye className="w-6 h-6 text-success mx-auto mb-2" />
                <p className="text-lg font-bold text-text-primary">{recommendations.length}</p>
                <p className="text-sm text-text-secondary">Recommendations</p>
              </div>
              <div className="text-center p-4 bg-warning/5 rounded-lg">
                <Heart className="w-6 h-6 text-warning mx-auto mb-2" />
                <p className="text-lg font-bold text-text-primary">
                  {recommendations.filter(item => item.recommendationScore > 0.9).length}
                </p>
                <p className="text-sm text-text-secondary">High Matches</p>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recommendations.map(renderRecommendationItem)}
            </div>

            {/* Show More Button */}
            {recommendations.length >= limit && (
              <div className="text-center mt-6">
                <Button variant="outline">
                  View More Recommendations
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
