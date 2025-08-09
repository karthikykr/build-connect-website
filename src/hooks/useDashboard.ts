/**
 * Dashboard Hook - Fetch and manage dashboard data
 */

import { useQuery } from '@tanstack/react-query'
import { dashboardService, DashboardData } from '@/services/dashboard.service'
import { useAuth } from '@/hooks/useAuth'

export function useDashboard() {
  const { isAuthenticated } = useAuth()

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await dashboardService.getDashboardData()
      if (response.success) {
        return response.data
      }
      throw new Error(response.error || 'Failed to fetch dashboard data')
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('401') || error?.message?.includes('unauthorized')) {
        return false
      }
      // Don't retry on network errors (backend not running)
      if (error?.message?.includes('Failed to fetch')) {
        return false
      }
      return failureCount < 2
    }
  })

  return {
    dashboardData,
    isLoading,
    error,
    refetch
  }
}

export function useDashboardStats() {
  const { dashboardData, isLoading, error } = useDashboard()
  
  return {
    stats: dashboardData?.stats,
    isLoading,
    error
  }
}

export function useRecentActivity() {
  const { dashboardData, isLoading, error } = useDashboard()
  
  return {
    activities: dashboardData?.recentActivity || [],
    isLoading,
    error
  }
}

export function useNotifications() {
  const { dashboardData, isLoading, error } = useDashboard()
  
  return {
    notifications: dashboardData?.notifications,
    isLoading,
    error
  }
}
