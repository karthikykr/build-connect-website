/**
 * Data Synchronization Service
 */

import { QueryClient } from '@tanstack/react-query'
import { webSocketService } from './websocket.service'
import { propertyKeys } from '@/hooks/api/useProperties'
import { authKeys } from '@/hooks/api/useAuth'
import { toast } from 'react-hot-toast'

// Sync configuration
interface SyncConfig {
  enabled: boolean
  syncInterval: number // milliseconds
  retryAttempts: number
  retryDelay: number
  conflictResolution: 'client' | 'server' | 'manual'
}

// Sync status
interface SyncStatus {
  isOnline: boolean
  lastSync: Date | null
  pendingChanges: number
  syncInProgress: boolean
  errors: string[]
}

// Pending change
interface PendingChange {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: string
  entityId: string
  data: any
  timestamp: Date
  retryCount: number
}

class SyncService {
  private queryClient: QueryClient | null = null
  private config: SyncConfig = {
    enabled: true,
    syncInterval: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 5000, // 5 seconds
    conflictResolution: 'server',
  }
  private status: SyncStatus = {
    isOnline: navigator.onLine,
    lastSync: null,
    pendingChanges: 0,
    syncInProgress: false,
    errors: [],
  }
  private pendingChanges: Map<string, PendingChange> = new Map()
  private syncInterval: NodeJS.Timeout | null = null
  private eventListeners: Map<string, Set<Function>> = new Map()

  constructor() {
    this.setupEventListeners()
    this.setupWebSocketListeners()
  }

  /**
   * Initialize sync service with query client
   */
  initialize(queryClient: QueryClient): void {
    this.queryClient = queryClient
    this.startPeriodicSync()
  }

  /**
   * Get current sync status
   */
  getStatus(): SyncStatus {
    return { ...this.status }
  }

