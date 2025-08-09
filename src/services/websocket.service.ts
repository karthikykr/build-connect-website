/**
 * WebSocket Service for Real-time Features
 */

import { io, Socket } from 'socket.io-client'
import { toast } from 'react-hot-toast'
import { tokenManager } from '@/lib/api-client'

// Event types
export interface WebSocketEvents {
  // Connection events
  connect: () => void
  disconnect: (reason: string) => void
  error: (error: Error) => void
  
  // Authentication events
  authenticated: (data: { userId: string; role: string }) => void
  authError: (error: string) => void
  
  // Notification events
  notification: (notification: {
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    message: string
    data?: any
  }) => void
  
  // Property events
  propertyUpdated: (property: any) => void
  propertyDeleted: (propertyId: string) => void
  propertyInquiry: (inquiry: any) => void
  
  // Broker events
  brokerStatusChanged: (data: { brokerId: string; status: 'online' | 'offline' | 'busy' }) => void
  brokerMessage: (message: any) => void
  
  // Site scouting events
  siteScoutRequestAssigned: (request: any) => void
  siteScoutResponseSubmitted: (response: any) => void
  siteScoutStatusUpdated: (data: { requestId: string; status: string }) => void
  
  // Payment events
  paymentCompleted: (payment: any) => void
  paymentFailed: (data: { paymentId: string; reason: string }) => void
  commissionUpdated: (commission: any) => void
  
  // Chat events
  messageReceived: (message: any) => void
  messageRead: (data: { messageId: string; readBy: string }) => void
  userTyping: (data: { userId: string; chatId: string }) => void
  userStoppedTyping: (data: { userId: string; chatId: string }) => void
  
  // System events
  systemMaintenance: (data: { message: string; scheduledAt: string }) => void
  systemUpdate: (data: { version: string; features: string[] }) => void
}

class WebSocketService {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isConnecting = false
  private eventListeners: Map<string, Set<Function>> = new Map()

  constructor() {
    this.setupEventListeners()
  }

