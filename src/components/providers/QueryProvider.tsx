/**
 * React Query Provider Configuration
 */

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, ReactNode } from 'react'
import { toast } from 'react-hot-toast'

// Query Client Configuration
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time - how long data is considered fresh
        staleTime: 5 * 60 * 1000, // 5 minutes
        
        // Cache time - how long data stays in cache after becoming unused
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        
        // Retry configuration
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors except 401
          if (error?.status >= 400 && error?.status < 500 && error?.status !== 401) {
            return false
          }
          // Retry up to 3 times for other errors
          return failureCount < 3
        },
        
        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Refetch on window focus (disabled by default for better UX)
        refetchOnWindowFocus: false,
        
        // Refetch on reconnect
        refetchOnReconnect: true,
        
        // Refetch on mount if data is stale
        refetchOnMount: true,
      },
      mutations: {
        // Retry configuration for mutations
        retry: (failureCount, error: any) => {
          // Don't retry client errors
          if (error?.status >= 400 && error?.status < 500) {
            return false
          }
          // Retry up to 2 times for server errors
          return failureCount < 2
        },
        
        // Retry delay for mutations
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
        
        // Global error handler for mutations
        onError: (error: any) => {
          // Only show toast if the mutation doesn't handle its own errors
          if (!error?.handled) {
            toast.error(error?.message || 'An error occurred')
          }
        },
      },
    },
  })
}

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create query client instance (only once per component lifecycle)
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query DevTools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}

// Export query client for use in other parts of the app
export { createQueryClient }

// Utility function to invalidate all queries
export const invalidateAllQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries()
}

// Utility function to clear all queries
export const clearAllQueries = (queryClient: QueryClient) => {
  queryClient.clear()
}

// Utility function to prefetch data
export const prefetchQuery = async (
  queryClient: QueryClient,
  queryKey: any[],
  queryFn: () => Promise<any>,
  options?: {
    staleTime?: number
    gcTime?: number
  }
) => {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: options?.staleTime || 5 * 60 * 1000,
    gcTime: options?.gcTime || 10 * 60 * 1000,
  })
}

// Utility function to set query data
export const setQueryData = (
  queryClient: QueryClient,
  queryKey: any[],
  data: any
) => {
  queryClient.setQueryData(queryKey, data)
}

// Utility function to get query data
export const getQueryData = (
  queryClient: QueryClient,
  queryKey: any[]
) => {
  return queryClient.getQueryData(queryKey)
}

// Error boundary for React Query errors
export class QueryErrorBoundary extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'QueryErrorBoundary'
  }
}

// Global error handler for unhandled query errors
export const handleQueryError = (error: any) => {
  console.error('Unhandled query error:', error)
  
  // Log to error reporting service in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error)
  }
  
  // Show user-friendly error message
  if (error?.status === 401) {
    toast.error('Your session has expired. Please log in again.')
  } else if (error?.status >= 500) {
    toast.error('Server error. Please try again later.')
  } else if (error?.message) {
    toast.error(error.message)
  } else {
    toast.error('An unexpected error occurred.')
  }
}

// Query key factories for consistent key generation
export const queryKeyFactory = {
  // Base keys
  auth: ['auth'] as const,
  properties: ['properties'] as const,
  brokers: ['brokers'] as const,
  notifications: ['notifications'] as const,
  payments: ['payments'] as const,
  siteScout: ['site-scout'] as const,
  
  // Nested keys
  authUser: () => [...queryKeyFactory.auth, 'user'] as const,
  propertiesList: (filters?: any) => [...queryKeyFactory.properties, 'list', filters] as const,
  propertyDetail: (id: string) => [...queryKeyFactory.properties, 'detail', id] as const,
  brokersList: (filters?: any) => [...queryKeyFactory.brokers, 'list', filters] as const,
  brokerDetail: (id: string) => [...queryKeyFactory.brokers, 'detail', id] as const,
}

// Optimistic update helpers
export const optimisticUpdate = {
  // Add item to list
  addToList: <T extends { id: string }>(
    queryClient: QueryClient,
    queryKey: any[],
    newItem: T
  ) => {
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (Array.isArray(oldData)) {
        return [newItem, ...oldData]
      }
      if (oldData?.data && Array.isArray(oldData.data)) {
        return {
          ...oldData,
          data: [newItem, ...oldData.data],
          total: (oldData.total || 0) + 1,
        }
      }
      return oldData
    })
  },
  
  // Update item in list
  updateInList: <T extends { id: string }>(
    queryClient: QueryClient,
    queryKey: any[],
    updatedItem: T
  ) => {
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (Array.isArray(oldData)) {
        return oldData.map((item: T) => 
          item.id === updatedItem.id ? updatedItem : item
        )
      }
      if (oldData?.data && Array.isArray(oldData.data)) {
        return {
          ...oldData,
          data: oldData.data.map((item: T) => 
            item.id === updatedItem.id ? updatedItem : item
          ),
        }
      }
      return oldData
    })
  },
  
  // Remove item from list
  removeFromList: <T extends { id: string }>(
    queryClient: QueryClient,
    queryKey: any[],
    itemId: string
  ) => {
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (Array.isArray(oldData)) {
        return oldData.filter((item: T) => item.id !== itemId)
      }
      if (oldData?.data && Array.isArray(oldData.data)) {
        return {
          ...oldData,
          data: oldData.data.filter((item: T) => item.id !== itemId),
          total: Math.max((oldData.total || 0) - 1, 0),
        }
      }
      return oldData
    })
  },
}

// Background sync utilities
export const backgroundSync = {
  // Sync data when app comes back online
  syncOnReconnect: (queryClient: QueryClient) => {
    window.addEventListener('online', () => {
      queryClient.invalidateQueries()
    })
  },
  
  // Sync data when app becomes visible
  syncOnVisibilityChange: (queryClient: QueryClient) => {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        queryClient.invalidateQueries()
      }
    })
  },
  
  // Periodic sync
  periodicSync: (queryClient: QueryClient, interval = 5 * 60 * 1000) => {
    setInterval(() => {
      queryClient.invalidateQueries()
    }, interval)
  },
}
