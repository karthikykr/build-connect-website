import { test, expect } from '@playwright/test'

test.describe('Property Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as broker before each test
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill('broker@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('should display properties dashboard correctly', async ({ page }) => {
    await page.goto('/properties/dashboard')
    
    await expect(page).toHaveTitle(/Properties Dashboard/)
    await expect(page.getByRole('heading', { name: /properties overview/i })).toBeVisible()
    
    // Check for key metrics
    await expect(page.getByText(/total properties/i)).toBeVisible()
    await expect(page.getByText(/active listings/i)).toBeVisible()
    await expect(page.getByText(/total views/i)).toBeVisible()
    await expect(page.getByText(/inquiries/i)).toBeVisible()
  })

  test('should create new property successfully', async ({ page }) => {
    await page.goto('/properties/add')
    
    await expect(page.getByRole('heading', { name: /add new property/i })).toBeVisible()
    
    // Fill property details
    await page.getByLabel(/property title/i).fill('Beautiful 3BHK Apartment')
    await page.getByLabel(/description/i).fill('Spacious apartment with modern amenities')
    await page.getByLabel(/price/i).fill('5000000')
    await page.getByLabel(/area/i).fill('1200')
    
    // Select property type
    await page.getByRole('combobox', { name: /property type/i }).selectOption('apartment')
    
    // Fill location details
    await page.getByLabel(/address/i).fill('123 Main Street')
    await page.getByLabel(/city/i).fill('Bangalore')
    await page.getByLabel(/state/i).fill('Karnataka')
    await page.getByLabel(/pincode/i).fill('560001')
    
    // Add amenities
    await page.getByLabel(/parking/i).check()
    await page.getByLabel(/gym/i).check()
    await page.getByLabel(/swimming pool/i).check()
    
    // Submit form
    await page.getByRole('button', { name: /add property/i }).click()
    
    // Should redirect to property listing or show success message
    await expect(page.getByText(/property added successfully/i)).toBeVisible()
  })

  test('should validate required fields in property form', async ({ page }) => {
    await page.goto('/properties/add')
    
    // Try to submit empty form
    await page.getByRole('button', { name: /add property/i }).click()
    
    // Should show validation errors
    await expect(page.getByText(/title is required/i)).toBeVisible()
    await expect(page.getByText(/price is required/i)).toBeVisible()
    await expect(page.getByText(/area is required/i)).toBeVisible()
  })

  test('should display property listings correctly', async ({ page }) => {
    await page.goto('/properties/my-listings')
    
    await expect(page.getByRole('heading', { name: /my listings/i })).toBeVisible()
    
    // Should show property cards or empty state
    const propertyCards = page.locator('[data-testid="property-card"]')
    const emptyState = page.getByText(/no properties found/i)
    
    await expect(propertyCards.first().or(emptyState)).toBeVisible()
  })

  test('should filter properties correctly', async ({ page }) => {
    await page.goto('/properties')
    
    // Apply price filter
    await page.getByLabel(/min price/i).fill('1000000')
    await page.getByLabel(/max price/i).fill('5000000')
    
    // Apply location filter
    await page.getByLabel(/city/i).fill('Bangalore')
    
    // Apply property type filter
    await page.getByRole('combobox', { name: /property type/i }).selectOption('apartment')
    
    // Apply filters
    await page.getByRole('button', { name: /apply filters/i }).click()
    
    // Should show filtered results
    await expect(page.getByText(/properties found/i)).toBeVisible()
  })

  test('should search properties by keyword', async ({ page }) => {
    await page.goto('/properties')
    
    await page.getByPlaceholder(/search properties/i).fill('3BHK apartment')
    await page.getByRole('button', { name: /search/i }).click()
    
    // Should show search results
    await expect(page.getByText(/search results/i)).toBeVisible()
  })

  test('should view property details', async ({ page }) => {
    await page.goto('/properties')
    
    // Click on first property card
    const firstProperty = page.locator('[data-testid="property-card"]').first()
    await firstProperty.click()
    
    // Should navigate to property details page
    await expect(page).toHaveURL(/\/properties\/\w+/)
    await expect(page.getByRole('heading')).toBeVisible()
    
    // Should show property details
    await expect(page.getByText(/price/i)).toBeVisible()
    await expect(page.getByText(/area/i)).toBeVisible()
    await expect(page.getByText(/location/i)).toBeVisible()
  })

  test('should edit property successfully', async ({ page }) => {
    await page.goto('/properties/my-listings')
    
    // Click edit button on first property
    const editButton = page.getByRole('button', { name: /edit/i }).first()
    await editButton.click()
    
    // Should navigate to edit form
    await expect(page).toHaveURL(/\/properties\/\w+\/edit/)
    
    // Update property title
    const titleInput = page.getByLabel(/property title/i)
    await titleInput.clear()
    await titleInput.fill('Updated Property Title')
    
    // Save changes
    await page.getByRole('button', { name: /save changes/i }).click()
    
    // Should show success message
    await expect(page.getByText(/property updated successfully/i)).toBeVisible()
  })

  test('should delete property with confirmation', async ({ page }) => {
    await page.goto('/properties/my-listings')
    
    // Click delete button on first property
    const deleteButton = page.getByRole('button', { name: /delete/i }).first()
    await deleteButton.click()
    
    // Should show confirmation dialog
    await expect(page.getByText(/are you sure/i)).toBeVisible()
    
    // Confirm deletion
    await page.getByRole('button', { name: /confirm/i }).click()
    
    // Should show success message
    await expect(page.getByText(/property deleted successfully/i)).toBeVisible()
  })

  test('should upload property images', async ({ page }) => {
    await page.goto('/properties/add')
    
    // Upload image file
    const fileInput = page.getByLabel(/upload images/i)
    await fileInput.setInputFiles('test-files/property-image.jpg')
    
    // Should show uploaded image preview
    await expect(page.getByRole('img', { name: /property image/i })).toBeVisible()
    
    // Should be able to remove image
    await page.getByRole('button', { name: /remove image/i }).click()
    await expect(page.getByRole('img', { name: /property image/i })).not.toBeVisible()
  })

  test('should toggle property status', async ({ page }) => {
    await page.goto('/properties/my-listings')
    
    // Click status toggle on first property
    const statusToggle = page.getByRole('switch', { name: /active/i }).first()
    await statusToggle.click()
    
    // Should update status
    await expect(page.getByText(/status updated/i)).toBeVisible()
  })

  test('should view property analytics', async ({ page }) => {
    await page.goto('/properties/analytics')
    
    await expect(page.getByRole('heading', { name: /property analytics/i })).toBeVisible()
    
    // Should show analytics charts and metrics
    await expect(page.getByText(/views over time/i)).toBeVisible()
    await expect(page.getByText(/inquiries/i)).toBeVisible()
    await expect(page.getByText(/conversion rate/i)).toBeVisible()
  })

  test('should handle property inquiry', async ({ page }) => {
    // Logout and login as buyer
    await page.getByRole('button', { name: /profile/i }).click()
    await page.getByRole('menuitem', { name: /logout/i }).click()
    
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill('buyer@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Go to properties and inquire about one
    await page.goto('/properties')
    const firstProperty = page.locator('[data-testid="property-card"]').first()
    await firstProperty.click()
    
    // Click contact broker button
    await page.getByRole('button', { name: /contact broker/i }).click()
    
    // Fill inquiry form
    await page.getByLabel(/message/i).fill('I am interested in this property. Please contact me.')
    await page.getByRole('button', { name: /send inquiry/i }).click()
    
    // Should show success message
    await expect(page.getByText(/inquiry sent successfully/i)).toBeVisible()
  })

  test('should save property to favorites', async ({ page }) => {
    // Login as buyer
    await page.getByRole('button', { name: /profile/i }).click()
    await page.getByRole('menuitem', { name: /logout/i }).click()
    
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill('buyer@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await page.goto('/properties')
    
    // Click favorite button on first property
    const favoriteButton = page.getByRole('button', { name: /favorite/i }).first()
    await favoriteButton.click()
    
    // Should show success message
    await expect(page.getByText(/added to favorites/i)).toBeVisible()
    
    // Should update button state
    await expect(favoriteButton).toHaveClass(/favorited/)
  })

  test('should handle property comparison', async ({ page }) => {
    await page.goto('/properties')
    
    // Select multiple properties for comparison
    const compareCheckboxes = page.getByRole('checkbox', { name: /compare/i })
    await compareCheckboxes.first().check()
    await compareCheckboxes.nth(1).check()
    
    // Click compare button
    await page.getByRole('button', { name: /compare selected/i }).click()
    
    // Should navigate to comparison page
    await expect(page).toHaveURL(/\/properties\/compare/)
    await expect(page.getByRole('heading', { name: /property comparison/i })).toBeVisible()
  })

  test('should handle property sharing', async ({ page }) => {
    await page.goto('/properties')
    
    const firstProperty = page.locator('[data-testid="property-card"]').first()
    await firstProperty.click()
    
    // Click share button
    await page.getByRole('button', { name: /share/i }).click()
    
    // Should show share options
    await expect(page.getByText(/share this property/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /copy link/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /share on whatsapp/i })).toBeVisible()
  })
})
