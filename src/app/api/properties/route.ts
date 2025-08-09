import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Property } from '@/types';

// Mock property data
const getMockProperties = (): Property[] => [
  {
    id: '1',
    title: 'Premium Residential Plot in Whitefield',
    description: 'Beautiful residential plot with all modern amenities and excellent connectivity.',
    type: 'residential_plot',
    price: 2500000,
    area: 1200,
    unit: 'sqft',
    location: {
      street: 'Whitefield Main Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      country: 'India',
      latitude: 12.9698,
      longitude: 77.7500,
    },
    images: [{
      id: '1',
      url: '/api/placeholder/400/300',
      thumbnail: '/api/placeholder/200/150',
      isPrimary: true,
    }],
    amenities: ['Water Supply', 'Electricity', 'Road Access', 'Drainage'],
    features: ['Corner Plot', 'East Facing', 'Clear Title'],
    documents: [],
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    views: 156,
    inquiries: 12,
    broker: {
      id: 'broker1',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 9876543210',
      verified: true,
    },
  },
  {
    id: '2',
    title: 'Commercial Plot in Electronic City',
    description: 'Prime commercial plot in IT hub with excellent investment potential.',
    type: 'commercial_plot',
    price: 5000000,
    area: 2400,
    unit: 'sqft',
    location: {
      street: 'Electronic City Phase 1',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560100',
      country: 'India',
      latitude: 12.8456,
      longitude: 77.6603,
    },
    images: [{
      id: '2',
      url: '/api/placeholder/400/300',
      thumbnail: '/api/placeholder/200/150',
      isPrimary: true,
    }],
    amenities: ['Road Access', 'Electricity', 'Water Supply', 'Drainage'],
    features: ['Main Road Facing', 'Commercial Zone', 'High ROI'],
    documents: [],
    status: 'active',
    createdAt: '2024-01-18T14:30:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    views: 89,
    inquiries: 7,
    broker: {
      id: 'broker2',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 9876543211',
      verified: true,
    },
  },
  {
    id: '3',
    title: 'Luxury Villa in HSR Layout',
    description: 'Spacious villa with modern amenities and premium location.',
    type: 'villa',
    price: 8500000,
    area: 3200,
    unit: 'sqft',
    location: {
      street: 'HSR Layout Sector 2',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560102',
      country: 'India',
      latitude: 12.9116,
      longitude: 77.6473,
    },
    images: [{
      id: '3',
      url: '/api/placeholder/400/300',
      thumbnail: '/api/placeholder/200/150',
      isPrimary: true,
    }],
    amenities: ['Swimming Pool', 'Garden', 'Parking', 'Security', 'Power Backup'],
    features: ['4 BHK', 'Furnished', 'Vastu Compliant'],
    documents: [],
    status: 'active',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-25T16:45:00Z',
    views: 234,
    inquiries: 18,
    broker: {
      id: 'broker1',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 9876543210',
      verified: true,
    },
  }
];

// Get properties with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const brokerId = searchParams.get('brokerId');
    const sortBy = searchParams.get('sortBy') || 'newest';

    let properties = getMockProperties();

    // Apply filters
    if (search) {
      properties = properties.filter(property =>
        property.title.toLowerCase().includes(search.toLowerCase()) ||
        property.description.toLowerCase().includes(search.toLowerCase()) ||
        property.location.city.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type && type !== 'all') {
      properties = properties.filter(property => property.type === type);
    }

    if (minPrice) {
      properties = properties.filter(property => property.price >= parseInt(minPrice));
    }

    if (maxPrice) {
      properties = properties.filter(property => property.price <= parseInt(maxPrice));
    }

    if (location) {
      properties = properties.filter(property =>
        property.location.city.toLowerCase().includes(location.toLowerCase()) ||
        property.location.street.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (brokerId) {
      properties = properties.filter(property => property.broker.id === brokerId);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        properties.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        properties.sort((a, b) => b.price - a.price);
        break;
      case 'area_low':
        properties.sort((a, b) => a.area - b.area);
        break;
      case 'area_high':
        properties.sort((a, b) => b.area - a.area);
        break;
      case 'newest':
        properties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        properties.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'most_viewed':
        properties.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        // Default to newest
        properties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = properties.slice(startIndex, endIndex);

    return NextResponse.json({
      properties: paginatedProperties,
      pagination: {
        page,
        limit,
        total: properties.length,
        totalPages: Math.ceil(properties.length / limit),
      },
      filters: {
        search,
        type,
        minPrice,
        maxPrice,
        location,
        sortBy,
      },
    });

  } catch (error) {
    console.error('Properties API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new property
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is a broker
    if (session.user.role !== 'broker') {
      return NextResponse.json(
        { error: 'Only brokers can create properties' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      price,
      area,
      unit,
      location,
      amenities,
      features,
    } = body;

    // Validate required fields
    if (!title || !description || !type || !price || !area || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate property ID
    const propertyId = `prop_${Date.now()}`;
    const currentDate = new Date().toISOString();

    // Create property object
    const newProperty: Property = {
      id: propertyId,
      title,
      description,
      type,
      price: parseFloat(price),
      area: parseFloat(area),
      unit: unit || 'sqft',
      location,
      amenities: amenities || [],
      features: features || [],
      images: [], // Images would be handled separately
      documents: [],
      status: 'pending', // New properties start as pending
      createdAt: currentDate,
      updatedAt: currentDate,
      views: 0,
      inquiries: 0,
      broker: {
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
        phone: session.user.phone || '',
        verified: true,
      },
    };

    // In production, save to database
    console.log('Property created:', newProperty);

    return NextResponse.json({
      property: newProperty,
      message: 'Property created successfully',
    });

  } catch (error) {
    console.error('Property creation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
