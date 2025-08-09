import { render, screen, fireEvent } from '@testing-library/react'
import { BrokerCard } from '../BrokerCard'
import { BrokerProfile } from '@/types'

const mockBroker: BrokerProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210',
  role: 'broker',
  isVerified: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  experience: 5,
  serviceAreas: ['Bangalore', 'Whitefield', 'Electronic City'],
  specializations: ['residential_plot', 'commercial_plot'],
  rating: 4.5,
  reviewCount: 25,
  totalSales: 50,
  commission: 2,
  portfolio: [],
  isApproved: true,
  approvedAt: '2024-01-01T00:00:00Z'
}

describe('BrokerCard Component', () => {
  it('renders broker information correctly', () => {
    render(<BrokerCard broker={mockBroker} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('5 years experience')).toBeInTheDocument()
    expect(screen.getByText('Bangalore, Whitefield, Electronic City')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('(25)')).toBeInTheDocument()
  })

  it('shows verification badge for verified brokers', () => {
    render(<BrokerCard broker={mockBroker} />)
    expect(screen.getByTestId('verified-icon')).toBeInTheDocument()
  })

  it('hides verification badge for unverified brokers', () => {
    const unverifiedBroker = { ...mockBroker, isVerified: false }
    render(<BrokerCard broker={unverifiedBroker} />)
    expect(screen.queryByTestId('verified-icon')).not.toBeInTheDocument()
  })

  it('displays broker avatar or fallback', () => {
    render(<BrokerCard broker={mockBroker} />)
    const avatar = screen.getByTestId('user-icon')
    expect(avatar).toBeInTheDocument()
  })

  it('shows broker avatar when provided', () => {
    const brokerWithAvatar = { ...mockBroker, avatar: '/avatar.jpg' }
    render(<BrokerCard broker={brokerWithAvatar} />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveAttribute('src', '/avatar.jpg')
  })

  it('displays specializations correctly', () => {
    render(<BrokerCard broker={mockBroker} />)
    expect(screen.getByText('Residential Plot')).toBeInTheDocument()
    expect(screen.getByText('Commercial Plot')).toBeInTheDocument()
  })

  it('shows rating with stars', () => {
    render(<BrokerCard broker={mockBroker} />)
    const starIcon = screen.getByTestId('star-icon')
    expect(starIcon).toBeInTheDocument()
    expect(starIcon).toHaveClass('text-warning', 'fill-current')
  })

  it('displays total sales information', () => {
    render(<BrokerCard broker={mockBroker} />)
    expect(screen.getByText('50 sales')).toBeInTheDocument()
  })

  it('shows commission rate', () => {
    render(<BrokerCard broker={mockBroker} />)
    expect(screen.getByText('2% commission')).toBeInTheDocument()
  })

  it('handles contact button click', () => {
    const handleContact = jest.fn()
    render(<BrokerCard broker={mockBroker} onContact={handleContact} />)
    
    const contactButton = screen.getByRole('button', { name: /contact/i })
    fireEvent.click(contactButton)
    expect(handleContact).toHaveBeenCalledWith(mockBroker.id)
  })

  it('prevents event propagation on contact button click', () => {
    const handleContact = jest.fn()
    const handleCardClick = jest.fn()
    
    render(
      <div onClick={handleCardClick}>
        <BrokerCard broker={mockBroker} onContact={handleContact} />
      </div>
    )
    
    const contactButton = screen.getByRole('button', { name: /contact/i })
    fireEvent.click(contactButton)
    
    expect(handleContact).toHaveBeenCalledWith(mockBroker.id)
    expect(handleCardClick).not.toHaveBeenCalled()
  })

  it('navigates to broker profile on card click', () => {
    render(<BrokerCard broker={mockBroker} />)
    const profileLink = screen.getByRole('link')
    expect(profileLink).toHaveAttribute('href', `/brokers/${mockBroker.id}`)
  })

  it('applies hover effects', () => {
    render(<BrokerCard broker={mockBroker} />)
    const card = screen.getByRole('article')
    expect(card).toHaveClass('hover:shadow-card-hover')
  })

  it('shows service areas correctly', () => {
    render(<BrokerCard broker={mockBroker} />)
    expect(screen.getByText('Bangalore, Whitefield, Electronic City')).toBeInTheDocument()
  })

  it('handles long service area lists', () => {
    const brokerWithManyAreas = {
      ...mockBroker,
      serviceAreas: ['Bangalore', 'Whitefield', 'Electronic City', 'HSR Layout', 'Koramangala', 'Indiranagar']
    }
    render(<BrokerCard broker={brokerWithManyAreas} />)
    
    // Should truncate or show limited areas
    const serviceAreasText = screen.getByText(/Bangalore/)
    expect(serviceAreasText).toBeInTheDocument()
  })

  it('displays experience in correct format', () => {
    const { rerender } = render(<BrokerCard broker={mockBroker} />)
    expect(screen.getByText('5 years experience')).toBeInTheDocument()

    const newBroker = { ...mockBroker, experience: 1 }
    rerender(<BrokerCard broker={newBroker} />)
    expect(screen.getByText('1 year experience')).toBeInTheDocument()
  })

  it('shows approval status for approved brokers', () => {
    render(<BrokerCard broker={mockBroker} />)
    // Approved brokers should show verification badge
    expect(screen.getByTestId('verified-icon')).toBeInTheDocument()
  })

  it('handles missing optional fields gracefully', () => {
    const minimalBroker = {
      ...mockBroker,
      avatar: undefined,
      reviewCount: 0,
      totalSales: 0,
      serviceAreas: [],
      specializations: []
    }
    
    render(<BrokerCard broker={minimalBroker} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument() // rating
  })

  it('formats large numbers correctly', () => {
    const highPerformingBroker = {
      ...mockBroker,
      totalSales: 1500,
      reviewCount: 250
    }
    
    render(<BrokerCard broker={highPerformingBroker} />)
    expect(screen.getByText('1500 sales')).toBeInTheDocument()
    expect(screen.getByText('(250)')).toBeInTheDocument()
  })

  it('supports different view modes', () => {
    const { rerender } = render(<BrokerCard broker={mockBroker} viewMode="grid" />)
    expect(screen.getByRole('article')).toHaveClass('broker-card-grid')

    rerender(<BrokerCard broker={mockBroker} viewMode="list" />)
    expect(screen.getByRole('article')).toHaveClass('broker-card-list')
  })

  it('applies custom className', () => {
    render(<BrokerCard broker={mockBroker} className="custom-broker-card" />)
    expect(screen.getByRole('article')).toHaveClass('custom-broker-card')
  })

  it('handles keyboard navigation', () => {
    render(<BrokerCard broker={mockBroker} />)
    const link = screen.getByRole('link')
    
    fireEvent.keyDown(link, { key: 'Enter', code: 'Enter' })
    // Should navigate (tested through href attribute)
    expect(link).toHaveAttribute('href', `/brokers/${mockBroker.id}`)
  })

  it('shows loading state when specified', () => {
    render(<BrokerCard broker={mockBroker} loading />)
    expect(screen.getByRole('article')).toHaveClass('broker-card-loading')
  })

  it('displays commission rate with proper formatting', () => {
    const { rerender } = render(<BrokerCard broker={mockBroker} />)
    expect(screen.getByText('2% commission')).toBeInTheDocument()

    const brokerWithHighCommission = { ...mockBroker, commission: 2.5 }
    rerender(<BrokerCard broker={brokerWithHighCommission} />)
    expect(screen.getByText('2.5% commission')).toBeInTheDocument()
  })

  it('supports data attributes', () => {
    render(<BrokerCard broker={mockBroker} data-testid="broker-card-1" />)
    expect(screen.getByTestId('broker-card-1')).toBeInTheDocument()
  })
})
