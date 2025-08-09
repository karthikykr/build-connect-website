import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...')

  // Create a browser instance for setup
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // Wait for the development server to be ready
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000'
    console.log(`⏳ Waiting for server at ${baseURL}...`)
    
    let retries = 0
    const maxRetries = 30
    
    while (retries < maxRetries) {
      try {
        const response = await page.goto(baseURL, { timeout: 5000 })
        if (response && response.ok()) {
          console.log('✅ Server is ready!')
          break
        }
      } catch (error) {
        retries++
        if (retries === maxRetries) {
          throw new Error(`Server at ${baseURL} is not responding after ${maxRetries} attempts`)
        }
        console.log(`⏳ Attempt ${retries}/${maxRetries} - Server not ready, retrying...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    // Set up test data if needed
    console.log('📝 Setting up test data...')

    // TODO: Set up test data with real backend when available
    console.log('👥 Test data setup will be implemented with backend integration')

    // Set up test properties
    console.log('🏠 Test properties setup will be implemented with backend integration')
    
    const testProperties = [
      {
        title: 'Test Apartment 1',
        description: 'Beautiful 3BHK apartment for testing',
        price: 5000000,
        area: 1200,
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          address: '123 Test Street'
        },
        propertyType: 'apartment',
        brokerId: 'broker@example.com'
      },
      {
        title: 'Test Villa 1',
        description: 'Spacious villa with garden for testing',
        price: 8000000,
        area: 2000,
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          address: '456 Test Avenue'
        },
        propertyType: 'villa',
        brokerId: 'broker@example.com'
      }
    ]

    console.log('🏠 Test properties would be created:', testProperties.map(p => p.title))

    // Verify critical pages are accessible
    console.log('🔍 Verifying critical pages...')
    
    const criticalPages = ['/', '/auth/login', '/auth/register', '/properties', '/brokers']
    
    for (const pagePath of criticalPages) {
      try {
        const response = await page.goto(`${baseURL}${pagePath}`, { timeout: 10000 })
        if (!response || !response.ok()) {
          console.warn(`⚠️  Warning: ${pagePath} returned status ${response?.status()}`)
        } else {
          console.log(`✅ ${pagePath} is accessible`)
        }
      } catch (error) {
        console.warn(`⚠️  Warning: Failed to access ${pagePath}:`, error)
      }
    }

    // Set up authentication state for different user types
    console.log('🔐 Setting up authentication states...')

    // TODO: Set up authentication states with real backend when available
    console.log('🔐 Authentication states will be implemented with backend integration')

    console.log('✅ Global setup completed successfully!')

  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await context.close()
    await browser.close()
  }
}

export default globalSetup
