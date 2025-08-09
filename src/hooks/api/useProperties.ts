/**
 * Properties API Hooks
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  propertiesService, 
  PropertyFilters, 
  CreatePropertyRequest, 
  UpdatePropertyRequest 
} from '@/services/properties.service'
import { Property } from '@/types'

// Query Keys
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: PropertyFilters) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  analytics: (id: string) => [...propertyKeys.all, 'analytics', id] as const,
  inquiries: (id: string) => [...propertyKeys.all, 'inquiries', id] as const,
  favorites: () => [...propertyKeys.all, 'favorites'] as const,
  myProperties: () => [...propertyKeys.all, 'my-properties'] as const,
  recommendations: () => [...propertyKeys.all, 'recommendations'] as const,
  similar: (id: string) => [...propertyKeys.all, 'similar', id] as const,
  stats: () => [...propertyKeys.all, 'stats'] as const,
}

/**
 * Get properties with filters hook
 */
export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: async () => {
      const response = await propertiesService.getProperties(filters)
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Infinite scroll properties hook
 */
export function useInfiniteProperties(filters: PropertyFilters = {}) {
  return useInfiniteQuery({
    queryKey: [...propertyKeys.list(filters), 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await propertiesService.getProperties({
        ...filters,
        page: pageParam,
      })
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }
      return undefined
    },
    staleTime: 2 * 60 * 1000,
  })
}

/**
 * Get property by ID hook
 */
export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: async () => {
      const response = await propertiesService.getProperty(id)
      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Create property mutation hook
 */
export function useCreateProperty() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (propertyData: CreatePropertyRequest) => 
      propertiesService.createProperty(propertyData),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate properties lists
        queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
        queryClient.invalidateQueries({ queryKey: propertyKeys.myProperties() })
        
        // Navigate to the new property
        router.push(`/properties/${response.data.id}`)
        
        toast.success('Property created successfully!')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create property')
    },
  })
}

/**
 * Update property mutation hook
 */
export function useUpdateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePropertyRequest }) =>
      propertiesService.updateProperty(id, data),
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        // Update property cache
        queryClient.setQueryData(propertyKeys.detail(variables.id), response.data)
        
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
        queryClient.invalidateQueries({ queryKey: propertyKeys.myProperties() })
        
        toast.success('Property updated successfully!')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update property')
    },
  })
}

/**
 * Delete property mutation hook
 */
export function useDeleteProperty() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => propertiesService.deleteProperty(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: propertyKeys.detail(id) })
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: propertyKeys.myProperties() })
      
      // Navigate away from deleted property
      router.push('/properties/my-listings')
      
      toast.success('Property deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete property')
    },
  })
}

/**
 * Get property analytics hook
 */
