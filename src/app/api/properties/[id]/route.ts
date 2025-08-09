import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Property } from '@/types';

// Mock property data - In production, this would come from database
const getMockProperty = (id: string): Property | null => {
  const properties: Property[] = [
    {
      id: '1',
      title: 'Premium Residential Plot in Whitefield',
      description: 'Beautiful residential plot with all modern amenities and excellent connectivity. This prime location offers great investment potential with upcoming infrastructure developments.',
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
      images: [
        {
          id: '1',
          url: '/api/placeholder/800/600',
          thumbnail: '/api/placeholder/200/150',
          isPrimary: true,
        },
        {
          id: '2',
          url: '/api/placeholder/800/600',
          thumbnail: '/api/placeholder/200/150',
          isPrimary: false,
        }
      ],
      amenities: ['Water Supply', 'Electricity', 'Road Access', 'Drainage', 'Security'],
      features: ['Corner Plot', 'East Facing', 'Clear Title', 'RERA Approved'],
      documents: [
        {
          id: 'doc1',
          name: 'Title Deed',
          type: 'title_deed',
          url: '/documents/title_deed.pdf',
        },
        {
          id: 'doc2',
          name: 'Survey Settlement',
          type: 'survey_settlement',
          url: '/documents/survey.pdf',
        }
      ],
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
        rating: 4.8,
        totalProperties: 25,
        experience: '8 years',
      },
    },
    {
      id: '2',
      title: 'Commercial Plot in Electronic City',
      description: 'Prime commercial plot in IT hub with excellent investment potential. Located in the heart of Electronic City with easy access to major IT companies.',
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
      images: [
        {
          id: '3',
          url: '/api/placeholder/800/600',
          thumbnail: '/api/placeholder/200/150',
          isPrimary: true,
        }
      ],
      amenities: ['Road Access', 'Electricity', 'Water Supply', 'Drainage'],
      features: ['Main Road Facing', 'Commercial Zone', 'High ROI', 'IT Hub Location'],
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
        rating: 4.6,
        totalProperties: 18,
        experience: '5 years',
      },
    }
  ];

  return properties.find(p => p.id === id) || null;
};

// Get property by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;
    const property = getMockProperty(propertyId);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Increment view count (in production, this would update the database)
    property.views = (property.views || 0) + 1;

    // Get similar properties (mock data)
    const similarProperties = [
      {
        id: 'similar1',
        title: 'Residential Plot in Whitefield',
        price: 2200000,
        area: 1000,
        unit: 'sqft',
        location: { city: 'Bangalore', state: 'Karnataka' },
        image: '/api/placeholder/200/150',
      },
      {
        id: 'similar2',
        title: 'Premium Plot in Whitefield',
        price: 2800000,
        area: 1400,
        unit: 'sqft',
        location: { city: 'Bangalore', state: 'Karnataka' },
        image: '/api/placeholder/200/150',
      }
    ];

    return NextResponse.json({
      property,
      similarProperties,
    });

  } catch (error) {
    console.error('Property detail API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update property
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const propertyId = params.id;
    const property = getMockProperty(propertyId);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if user owns the property or is admin
    if (property.broker.id !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to update this property' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updates = body;

    // Update property (in production, this would update the database)
    const updatedProperty = {
      ...property,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    console.log('Property updated:', updatedProperty);

    return NextResponse.json({
      property: updatedProperty,
      message: 'Property updated successfully',
    });

  } catch (error) {
    console.error('Property update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const propertyId = params.id;
    const property = getMockProperty(propertyId);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if user owns the property or is admin
    if (property.broker.id !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to delete this property' },
        { status: 403 }
      );
    }

    // Delete property (in production, this would delete from database)
    console.log('Property deleted:', propertyId);

    return NextResponse.json({
      message: 'Property deleted successfully',
    });

  } catch (error) {
    console.error('Property deletion API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create inquiry for property
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const propertyId = params.id;
    const property = getMockProperty(propertyId);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { message, contactPreference } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create inquiry (in production, this would save to database)
    const inquiry = {
      id: `inq_${Date.now()}`,
      propertyId,
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      userPhone: session.user.phone,
      message,
      contactPreference: contactPreference || 'email',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // Increment inquiry count
    property.inquiries = (property.inquiries || 0) + 1;

    console.log('Inquiry created:', inquiry);

    return NextResponse.json({
      inquiry,
      message: 'Inquiry sent successfully',
    });

  } catch (error) {
    console.error('Property inquiry API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
