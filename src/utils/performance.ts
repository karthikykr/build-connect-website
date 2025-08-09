/**
 * Performance optimization utilities for BUILD-CONNECT
 */

// Image optimization utilities
export const imageOptimization = {
  /**
   * Generate responsive image sizes for different screen sizes
   */
  generateSrcSet: (baseUrl: string, sizes: number[] = [320, 640, 768, 1024, 1280, 1920]) => {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ')
  },

  /**
   * Generate sizes attribute for responsive images
   */
  generateSizes: (breakpoints: { [key: string]: string } = {
    '(max-width: 640px)': '100vw',
    '(max-width: 768px)': '50vw',
    '(max-width: 1024px)': '33vw',
    default: '25vw'
  }) => {
    const sizeEntries = Object.entries(breakpoints)
    const mediaQueries = sizeEntries.slice(0, -1).map(([query, size]) => `${query} ${size}`)
    const defaultSize = breakpoints.default || '100vw'
    return [...mediaQueries, defaultSize].join(', ')
  },

  /**
   * Lazy load images with intersection observer
   */
  lazyLoadImage: (img: HTMLImageElement, src: string, placeholder?: string) => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target as HTMLImageElement
            image.src = src
            image.classList.remove('lazy')
            observer.unobserve(image)
          }
        })
      })

      if (placeholder) {
        img.src = placeholder
      }
      img.classList.add('lazy')
      observer.observe(img)
    } else {
      // Fallback for browsers without IntersectionObserver
      img.src = src
    }
  }
}

// Bundle optimization utilities
export const bundleOptimization = {
  /**
   * Dynamic import with error handling
   */
  dynamicImport: async <T>(importFn: () => Promise<T>): Promise<T | null> => {
    try {
      return await importFn()
    } catch (error) {
      console.error('Dynamic import failed:', error)
      return null
    }
  },

  /**
   * Preload critical resources
   */
  preloadResource: (href: string, as: string, type?: string) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    if (type) link.type = type
    document.head.appendChild(link)
  },

  /**
   * Prefetch resources for future navigation
   */
  prefetchResource: (href: string) => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  }
}

// Memory optimization utilities
export const memoryOptimization = {
  /**
   * Debounce function to limit function calls
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate?: boolean
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null
    
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        timeout = null
        if (!immediate) func(...args)
      }
      
      const callNow = immediate && !timeout
      
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      
      if (callNow) func(...args)
    }
  },

  /**
   * Throttle function to limit function execution rate
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    
    return function executedFunction(...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  /**
   * Memoize function results
   */
  memoize: <T extends (...args: any[]) => any>(fn: T): T => {
    const cache = new Map()
    
    return ((...args: Parameters<T>): ReturnType<T> => {
      const key = JSON.stringify(args)
      
      if (cache.has(key)) {
        return cache.get(key)
      }
      
      const result = fn(...args)
      cache.set(key, result)
      
      return result
    }) as T
  },

  /**
   * Clean up event listeners and observers
   */
  cleanup: (cleanupFunctions: (() => void)[]) => {
    cleanupFunctions.forEach(cleanup => {
      try {
        cleanup()
      } catch (error) {
        console.error('Cleanup function failed:', error)
      }
    })
  }
}

// Network optimization utilities
export const networkOptimization = {
  /**
   * Retry failed requests with exponential backoff
   */
  retryRequest: async <T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: Error
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries) {
          throw lastError
        }
        
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError!
  },

  /**
   * Request with timeout
   */
  requestWithTimeout: async <T>(
    requestFn: () => Promise<T>,
    timeout: number = 10000
  ): Promise<T> => {
    return Promise.race([
      requestFn(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ])
  },

  /**
   * Batch multiple requests
   */
  batchRequests: async <T>(
    requests: (() => Promise<T>)[],
    batchSize: number = 5
  ): Promise<T[]> => {
    const results: T[] = []
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize)
      const batchResults = await Promise.all(batch.map(request => request()))
      results.push(...batchResults)
    }
    
    return results
  }
}

// Performance monitoring utilities
export const performanceMonitoring = {
  /**
   * Measure function execution time
   */
  measureTime: async <T>(
    name: string,
    fn: () => Promise<T> | T
  ): Promise<T> => {
    const start = performance.now()
    
    try {
      const result = await fn()
      const end = performance.now()
      console.log(`${name} took ${end - start} milliseconds`)
      return result
    } catch (error) {
      const end = performance.now()
      console.error(`${name} failed after ${end - start} milliseconds:`, error)
      throw error
    }
  },

  /**
   * Monitor Core Web Vitals
   */
  monitorWebVitals: () => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint (LCP)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // Monitor First Input Delay (FID)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach(entry => {
          console.log('FID:', entry.processingStart - entry.startTime)
        })
      }).observe({ entryTypes: ['first-input'] })

      // Monitor Cumulative Layout Shift (CLS)
      new PerformanceObserver((entryList) => {
        let clsValue = 0
        const entries = entryList.getEntries()
        entries.forEach(entry => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        })
        console.log('CLS:', clsValue)
      }).observe({ entryTypes: ['layout-shift'] })
    }
  },

  /**
   * Monitor resource loading performance
   */
  monitorResourceLoading: () => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach(entry => {
          if (entry.duration > 1000) { // Log slow resources (>1s)
            console.warn('Slow resource:', entry.name, entry.duration)
          }
        })
      }).observe({ entryTypes: ['resource'] })
    }
  }
}

// Cache optimization utilities
export const cacheOptimization = {
  /**
   * Simple in-memory cache with TTL
   */
  createCache: <T>(defaultTTL: number = 300000) => { // 5 minutes default
    const cache = new Map<string, { value: T; expires: number }>()
    
    return {
      get: (key: string): T | null => {
        const item = cache.get(key)
        if (!item) return null
        
        if (Date.now() > item.expires) {
          cache.delete(key)
          return null
        }
        
        return item.value
      },
      
      set: (key: string, value: T, ttl: number = defaultTTL): void => {
        cache.set(key, {
          value,
          expires: Date.now() + ttl
        })
      },
      
      delete: (key: string): boolean => {
        return cache.delete(key)
      },
      
      clear: (): void => {
        cache.clear()
      },
      
      size: (): number => {
        return cache.size
      }
    }
  },

  /**
   * Browser storage cache with compression
   */
  createStorageCache: (storage: Storage = localStorage) => {
    return {
      get: <T>(key: string): T | null => {
        try {
          const item = storage.getItem(key)
          if (!item) return null
          
          const parsed = JSON.parse(item)
          if (Date.now() > parsed.expires) {
            storage.removeItem(key)
            return null
          }
          
          return parsed.value
        } catch {
          return null
        }
      },
      
      set: <T>(key: string, value: T, ttl: number = 300000): void => {
        try {
          const item = {
            value,
            expires: Date.now() + ttl
          }
          storage.setItem(key, JSON.stringify(item))
        } catch (error) {
          console.error('Failed to set cache item:', error)
        }
      },
      
      delete: (key: string): void => {
        storage.removeItem(key)
      },
      
      clear: (): void => {
        storage.clear()
      }
    }
  }
}