  /**
   * Connect to WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve()
        return
      }

      if (this.isConnecting) {
        return
      }

      this.isConnecting = true

      const token = tokenManager.getToken()
      if (!token) {
        this.isConnecting = false
        reject(new Error('No authentication token available'))
        return
      }

      this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001', {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
      })

      this.socket.on('connect', () => {
        console.log('WebSocket connected')
        this.isConnecting = false
        this.reconnectAttempts = 0
        this.emit('connect')
        resolve()
      })

      this.socket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason)
        this.isConnecting = false
        this.emit('disconnect', reason)
        
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          this.reconnect()
        }
      })

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error)
        this.isConnecting = false
        this.emit('error', error)
        reject(error)
      })

      this.socket.on('authenticated', (data) => {
        console.log('WebSocket authenticated:', data)
        this.emit('authenticated', data)
      })

      this.socket.on('authError', (error) => {
        console.error('WebSocket auth error:', error)
        this.emit('authError', error)
        toast.error('Authentication failed. Please log in again.')
      })

      // Set up event handlers
      this.setupSocketEventHandlers()
    })
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.isConnecting = false
    this.reconnectAttempts = 0
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false
  }

  /**
   * Emit event to server
   */
  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn('WebSocket not connected, cannot emit event:', event)
    }
  }

  /**
   * Subscribe to event
   */
  on<K extends keyof WebSocketEvents>(
    event: K,
    listener: WebSocketEvents[K]
  ): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(listener)
  }

  /**
   * Unsubscribe from event
   */
  off<K extends keyof WebSocketEvents>(
    event: K,
    listener: WebSocketEvents[K]
  ): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.delete(listener)
    }
  }

  /**
   * Emit event to local listeners
   */
  private emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(...args)
        } catch (error) {
          console.error('Error in WebSocket event listener:', error)
        }
      })
    }
  }

  /**
   * Reconnect to server
   */
  private async reconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      toast.error('Connection lost. Please refresh the page.')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`)

    setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error)
      })
    }, delay)
  }

  /**
   * Set up socket event handlers
   */
  private setupSocketEventHandlers(): void {
    if (!this.socket) return

    // Notification events
    this.socket.on('notification', (notification) => {
      this.emit('notification', notification)
      
      // Show toast notification
      switch (notification.type) {
        case 'success':
          toast.success(notification.message)
          break
        case 'error':
          toast.error(notification.message)
          break
        case 'warning':
          toast(notification.message, { icon: '⚠️' })
          break
        default:
          toast(notification.message)
      }
    })

    // Property events
    this.socket.on('propertyUpdated', (property) => {
      this.emit('propertyUpdated', property)
    })

    this.socket.on('propertyDeleted', (propertyId) => {
      this.emit('propertyDeleted', propertyId)
    })

    this.socket.on('propertyInquiry', (inquiry) => {
      this.emit('propertyInquiry', inquiry)
      toast.success('New property inquiry received!')
    })

    // Broker events
    this.socket.on('brokerStatusChanged', (data) => {
      this.emit('brokerStatusChanged', data)
    })

    this.socket.on('brokerMessage', (message) => {
      this.emit('brokerMessage', message)
    })

    // Site scouting events
    this.socket.on('siteScoutRequestAssigned', (request) => {
      this.emit('siteScoutRequestAssigned', request)
      toast.success('Site scout request assigned to you!')
    })

    this.socket.on('siteScoutResponseSubmitted', (response) => {
      this.emit('siteScoutResponseSubmitted', response)
      toast.success('Site scout response submitted!')
    })

    this.socket.on('siteScoutStatusUpdated', (data) => {
      this.emit('siteScoutStatusUpdated', data)
    })

    // Payment events
    this.socket.on('paymentCompleted', (payment) => {
      this.emit('paymentCompleted', payment)
      toast.success('Payment completed successfully!')
    })

    this.socket.on('paymentFailed', (data) => {
      this.emit('paymentFailed', data)
      toast.error(`Payment failed: ${data.reason}`)
    })

    this.socket.on('commissionUpdated', (commission) => {
      this.emit('commissionUpdated', commission)
    })

    // Chat events
    this.socket.on('messageReceived', (message) => {
      this.emit('messageReceived', message)
    })

    this.socket.on('messageRead', (data) => {
      this.emit('messageRead', data)
    })

    this.socket.on('userTyping', (data) => {
      this.emit('userTyping', data)
    })

    this.socket.on('userStoppedTyping', (data) => {
      this.emit('userStoppedTyping', data)
    })

    // System events
    this.socket.on('systemMaintenance', (data) => {
      this.emit('systemMaintenance', data)
      toast(data.message, { 
        icon: '🔧',
        duration: 10000,
      })
    })

    this.socket.on('systemUpdate', (data) => {
      this.emit('systemUpdate', data)
      toast.success(`System updated to version ${data.version}`)
    })
  }

  /**
   * Set up global event listeners
   */
  private setupEventListeners(): void {
    // Auto-connect when token is available
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === 'auth-token' && event.newValue) {
          this.connect().catch(console.error)
        } else if (event.key === 'auth-token' && !event.newValue) {
          this.disconnect()
        }
      })

      // Reconnect when coming back online
      window.addEventListener('online', () => {
        if (!this.isConnected()) {
          this.connect().catch(console.error)
        }
      })

      // Disconnect when going offline
      window.addEventListener('offline', () => {
        this.disconnect()
      })

      // Reconnect when page becomes visible
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !this.isConnected()) {
          const token = tokenManager.getToken()
          if (token) {
            this.connect().catch(console.error)
          }
        }
      })
    }
  }

  /**
   * Join a room
   */
  joinRoom(room: string): void {
    this.emit('joinRoom', { room })
  }

  /**
   * Leave a room
   */
  leaveRoom(room: string): void {
    this.emit('leaveRoom', { room })
  }

  /**
   * Send typing indicator
   */
  sendTyping(chatId: string): void {
    this.emit('typing', { chatId })
  }

  /**
   * Send stop typing indicator
   */
  sendStopTyping(chatId: string): void {
    this.emit('stopTyping', { chatId })
  }

  /**
   * Update user status
   */
  updateStatus(status: 'online' | 'offline' | 'busy'): void {
    this.emit('updateStatus', { status })
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService()

// Auto-connect if token is available
if (typeof window !== 'undefined') {
  const token = tokenManager.getToken()
  if (token) {
    webSocketService.connect().catch(console.error)
  }
}

export default webSocketService
