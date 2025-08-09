import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../Card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default props', () => {
      render(<Card>Card content</Card>)
      const card = screen.getByText('Card content')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('card')
    })

    it('applies custom className', () => {
      render(<Card className="custom-card">Content</Card>)
      const card = screen.getByText('Content')
      expect(card).toHaveClass('custom-card')
    })

    it('forwards ref correctly', () => {
      const ref = jest.fn()
      render(<Card ref={ref}>Content</Card>)
      expect(ref).toHaveBeenCalled()
    })

    it('supports data attributes', () => {
      render(<Card data-testid="test-card">Content</Card>)
      expect(screen.getByTestId('test-card')).toBeInTheDocument()
    })

    it('renders with different variants', () => {
      const { rerender } = render(<Card variant="elevated">Elevated</Card>)
      expect(screen.getByText('Elevated')).toHaveClass('card-elevated')

      rerender(<Card variant="outlined">Outlined</Card>)
      expect(screen.getByText('Outlined')).toHaveClass('card-outlined')
    })

    it('renders with hover effects', () => {
      render(<Card hover>Hoverable</Card>)
      expect(screen.getByText('Hoverable')).toHaveClass('card-hover')
    })

    it('renders with padding variants', () => {
      const { rerender } = render(<Card padding="sm">Small padding</Card>)
      expect(screen.getByText('Small padding')).toHaveClass('card-padding-sm')

      rerender(<Card padding="lg">Large padding</Card>)
      expect(screen.getByText('Large padding')).toHaveClass('card-padding-lg')
    })
  })

  describe('CardHeader', () => {
    it('renders with default props', () => {
      render(<CardHeader>Header content</CardHeader>)
      const header = screen.getByText('Header content')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('card-header')
    })

    it('applies custom className', () => {
      render(<CardHeader className="custom-header">Header</CardHeader>)
      const header = screen.getByText('Header')
      expect(header).toHaveClass('custom-header')
    })

    it('renders with divider', () => {
      render(<CardHeader divider>Header with divider</CardHeader>)
      const header = screen.getByText('Header with divider')
      expect(header).toHaveClass('card-header-divider')
    })
  })

  describe('CardTitle', () => {
    it('renders with default props', () => {
      render(<CardTitle>Card Title</CardTitle>)
      const title = screen.getByText('Card Title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('card-title')
    })

    it('applies custom className', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>)
      const title = screen.getByText('Title')
      expect(title).toHaveClass('custom-title')
    })

    it('renders with different sizes', () => {
      const { rerender } = render(<CardTitle size="sm">Small Title</CardTitle>)
      expect(screen.getByText('Small Title')).toHaveClass('card-title-sm')

      rerender(<CardTitle size="lg">Large Title</CardTitle>)
      expect(screen.getByText('Large Title')).toHaveClass('card-title-lg')
    })

    it('renders as different HTML elements', () => {
      const { rerender } = render(<CardTitle as="h1">H1 Title</CardTitle>)
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()

      rerender(<CardTitle as="h2">H2 Title</CardTitle>)
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()

      rerender(<CardTitle as="h3">H3 Title</CardTitle>)
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })
  })

  describe('CardContent', () => {
    it('renders with default props', () => {
      render(<CardContent>Card content</CardContent>)
      const content = screen.getByText('Card content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveClass('card-content')
    })

    it('applies custom className', () => {
      render(<CardContent className="custom-content">Content</CardContent>)
      const content = screen.getByText('Content')
      expect(content).toHaveClass('custom-content')
    })

    it('renders with different padding', () => {
      const { rerender } = render(<CardContent padding="none">No padding</CardContent>)
      expect(screen.getByText('No padding')).toHaveClass('card-content-no-padding')

      rerender(<CardContent padding="sm">Small padding</CardContent>)
      expect(screen.getByText('Small padding')).toHaveClass('card-content-padding-sm')

      rerender(<CardContent padding="lg">Large padding</CardContent>)
      expect(screen.getByText('Large padding')).toHaveClass('card-content-padding-lg')
    })
  })

  describe('CardFooter', () => {
    it('renders with default props', () => {
      render(<CardFooter>Footer content</CardFooter>)
      const footer = screen.getByText('Footer content')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('card-footer')
    })

    it('applies custom className', () => {
      render(<CardFooter className="custom-footer">Footer</CardFooter>)
      const footer = screen.getByText('Footer')
      expect(footer).toHaveClass('custom-footer')
    })

    it('renders with divider', () => {
      render(<CardFooter divider>Footer with divider</CardFooter>)
      const footer = screen.getByText('Footer with divider')
      expect(footer).toHaveClass('card-footer-divider')
    })

    it('renders with different alignments', () => {
      const { rerender } = render(<CardFooter align="left">Left aligned</CardFooter>)
      expect(screen.getByText('Left aligned')).toHaveClass('card-footer-left')

      rerender(<CardFooter align="center">Center aligned</CardFooter>)
      expect(screen.getByText('Center aligned')).toHaveClass('card-footer-center')

      rerender(<CardFooter align="right">Right aligned</CardFooter>)
      expect(screen.getByText('Right aligned')).toHaveClass('card-footer-right')
    })
  })

  describe('Complete Card Structure', () => {
    it('renders complete card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            This is the card content with some text.
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByText('Test Card')).toBeInTheDocument()
      expect(screen.getByText('This is the card content with some text.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    it('maintains proper structure and hierarchy', () => {
      render(
        <Card data-testid="main-card">
          <CardHeader data-testid="card-header">
            <CardTitle data-testid="card-title">Title</CardTitle>
          </CardHeader>
          <CardContent data-testid="card-content">Content</CardContent>
          <CardFooter data-testid="card-footer">Footer</CardFooter>
        </Card>
      )

      const card = screen.getByTestId('main-card')
      const header = screen.getByTestId('card-header')
      const title = screen.getByTestId('card-title')
      const content = screen.getByTestId('card-content')
      const footer = screen.getByTestId('card-footer')

      expect(card).toContainElement(header)
      expect(header).toContainElement(title)
      expect(card).toContainElement(content)
      expect(card).toContainElement(footer)
    })

    it('supports nested cards', () => {
      render(
        <Card data-testid="outer-card">
          <CardContent>
            <Card data-testid="inner-card">
              <CardContent>Nested content</CardContent>
            </Card>
          </CardContent>
        </Card>
      )

      const outerCard = screen.getByTestId('outer-card')
      const innerCard = screen.getByTestId('inner-card')
      
      expect(outerCard).toContainElement(innerCard)
      expect(screen.getByText('Nested content')).toBeInTheDocument()
    })

    it('handles empty states gracefully', () => {
      render(
        <Card>
          <CardHeader />
          <CardContent />
          <CardFooter />
        </Card>
      )

      // Should render without errors even with empty components
      expect(document.querySelector('.card')).toBeInTheDocument()
    })
  })
})
