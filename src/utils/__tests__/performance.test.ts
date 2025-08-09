import {
  imageOptimization,
  bundleOptimization,
  memoryOptimization,
  networkOptimization,
  performanceMonitoring,
  cacheOptimization
} from '../performance'

describe('Performance Utilities', () => {
  describe('imageOptimization', () => {
    it('should generate correct srcSet', () => {
      const baseUrl = 'https://example.com/image.jpg'
      const sizes = [320, 640, 1024]
      
      const srcSet = imageOptimization.generateSrcSet(baseUrl, sizes)
      
      expect(srcSet).toBe(
        'https://example.com/image.jpg?w=320 320w, ' +
        'https://example.com/image.jpg?w=640 640w, ' +
        'https://example.com/image.jpg?w=1024 1024w'
      )
    })

    it('should generate correct sizes attribute', () => {
      const breakpoints = {
        '(max-width: 640px)': '100vw',
        '(max-width: 1024px)': '50vw',
        default: '25vw'
      }
      
      const sizes = imageOptimization.generateSizes(breakpoints)
      
      expect(sizes).toBe(
        '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
      )
    })

    it('should handle lazy loading with IntersectionObserver', () => {
      // Mock IntersectionObserver
      const mockObserver = {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn()
      }
      
      global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
        // Simulate intersection
        setTimeout(() => {
          callback([{ isIntersecting: true, target: mockImg }])
        }, 100)
        return mockObserver
      })

      const mockImg = document.createElement('img')
      const src = 'https://example.com/image.jpg'
      const placeholder = 'data:image/svg+xml;base64,placeholder'
      
      imageOptimization.lazyLoadImage(mockImg, src, placeholder)
      
      expect(mockImg.src).toBe(placeholder)
      expect(mockImg.classList.contains('lazy')).toBe(true)
      expect(mockObserver.observe).toHaveBeenCalledWith(mockImg)
    })
  })

  describe('bundleOptimization', () => {
    it('should handle dynamic imports with error handling', async () => {
      const successfulImport = () => Promise.resolve({ default: 'module' })
      const failingImport = () => Promise.reject(new Error('Import failed'))
      
      const result1 = await bundleOptimization.dynamicImport(successfulImport)
      const result2 = await bundleOptimization.dynamicImport(failingImport)
      
      expect(result1).toEqual({ default: 'module' })
      expect(result2).toBeNull()
    })

    it('should preload resources correctly', () => {
      // Mock document.head.appendChild
      const mockAppendChild = jest.fn()
      Object.defineProperty(document, 'head', {
        value: { appendChild: mockAppendChild },
        writable: true
      })

      bundleOptimization.preloadResource('/script.js', 'script', 'text/javascript')
      
      expect(mockAppendChild).toHaveBeenCalledWith(
        expect.objectContaining({
          rel: 'preload',
          href: '/script.js',
          as: 'script',
          type: 'text/javascript'
        })
      )
    })
  })

  describe('memoryOptimization', () => {
    it('should debounce function calls', (done) => {
      const mockFn = jest.fn()
      const debouncedFn = memoryOptimization.debounce(mockFn, 100)
      
      // Call multiple times rapidly
      debouncedFn('arg1')
      debouncedFn('arg2')
      debouncedFn('arg3')
      
      // Should not be called immediately
      expect(mockFn).not.toHaveBeenCalled()
      
      // Should be called once after delay
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1)
        expect(mockFn).toHaveBeenCalledWith('arg3')
        done()
      }, 150)
    })

    it('should throttle function calls', (done) => {
      const mockFn = jest.fn()
      const throttledFn = memoryOptimization.throttle(mockFn, 100)
      
      // Call multiple times rapidly
      throttledFn('arg1')
      throttledFn('arg2')
      throttledFn('arg3')
      
      // Should be called immediately for first call
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('arg1')
      
      // Should not be called again until throttle period ends
      setTimeout(() => {
        throttledFn('arg4')
        expect(mockFn).toHaveBeenCalledTimes(2)
        expect(mockFn).toHaveBeenCalledWith('arg4')
        done()
      }, 150)
    })

    it('should memoize function results', () => {
      const expensiveFn = jest.fn((x: number) => x * 2)
      const memoizedFn = memoryOptimization.memoize(expensiveFn)
      
      // First call
      const result1 = memoizedFn(5)
      expect(result1).toBe(10)
      expect(expensiveFn).toHaveBeenCalledTimes(1)
      
      // Second call with same argument (should use cache)
      const result2 = memoizedFn(5)
      expect(result2).toBe(10)
      expect(expensiveFn).toHaveBeenCalledTimes(1)
      
      // Third call with different argument
      const result3 = memoizedFn(10)
      expect(result3).toBe(20)
      expect(expensiveFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('networkOptimization', () => {
    it('should retry failed requests with exponential backoff', async () => {
      let attempts = 0
      const failingRequest = () => {
        attempts++
        if (attempts < 3) {
          return Promise.reject(new Error('Network error'))
        }
        return Promise.resolve('success')
      }
      
      const result = await networkOptimization.retryRequest(failingRequest, 3, 10)
      
      expect(result).toBe('success')
      expect(attempts).toBe(3)
    })

    it('should handle request timeout', async () => {
      const slowRequest = () => new Promise(resolve => setTimeout(resolve, 200))
      
      await expect(
        networkOptimization.requestWithTimeout(slowRequest, 100)
      ).rejects.toThrow('Request timeout')
    })

    it('should batch requests correctly', async () => {
      const requests = [
        () => Promise.resolve(1),
        () => Promise.resolve(2),
        () => Promise.resolve(3),
        () => Promise.resolve(4),
        () => Promise.resolve(5)
      ]
      
      const results = await networkOptimization.batchRequests(requests, 2)
      
      expect(results).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe('performanceMonitoring', () => {
    it('should measure function execution time', async () => {
      const mockFn = jest.fn(() => Promise.resolve('result'))
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      const result = await performanceMonitoring.measureTime('test-function', mockFn)
      
      expect(result).toBe('result')
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('test-function took')
      )
      
      consoleSpy.mockRestore()
    })

    it('should handle function errors while measuring time', async () => {
      const mockFn = jest.fn(() => Promise.reject(new Error('Test error')))
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      await expect(
        performanceMonitoring.measureTime('failing-function', mockFn)
      ).rejects.toThrow('Test error')
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('failing-function failed after'),
        expect.any(Error)
      )
      
      consoleSpy.mockRestore()
    })
  })

  describe('cacheOptimization', () => {
    it('should create in-memory cache with TTL', () => {
      const cache = cacheOptimization.createCache<string>(1000) // 1 second TTL
      
      // Set and get value
      cache.set('key1', 'value1')
      expect(cache.get('key1')).toBe('value1')
      
      // Value should expire
      setTimeout(() => {
        expect(cache.get('key1')).toBeNull()
      }, 1100)
      
      // Test cache operations
      cache.set('key2', 'value2')
      expect(cache.size()).toBe(1)
      
      cache.delete('key2')
      expect(cache.get('key2')).toBeNull()
      expect(cache.size()).toBe(0)
      
      cache.set('key3', 'value3')
      cache.clear()
      expect(cache.size()).toBe(0)
    })

    it('should create storage cache with compression', () => {
      // Mock localStorage
      const mockStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      }
      
      const cache = cacheOptimization.createStorageCache(mockStorage as any)
      
      // Test set operation
      cache.set('key1', { data: 'value1' })
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'key1',
        expect.stringContaining('"data":"value1"')
      )
      
      // Test get operation with valid data
      mockStorage.getItem.mockReturnValue(JSON.stringify({
        value: { data: 'value1' },
        expires: Date.now() + 10000
      }))
      
      const result = cache.get('key1')
      expect(result).toEqual({ data: 'value1' })
      
      // Test get operation with expired data
      mockStorage.getItem.mockReturnValue(JSON.stringify({
        value: { data: 'value1' },
        expires: Date.now() - 1000
      }))
      
      const expiredResult = cache.get('key1')
      expect(expiredResult).toBeNull()
      expect(mockStorage.removeItem).toHaveBeenCalledWith('key1')
    })
  })
})
