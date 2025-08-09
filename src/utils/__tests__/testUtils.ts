import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'

// Mock user data for unit testing only
export const mockUsers = {
  user: {
    _id: '1',
    name: 'Test User',
    email: 'user@example.com',
    role: 'user' as const,
    isEmailVerified: true,
    isPhoneVerified: false,
    location: [],
    isAvailable: true,
    partnershipRequest: 'NONE' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  broker: {
    _id: '2',
    name: 'Test Broker',
    email: 'broker@example.com',
    role: 'broker' as const,
    isEmailVerified: true,
    isPhoneVerified: true,
    location: ['Bangalore'],
    isAvailable: true,
    partnershipRequest: 'Broker' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  admin: {
    _id: '3',
    name: 'Test Admin',
    email: 'admin@example.com',
    role: 'admin' as const,
    isEmailVerified: true,
    isPhoneVerified: true,
    location: [],
    isAvailable: true,
    partnershipRequest: 'NONE' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
}

// Essential mock data for unit testing
export const mockSite = {
  _id: '1',
  name: 'Test Site',
  addressLine1: '123 Test Street',
  location: 'Test Location',
  pincode: '560001',
  state: 'Karnataka',
  district: 'Bangalore',
  plotArea: 1200,
  price: 5000000,
  latitude: 12.9716,
  longitude: 77.5946,
  status: 'available' as const,
  userId: '1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialUser?: typeof mockUsers.user | typeof mockUsers.broker | typeof mockUsers.admin | null
  theme?: 'light' | 'dark'
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { initialUser = null, theme = 'light', ...renderOptions } = options

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ThemeProvider defaultTheme={theme}>
        <AuthProvider initialUser={initialUser}>
          {children}
        </AuthProvider>
      </ThemeProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Test utilities for form interactions
export const formUtils = {
  fillInput: async (input: HTMLElement, value: string) => {
    const { fireEvent } = await import('@testing-library/react')
    fireEvent.change(input, { target: { value } })
  },

  selectOption: async (select: HTMLElement, value: string) => {
    const { fireEvent } = await import('@testing-library/react')
    fireEvent.change(select, { target: { value } })
  },

  checkCheckbox: async (checkbox: HTMLElement) => {
    const { fireEvent } = await import('@testing-library/react')
    fireEvent.click(checkbox)
  },

  submitForm: async (form: HTMLElement) => {
    const { fireEvent } = await import('@testing-library/react')
    fireEvent.submit(form)
  }
}

// Test utilities for async operations
export const asyncUtils = {
  waitForElement: async (selector: string, timeout = 5000) => {
    const { waitFor } = await import('@testing-library/react')
    const { screen } = await import('@testing-library/react')
    
    return waitFor(() => screen.getByTestId(selector), { timeout })
  },

  waitForText: async (text: string, timeout = 5000) => {
    const { waitFor } = await import('@testing-library/react')
    const { screen } = await import('@testing-library/react')
    
    return waitFor(() => screen.getByText(text), { timeout })
  },

  waitForDisappear: async (element: HTMLElement, timeout = 5000) => {
    const { waitForElementToBeRemoved } = await import('@testing-library/react')
    
    return waitForElementToBeRemoved(element, { timeout })
  }
}

// Essential mock API responses for unit testing
export const mockApiResponses = {
  login: {
    success: {
      data: {
        user: mockUsers.user,
        accessToken: 'mock-access-token',
        sessionId: 'mock-session-id'
      }
    },
    error: {
      success: false,
      error: 'Invalid credentials'
    }
  },

  profile: {
    success: {
      success: true,
      data: mockUsers.user
    }
  }
}

// Mock fetch for API testing
export const mockFetch = (responses: Record<string, any>) => {
  global.fetch = jest.fn((url: string, options?: RequestInit) => {
    const method = options?.method || 'GET'
    const key = `${method} ${url}`
    
    const response = responses[key] || responses[url]
    
    if (!response) {
      return Promise.reject(new Error(`No mock response for ${key}`))
    }
    
    return Promise.resolve({
      ok: response.ok !== false,
      status: response.status || 200,
      json: () => Promise.resolve(response.data || response),
      text: () => Promise.resolve(JSON.stringify(response.data || response))
    } as Response)
  })
}

// Cleanup utilities
export const cleanup = {
  localStorage: () => {
    localStorage.clear()
  },

  sessionStorage: () => {
    sessionStorage.clear()
  },

  mocks: () => {
    jest.clearAllMocks()
  },

  all: () => {
    cleanup.localStorage()
    cleanup.sessionStorage()
    cleanup.mocks()
  }
}

// Performance testing utilities
export const performanceUtils = {
  measureRenderTime: async (renderFn: () => void) => {
    const start = performance.now()
    renderFn()
    const end = performance.now()
    return end - start
  },

  measureAsyncOperation: async (operation: () => Promise<any>) => {
    const start = performance.now()
    await operation()
    const end = performance.now()
    return end - start
  }
}

// Accessibility testing utilities
export const a11yUtils = {
  checkFocusManagement: async (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    return Array.from(focusableElements).every(element => {
      const tabIndex = element.getAttribute('tabindex')
      return tabIndex !== '-1'
    })
  },

  checkAriaLabels: async (container: HTMLElement) => {
    const interactiveElements = container.querySelectorAll(
      'button, [role="button"], input, select, textarea'
    )
    
    return Array.from(interactiveElements).every(element => {
      return element.getAttribute('aria-label') || 
             element.getAttribute('aria-labelledby') ||
             element.textContent?.trim()
    })
  }
}

// Export all utilities
export * from '@testing-library/react'
export { renderWithProviders as render }