export function usePropertyAnalytics(propertyId: string, dateRange?: {
  startDate: string
  endDate: string
}) {
  return useQuery({
    queryKey: [...propertyKeys.analytics(propertyId), dateRange],
    queryFn: async () => {
      const response = await propertiesService.getPropertyAnalytics(propertyId, dateRange)
      return response.data
    },
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Get property inquiries hook
 */
export function usePropertyInquiries(propertyId: string) {
  return useQuery({
    queryKey: propertyKeys.inquiries(propertyId),
    queryFn: async () => {
      const response = await propertiesService.getPropertyInquiries(propertyId)
      return response.data
    },
    enabled: !!propertyId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Create property inquiry mutation hook
 */
export function useCreateInquiry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ propertyId, inquiry }: {
      propertyId: string
      inquiry: {
        message: string
        phone?: string
        preferredContactTime?: string
      }
    }) => propertiesService.createInquiry(propertyId, inquiry),
    onSuccess: (_, variables) => {
      // Invalidate inquiries for this property
      queryClient.invalidateQueries({ 
        queryKey: propertyKeys.inquiries(variables.propertyId) 
      })
      
      toast.success('Inquiry sent successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send inquiry')
    },
  })
}

/**
 * Get favorite properties hook
 */
export function useFavoriteProperties() {
  return useQuery({
    queryKey: propertyKeys.favorites(),
    queryFn: async () => {
      const response = await propertiesService.getFavoriteProperties()
      return response.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

/**
 * Add to favorites mutation hook
 */
export function useAddToFavorites() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (propertyId: string) => propertiesService.addToFavorites(propertyId),
    onSuccess: (_, propertyId) => {
      // Invalidate favorites list
      queryClient.invalidateQueries({ queryKey: propertyKeys.favorites() })
      
      // Update property cache to reflect favorite status
      queryClient.setQueryData(propertyKeys.detail(propertyId), (oldData: Property | undefined) => {
        if (oldData) {
          return { ...oldData, isFavorite: true }
        }
        return oldData
      })
      
      toast.success('Added to favorites!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add to favorites')
    },
  })
}

/**
 * Remove from favorites mutation hook
 */
export function useRemoveFromFavorites() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (propertyId: string) => propertiesService.removeFromFavorites(propertyId),
    onSuccess: (_, propertyId) => {
      // Invalidate favorites list
      queryClient.invalidateQueries({ queryKey: propertyKeys.favorites() })
      
      // Update property cache to reflect favorite status
      queryClient.setQueryData(propertyKeys.detail(propertyId), (oldData: Property | undefined) => {
        if (oldData) {
          return { ...oldData, isFavorite: false }
        }
        return oldData
      })
      
      toast.success('Removed from favorites!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove from favorites')
    },
  })
}

/**
 * Get my properties hook (for brokers)
 */
export function useMyProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: [...propertyKeys.myProperties(), filters],
    queryFn: async () => {
      const response = await propertiesService.getMyProperties(filters)
      return response.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

/**
 * Get property recommendations hook
 */
export function usePropertyRecommendations(filters?: {
  budget?: number
  location?: string
  propertyType?: string
  limit?: number
}) {
  return useQuery({
    queryKey: [...propertyKeys.recommendations(), filters],
    queryFn: async () => {
      const response = await propertiesService.getRecommendations(filters)
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Get similar properties hook
 */
export function useSimilarProperties(propertyId: string, limit = 5) {
  return useQuery({
    queryKey: [...propertyKeys.similar(propertyId), limit],
    queryFn: async () => {
      const response = await propertiesService.getSimilarProperties(propertyId, limit)
      return response.data
    },
    enabled: !!propertyId,
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Search properties hook
 */
export function useSearchProperties(query: string, filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: [...propertyKeys.lists(), 'search', query, filters],
    queryFn: async () => {
      const response = await propertiesService.searchProperties(query, filters)
      return response.data
    },
    enabled: !!query.trim(),
    staleTime: 1 * 60 * 1000,
  })
}

/**
 * Get property statistics hook
 */
export function usePropertyStats() {
  return useQuery({
    queryKey: propertyKeys.stats(),
    queryFn: async () => {
      const response = await propertiesService.getPropertyStats()
      return response.data
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

/**
 * Share property mutation hook
 */
export function useShareProperty() {
  return useMutation({
    mutationFn: ({ propertyId, shareData }: {
      propertyId: string
      shareData: {
        method: 'email' | 'sms' | 'whatsapp' | 'link'
        recipients?: string[]
        message?: string
      }
    }) => propertiesService.shareProperty(propertyId, shareData),
    onSuccess: () => {
      toast.success('Property shared successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to share property')
    },
  })
}

/**
 * Compare properties hook
 */
export function useCompareProperties(propertyIds: string[]) {
  return useQuery({
    queryKey: [...propertyKeys.all, 'compare', propertyIds.sort()],
    queryFn: async () => {
      const response = await propertiesService.compareProperties(propertyIds)
      return response.data
    },
    enabled: propertyIds.length >= 2,
    staleTime: 5 * 60 * 1000,
  })
}
