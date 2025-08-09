import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { AuthProvider } from '@/context/AuthContext'
import { ReactNode } from 'react'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Mock API calls
global.fetch = jest.fn()

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  it('initializes with no user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.loading).toBe(false)
  })

  it('handles successful login', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'buyer' as const
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser, token: 'mock-token' })
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('john@example.com', 'password')
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
    expect(localStorage.getItem('auth-token')).toBe('mock-token')
  })

  it('handles login failure', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' })
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      try {
        await result.current.login('john@example.com', 'wrong-password')
      } catch (error) {
        expect(error).toEqual(new Error('Invalid credentials'))
      }
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(localStorage.getItem('auth-token')).toBeNull()
  })

  it('handles logout', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'buyer' as const
    }

    // Set up authenticated state
    localStorage.setItem('auth-token', 'mock-token')
    
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    // Simulate authenticated state
    act(() => {
      result.current.setUser(mockUser)
    })

    expect(result.current.isAuthenticated).toBe(true)

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(localStorage.getItem('auth-token')).toBeNull()
    expect(mockPush).toHaveBeenCalledWith('/auth/login')
  })

  it('handles registration', async () => {
    const mockUser = {
      id: '1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'broker' as const
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser, token: 'mock-token' })
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.register({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password',
        role: 'broker'
      })
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
    expect(localStorage.getItem('auth-token')).toBe('mock-token')
  })

  it('handles registration failure', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Email already exists' })
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      try {
        await result.current.register({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password',
          role: 'broker'
        })
      } catch (error) {
        expect(error).toEqual(new Error('Email already exists'))
      }
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('updates user profile', async () => {
    const initialUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'buyer' as const
    }

    const updatedUser = {
      ...initialUser,
      name: 'John Smith'
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: updatedUser })
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    // Set initial user
    act(() => {
      result.current.setUser(initialUser)
    })

    await act(async () => {
      await result.current.updateProfile({ name: 'John Smith' })
    })

    expect(result.current.user?.name).toBe('John Smith')
  })

  it('checks user roles correctly', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    // Test with buyer
    act(() => {
      result.current.setUser({
        id: '1',
        name: 'Buyer User',
        email: 'buyer@example.com',
        role: 'buyer'
      })
    })

    expect(result.current.isBuyer()).toBe(true)
    expect(result.current.isBroker()).toBe(false)
    expect(result.current.isAdmin()).toBe(false)

    // Test with broker
    act(() => {
      result.current.setUser({
        id: '2',
        name: 'Broker User',
        email: 'broker@example.com',
        role: 'broker'
      })
    })

    expect(result.current.isBuyer()).toBe(false)
    expect(result.current.isBroker()).toBe(true)
    expect(result.current.isAdmin()).toBe(false)

    // Test with admin
    act(() => {
      result.current.setUser({
        id: '3',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      })
    })

    expect(result.current.isBuyer()).toBe(false)
    expect(result.current.isBroker()).toBe(false)
    expect(result.current.isAdmin()).toBe(true)
  })

  it('persists authentication state', () => {
    localStorage.setItem('auth-token', 'existing-token')
    localStorage.setItem('auth-user', JSON.stringify({
      id: '1',
      name: 'Persisted User',
      email: 'persisted@example.com',
      role: 'buyer'
    }))

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user?.name).toBe('Persisted User')
  })

  it('handles token refresh', async () => {
    const newToken = 'new-token'
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: newToken })
    })

    localStorage.setItem('auth-token', 'old-token')

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.refreshToken()
    })

    expect(localStorage.getItem('auth-token')).toBe(newToken)
  })

  it('handles token refresh failure', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Token expired' })
    })

    localStorage.setItem('auth-token', 'expired-token')

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.refreshToken()
    })

    // Should logout user on token refresh failure
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(localStorage.getItem('auth-token')).toBeNull()
  })

  it('handles network errors gracefully', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      try {
        await result.current.login('john@example.com', 'password')
      } catch (error) {
        expect(error).toEqual(new Error('Network error'))
      }
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('clears user data on logout', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'buyer' as const
    }

    localStorage.setItem('auth-token', 'mock-token')
    localStorage.setItem('auth-user', JSON.stringify(mockUser))

    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.setUser(mockUser)
    })

    await act(async () => {
      await result.current.logout()
    })

    expect(localStorage.getItem('auth-token')).toBeNull()
    expect(localStorage.getItem('auth-user')).toBeNull()
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})