  /**
   * Update sync configuration
   */
  updateConfig(config: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...config }
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.startPeriodicSync()
    }
  }

  /**
   * Add pending change for offline sync
   */
  addPendingChange(change: Omit<PendingChange, 'id' | 'timestamp' | 'retryCount'>): void {
    const id = `${change.type}_${change.entity}_${change.entityId}_${Date.now()}`
    const pendingChange: PendingChange = {
      ...change,
      id,
      timestamp: new Date(),
      retryCount: 0,
    }
    
    this.pendingChanges.set(id, pendingChange)
    this.updateStatus({ pendingChanges: this.pendingChanges.size })
    
    // Store in localStorage for persistence
    this.savePendingChanges()
    
    // Try to sync immediately if online
    if (this.status.isOnline) {
      this.syncPendingChanges()
    }
  }

  /**
   * Force sync all data
   */
  async forceSync(): Promise<void> {
    if (!this.queryClient || this.status.syncInProgress) {
      return
    }

    this.updateStatus({ syncInProgress: true, errors: [] })

    try {
      // Sync pending changes first
      await this.syncPendingChanges()
      
      // Invalidate all queries to refetch fresh data
      await this.queryClient.invalidateQueries()
      
      this.updateStatus({ 
        lastSync: new Date(),
        syncInProgress: false,
      })
      
      this.emit('syncCompleted', { success: true })
      
    } catch (error) {
      console.error('Force sync failed:', error)
      this.updateStatus({ 
        syncInProgress: false,
        errors: [...this.status.errors, (error as Error).message],
      })
      
      this.emit('syncFailed', { error })
    }
  }

  /**
   * Sync pending changes
   */
  private async syncPendingChanges(): Promise<void> {
    if (!this.status.isOnline || this.pendingChanges.size === 0) {
      return
    }

    const changes = Array.from(this.pendingChanges.values())
    const failedChanges: PendingChange[] = []

    for (const change of changes) {
      try {
        await this.syncSingleChange(change)
        this.pendingChanges.delete(change.id)
        
      } catch (error) {
        console.error('Failed to sync change:', change, error)
        
        change.retryCount++
        if (change.retryCount >= this.config.retryAttempts) {
          // Max retries reached, remove from pending
          this.pendingChanges.delete(change.id)
          this.status.errors.push(`Failed to sync ${change.type} ${change.entity}: ${(error as Error).message}`)
        } else {
          failedChanges.push(change)
        }
      }
    }

    this.updateStatus({ pendingChanges: this.pendingChanges.size })
    this.savePendingChanges()

    if (failedChanges.length > 0) {
      // Retry failed changes after delay
      setTimeout(() => {
        this.syncPendingChanges()
      }, this.config.retryDelay)
    }
  }

  /**
   * Sync a single change
   */
  private async syncSingleChange(change: PendingChange): Promise<void> {
    // This would make actual API calls to sync the change
    // For now, we'll simulate the sync
    
    const endpoint = this.getEndpointForEntity(change.entity)
    const method = this.getMethodForChangeType(change.type)
    
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
      },
      body: change.type !== 'delete' ? JSON.stringify(change.data) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status} ${response.statusText}`)
    }

    // Update local cache with server response
    if (this.queryClient) {
      const responseData = await response.json()
      this.updateLocalCache(change.entity, change.entityId, responseData.data)
    }
  }

  /**
   * Update local cache after sync
   */
  private updateLocalCache(entity: string, entityId: string, data: any): void {
    if (!this.queryClient) return

    switch (entity) {
      case 'property':
        // Update property detail cache
        this.queryClient.setQueryData(propertyKeys.detail(entityId), data)
        // Invalidate property lists
        this.queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
        break
        
      case 'user':
        // Update user cache
        this.queryClient.setQueryData(authKeys.user(), data)
        break
        
      // Add more entities as needed
    }
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    if (typeof window === 'undefined') return

    // Online/offline detection
    window.addEventListener('online', () => {
      this.updateStatus({ isOnline: true })
      this.syncPendingChanges()
      this.emit('connectionChanged', { isOnline: true })
    })

    window.addEventListener('offline', () => {
      this.updateStatus({ isOnline: false })
      this.emit('connectionChanged', { isOnline: false })
    })

    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.status.isOnline) {
        this.forceSync()
      }
    })

    // Load pending changes from localStorage
    this.loadPendingChanges()
  }

  /**
   * Set up WebSocket listeners for real-time sync
   */
  private setupWebSocketListeners(): void {
    // Property updates
    webSocketService.on('propertyUpdated', (property) => {
      if (this.queryClient) {
        this.queryClient.setQueryData(propertyKeys.detail(property.id), property)
        this.queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
      }
    })

    webSocketService.on('propertyDeleted', (propertyId) => {
      if (this.queryClient) {
        this.queryClient.removeQueries({ queryKey: propertyKeys.detail(propertyId) })
        this.queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
      }
    })

    // Add more WebSocket listeners for other entities
  }

  /**
   * Start periodic sync
   */
  private startPeriodicSync(): void {
    if (!this.config.enabled) return

    this.syncInterval = setInterval(() => {
      if (this.status.isOnline && !this.status.syncInProgress) {
        this.syncPendingChanges()
      }
    }, this.config.syncInterval)
  }

  /**
   * Save pending changes to localStorage
   */
  private savePendingChanges(): void {
    try {
      const changes = Array.from(this.pendingChanges.values())
      localStorage.setItem('pendingChanges', JSON.stringify(changes))
    } catch (error) {
      console.error('Failed to save pending changes:', error)
    }
  }

  /**
   * Load pending changes from localStorage
   */
  private loadPendingChanges(): void {
    try {
      const saved = localStorage.getItem('pendingChanges')
      if (saved) {
        const changes: PendingChange[] = JSON.parse(saved)
        changes.forEach(change => {
          this.pendingChanges.set(change.id, {
            ...change,
            timestamp: new Date(change.timestamp),
          })
        })
        this.updateStatus({ pendingChanges: this.pendingChanges.size })
      }
    } catch (error) {
      console.error('Failed to load pending changes:', error)
    }
  }

  /**
   * Update sync status
   */
  private updateStatus(updates: Partial<SyncStatus>): void {
    this.status = { ...this.status, ...updates }
    this.emit('statusChanged', this.status)
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data)
        } catch (error) {
          console.error('Error in sync event listener:', error)
        }
      })
    }
  }

  /**
   * Subscribe to sync events
   */
  on(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(listener)
  }

  /**
   * Unsubscribe from sync events
   */
  off(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.delete(listener)
    }
  }

  /**
   * Helper methods
   */
  private getEndpointForEntity(entity: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api'
    switch (entity) {
      case 'property': return `${baseUrl}/properties`
      case 'user': return `${baseUrl}/users`
      case 'broker': return `${baseUrl}/brokers`
      default: return `${baseUrl}/${entity}`
    }
  }

  private getMethodForChangeType(type: string): string {
    switch (type) {
      case 'create': return 'POST'
      case 'update': return 'PATCH'
      case 'delete': return 'DELETE'
      default: return 'GET'
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }
    this.eventListeners.clear()
    this.pendingChanges.clear()
  }
}

// Create singleton instance
export const syncService = new SyncService()

export default syncService
