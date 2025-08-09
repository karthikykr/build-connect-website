import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // Homepage should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
    
    // Check for critical elements
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/')
    
    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const metrics: any = {}
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.lcp = entry.startTime
            }
            if (entry.entryType === 'first-input') {
              metrics.fid = (entry as any).processingStart - entry.startTime
            }
          })
          
          resolve(metrics)
        })
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] })
        
        // Fallback timeout
        setTimeout(() => resolve({}), 5000)
      })
    })
    
    // LCP should be under 2.5 seconds (good threshold)
    if ((metrics as any).lcp) {
      expect((metrics as any).lcp).toBeLessThan(2500)
    }
    
    // FID should be under 100ms (good threshold)
    if ((metrics as any).fid) {
      expect((metrics as any).fid).toBeLessThan(100)
    }
  })

  test('should load property listings efficiently', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    const startTime = Date.now()
    
    await page.goto('/properties')
    
    // Wait for property cards to load
    await page.waitForSelector('[data-testid="property-card"]', { timeout: 5000 })
    
    const loadTime = Date.now() - startTime
    
    // Property listings should load within 2 seconds
    expect(loadTime).toBeLessThan(2000)
    
    // Check that at least some properties are visible
    const propertyCards = page.locator('[data-testid="property-card"]')
    await expect(propertyCards.first()).toBeVisible()
  })

  test('should handle image loading efficiently', async ({ page }) => {
    await page.goto('/properties')
    
    // Count total images
    const imageCount = await page.locator('img').count()
    
    // Wait for images to load
    await page.waitForFunction(() => {
      const images = Array.from(document.querySelectorAll('img'))
      return images.every(img => img.complete)
    }, { timeout: 10000 })
    
    // Check that images are properly optimized
    const imageSizes = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'))
      return images.map(img => ({
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.offsetWidth,
        displayHeight: img.offsetHeight
      }))
    })
    
    // Images should not be significantly oversized
    imageSizes.forEach(image => {
      if (image.displayWidth > 0 && image.naturalWidth > 0) {
        const oversizeRatio = image.naturalWidth / image.displayWidth
        expect(oversizeRatio).toBeLessThan(3) // Allow up to 3x oversize for retina displays
      }
    })
  })

  test('should handle search efficiently', async ({ page }) => {
    await page.goto('/properties')
    
    const searchInput = page.getByPlaceholder(/search properties/i)
    
    // Measure search response time
    const startTime = Date.now()
    
    await searchInput.fill('apartment')
    await searchInput.press('Enter')
    
    // Wait for search results
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 3000 })
    
    const searchTime = Date.now() - startTime
    
    // Search should complete within 1 second
    expect(searchTime).toBeLessThan(1000)
  })

  test('should handle filtering efficiently', async ({ page }) => {
    await page.goto('/properties')
    
    const startTime = Date.now()
    
    // Apply multiple filters
    await page.getByLabel(/min price/i).fill('1000000')
    await page.getByLabel(/max price/i).fill('5000000')
    await page.getByRole('combobox', { name: /property type/i }).selectOption('apartment')
    await page.getByRole('button', { name: /apply filters/i }).click()
    
    // Wait for filtered results
    await page.waitForSelector('[data-testid="property-card"]', { timeout: 3000 })
    
    const filterTime = Date.now() - startTime
    
    // Filtering should complete within 1 second
    expect(filterTime).toBeLessThan(1000)
  })

  test('should handle infinite scroll efficiently', async ({ page }) => {
    await page.goto('/properties')
    
    // Scroll to bottom to trigger infinite scroll
    let previousCount = 0
    let currentCount = await page.locator('[data-testid="property-card"]').count()
    
    while (currentCount > previousCount && currentCount < 50) { // Limit to prevent infinite loop
      previousCount = currentCount
      
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
      
      // Wait for new items to load
      await page.waitForTimeout(1000)
      
      currentCount = await page.locator('[data-testid="property-card"]').count()
    }
    
    // Should have loaded more items
    expect(currentCount).toBeGreaterThan(previousCount)
  })

  test('should minimize bundle size', async ({ page }) => {
    // Navigate to page and measure network activity
    const responses: any[] = []
    
    page.on('response', response => {
      if (response.url().includes('.js') || response.url().includes('.css')) {
        responses.push({
          url: response.url(),
          size: response.headers()['content-length'],
          type: response.url().includes('.js') ? 'js' : 'css'
        })
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Calculate total bundle size
    const totalJSSize = responses
      .filter(r => r.type === 'js')
      .reduce((sum, r) => sum + (parseInt(r.size) || 0), 0)
    
    const totalCSSSize = responses
      .filter(r => r.type === 'css')
      .reduce((sum, r) => sum + (parseInt(r.size) || 0), 0)
    
    // JS bundle should be under 1MB
    expect(totalJSSize).toBeLessThan(1024 * 1024)
    
    // CSS bundle should be under 200KB
    expect(totalCSSSize).toBeLessThan(200 * 1024)
  })

  test('should handle concurrent users efficiently', async ({ browser }) => {
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext(),
      browser.newContext(),
      browser.newContext()
    ])
    
    const pages = await Promise.all(contexts.map(context => context.newPage()))
    
    const startTime = Date.now()
    
    // Simulate 5 concurrent users accessing the site
    await Promise.all(pages.map(async (page, index) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Simulate user interactions
      if (index % 2 === 0) {
        await page.goto('/properties')
        await page.waitForSelector('[data-testid="property-card"]')
      } else {
        await page.goto('/brokers')
        await page.waitForSelector('[data-testid="broker-card"]')
      }
    }))
    
    const totalTime = Date.now() - startTime
    
    // All concurrent operations should complete within 10 seconds
    expect(totalTime).toBeLessThan(10000)
    
    // Clean up
    await Promise.all(contexts.map(context => context.close()))
  })

  test('should cache resources effectively', async ({ page }) => {
    // First visit
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Navigate away and back
    await page.goto('/about')
    await page.waitForLoadState('networkidle')
    
    const startTime = Date.now()
    
    // Return to homepage (should use cached resources)
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const returnTime = Date.now() - startTime
    
    // Second visit should be faster due to caching
    expect(returnTime).toBeLessThan(1000)
  })

  test('should handle memory efficiently during navigation', async ({ page }) => {
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0
    })
    
    // Navigate through multiple pages
    const pages = ['/properties', '/brokers', '/dashboard', '/properties/add']
    
    for (const pagePath of pages) {
      await page.goto(pagePath)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000) // Allow time for any cleanup
    }
    
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0
    })
    
    // Memory usage should not increase dramatically
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory
      const increaseRatio = memoryIncrease / initialMemory
      
      // Memory should not increase by more than 200%
      expect(increaseRatio).toBeLessThan(2)
    }
  })

  test('should handle form submissions efficiently', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await page.goto('/properties/add')
    
    const startTime = Date.now()
    
    // Fill out property form
    await page.getByLabel(/property title/i).fill('Test Property')
    await page.getByLabel(/description/i).fill('Test description')
    await page.getByLabel(/price/i).fill('1000000')
    await page.getByLabel(/area/i).fill('1000')
    await page.getByRole('combobox', { name: /property type/i }).selectOption('apartment')
    
    // Submit form
    await page.getByRole('button', { name: /add property/i }).click()
    
    // Wait for response
    await page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 })
    
    const submitTime = Date.now() - startTime
    
    // Form submission should complete within 3 seconds
    expect(submitTime).toBeLessThan(3000)
  })
})
