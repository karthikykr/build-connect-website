import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../Input'

describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('form-input')
  })

  it('renders with label', () => {
    render(<Input label="Email Address" />)
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByText('Email Address')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter your email" />)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test@example.com')
    
    expect(handleChange).toHaveBeenCalledTimes(17) // One for each character
    expect(input).toHaveValue('test@example.com')
  })

  it('renders with different types', () => {
    const { rerender } = render(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password')

    rerender(<Input type="number" />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number')
  })

  it('shows error state', () => {
    render(<Input error="This field is required" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('input-error')
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('shows required indicator', () => {
    render(<Input label="Email" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('can be disabled', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('input-disabled')
  })

  it('renders with left icon', () => {
    const TestIcon = () => <span data-testid="left-icon">Icon</span>
    render(<Input leftIcon={<TestIcon />} />)
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  it('renders with right icon', () => {
    const TestIcon = () => <span data-testid="right-icon">Icon</span>
    render(<Input rightIcon={<TestIcon />} />)
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('renders with help text', () => {
    render(<Input helpText="Enter a valid email address" />)
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
  })

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('supports controlled input', () => {
    const { rerender } = render(<Input value="initial" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveValue('initial')
    
    rerender(<Input value="updated" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveValue('updated')
  })

  it('supports uncontrolled input', async () => {
    const user = userEvent.setup()
    render(<Input defaultValue="default" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('default')
    
    await user.clear(input)
    await user.type(input, 'new value')
    expect(input).toHaveValue('new value')
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-input')
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
    render(<Input ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })

  it('handles keyboard events', () => {
    const handleKeyDown = jest.fn()
    const handleKeyUp = jest.fn()
    render(<Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.keyUp(input, { key: 'Enter' })
    
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
    expect(handleKeyUp).toHaveBeenCalledTimes(1)
  })

  it('supports maxLength attribute', async () => {
    const user = userEvent.setup()
    render(<Input maxLength={5} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, '1234567890')
    expect(input).toHaveValue('12345')
  })

  it('supports minLength validation', () => {
    render(<Input minLength={3} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('minLength', '3')
  })

  it('supports pattern validation', () => {
    render(<Input pattern="[0-9]*" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('pattern', '[0-9]*')
  })

  it('supports autocomplete attribute', () => {
    render(<Input autoComplete="email" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('autocomplete', 'email')
  })

  it('supports readonly attribute', () => {
    render(<Input readOnly value="readonly value" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('readonly')
    expect(input).toHaveValue('readonly value')
  })

  it('shows character count when maxLength is set', () => {
    render(<Input maxLength={10} value="hello" showCharCount />)
    expect(screen.getByText('5/10')).toBeInTheDocument()
  })

  it('handles paste events', () => {
    const handlePaste = jest.fn()
    render(<Input onPaste={handlePaste} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.paste(input, {
      clipboardData: {
        getData: () => 'pasted text'
      }
    })
    
    expect(handlePaste).toHaveBeenCalledTimes(1)
  })

  it('supports aria attributes', () => {
    render(
      <Input 
        aria-describedby="help-text"
        aria-invalid="true"
        aria-required="true"
      />
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-describedby', 'help-text')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-required', 'true')
  })
})
