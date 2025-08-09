import { render, screen, fireEvent } from '@testing-library/react'
import { PropertyCard } from '../PropertyCard'
import { Property } from '@/types'

const mockProperty: Property = {
  id: '1',
  title: 'Beautiful 3BHK Apartment',
  description: 'Spacious apartment with modern amenities',
  price: 5000000,
  area: 1200,
  location: {
    address: '123 Main Street',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  propertyType: 'apartment',
  status: 'available',
  images: ['/test-image.jpg'],
  amenities: ['Parking', 'Gym', 'Swimming Pool'],
  features: ['Balcony', 'Modular Kitchen'],
  brokerId: 'broker1',
  brokerName: 'John Doe',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

describe('PropertyCard Component', () => {
  it('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} />)
    
    expect(screen.getByText('Beautiful 3BHK Apartment')).toBeInTheDocument()
    expect(screen.getByText('Spacious apartment with modern amenities')).toBeInTheDocument()
    expect(screen.getByText('₹50,00,000')).toBeInTheDocument()
    expect(screen.getByText('1200 sqft')).toBeInTheDocument()
    expect(screen.getByText('Bangalore, Karnataka')).toBeInTheDocument()
  })

  it('displays property image with fallback', () => {
    render(<PropertyCard property={mockProperty} />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveAttribute('alt', 'Beautiful 3BHK Apartment')
  })

  it('shows property status badge', () => {
    const { rerender } = render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText('Available')).toBeInTheDocument()

    const soldProperty = { ...mockProperty, status: 'sold' as const }
    rerender(<PropertyCard property={soldProperty} />)
    expect(screen.getByText('Sold')).toBeInTheDocument()
  })

  it('displays amenities correctly', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText('Parking')).toBeInTheDocument()
    expect(screen.getByText('Gym')).toBeInTheDocument()
    expect(screen.getByText('Swimming Pool')).toBeInTheDocument()
  })

  it('shows broker information', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<PropertyCard property={mockProperty} onClick={handleClick} />)
    
    fireEvent.click(screen.getByText('Beautiful 3BHK Apartment'))
    expect(handleClick).toHaveBeenCalledWith(mockProperty)
  })

  it('shows favorite button when onFavorite is provided', () => {
    const handleFavorite = jest.fn()
    render(<PropertyCard property={mockProperty} onFavorite={handleFavorite} />)
    
    const favoriteButton = screen.getByRole('button', { name: /favorite/i })
    expect(favoriteButton).toBeInTheDocument()
    
    fireEvent.click(favoriteButton)
    expect(handleFavorite).toHaveBeenCalledWith(mockProperty.id)
  })

  it('shows contact button when onContact is provided', () => {
    const handleContact = jest.fn()
    render(<PropertyCard property={mockProperty} onContact={handleContact} />)
    
    const contactButton = screen.getByRole('button', { name: /contact/i })
    expect(contactButton).toBeInTheDocument()
    
    fireEvent.click(contactButton)
    expect(handleContact).toHaveBeenCalledWith(mockProperty.brokerId)
  })

  it('displays property type correctly', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText('Apartment')).toBeInTheDocument()
  })

  it('formats price correctly for different amounts', () => {
    const { rerender } = render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText('₹50,00,000')).toBeInTheDocument()

    const expensiveProperty = { ...mockProperty, price: 12500000 }
    rerender(<PropertyCard property={expensiveProperty} />)
    expect(screen.getByText('₹1,25,00,000')).toBeInTheDocument()
  })

  it('handles missing images gracefully', () => {
    const propertyWithoutImages = { ...mockProperty, images: [] }
    render(<PropertyCard property={propertyWithoutImages} />)
    
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', '/placeholder-property.jpg')
  })

  it('truncates long descriptions', () => {
    const longDescription = 'This is a very long description that should be truncated when displayed in the property card to maintain a clean layout and consistent card heights across the grid.'
    const propertyWithLongDesc = { ...mockProperty, description: longDescription }
    
    render(<PropertyCard property={propertyWithLongDesc} />)
    const description = screen.getByText(longDescription)
    expect(description).toHaveClass('line-clamp-2')
  })

  it('shows limited amenities with more indicator', () => {
    const manyAmenities = ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Elevator', 'Garden']
    const propertyWithManyAmenities = { ...mockProperty, amenities: manyAmenities }
    
    render(<PropertyCard property={propertyWithManyAmenities} />)
    expect(screen.getByText('+3 more')).toBeInTheDocument()
  })

  it('applies hover effects', () => {
    render(<PropertyCard property={mockProperty} />)
    const card = screen.getByRole('article')
    expect(card).toHaveClass('hover:shadow-lg')
  })

  it('supports different view modes', () => {
    const { rerender } = render(<PropertyCard property={mockProperty} viewMode="grid" />)
    expect(screen.getByRole('article')).toHaveClass('property-card-grid')

    rerender(<PropertyCard property={mockProperty} viewMode="list" />)
    expect(screen.getByRole('article')).toHaveClass('property-card-list')
  })

  it('shows property age when available', () => {
    const propertyWithAge = { ...mockProperty, yearBuilt: 2020 }
    render(<PropertyCard property={propertyWithAge} />)
    expect(screen.getByText('4 years old')).toBeInTheDocument()
  })

  it('displays verification badge for verified properties', () => {
    const verifiedProperty = { ...mockProperty, verified: true }
    render(<PropertyCard property={verifiedProperty} />)
    expect(screen.getByText('Verified')).toBeInTheDocument()
  })

  it('handles keyboard navigation', () => {
    const handleClick = jest.fn()
    render(<PropertyCard property={mockProperty} onClick={handleClick} />)
    
    const card = screen.getByRole('article')
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' })
    expect(handleClick).toHaveBeenCalledWith(mockProperty)
  })

  it('shows loading state when specified', () => {
    render(<PropertyCard property={mockProperty} loading />)
    expect(screen.getByRole('article')).toHaveClass('property-card-loading')
  })

  it('applies custom className', () => {
    render(<PropertyCard property={mockProperty} className="custom-property-card" />)
    expect(screen.getByRole('article')).toHaveClass('custom-property-card')
  })

  it('supports data attributes', () => {
    render(<PropertyCard property={mockProperty} data-testid="property-card-1" />)
    expect(screen.getByTestId('property-card-1')).toBeInTheDocument()
  })
})
