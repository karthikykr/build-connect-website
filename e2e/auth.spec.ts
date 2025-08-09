import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies()
    await page.goto('/')
  })

  test('should display login page correctly', async ({ page }) => {
    await page.goto('/auth/login')
    
    await expect(page).toHaveTitle(/Login/)
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/auth/login')
    
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login')
    
    await page.getByLabel(/email/i).fill('invalid@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/auth/login')
    
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText(/welcome/i)).toBeVisible()
  })

  test('should display registration page correctly', async ({ page }) => {
    await page.goto('/auth/register')
    
    await expect(page).toHaveTitle(/Register/)
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
    await expect(page.getByLabel(/full name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByLabel(/confirm password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
  })

  test('should register new user successfully', async ({ page }) => {
    await page.goto('/auth/register')
    
    await page.getByLabel(/full name/i).fill('John Doe')
    await page.getByLabel(/email/i).fill('john.doe@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('password123')
    await page.getByRole('combobox', { name: /role/i }).selectOption('buyer')
    await page.getByRole('button', { name: /create account/i }).click()
    
    // Should redirect to dashboard after successful registration
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText(/welcome/i)).toBeVisible()
  })

  test('should show password mismatch error', async ({ page }) => {
    await page.goto('/auth/register')
    
    await page.getByLabel(/full name/i).fill('John Doe')
    await page.getByLabel(/email/i).fill('john.doe@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('differentpassword')
    await page.getByRole('button', { name: /create account/i }).click()
    
    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page).toHaveURL('/dashboard')
    
    // Then logout
    await page.getByRole('button', { name: /profile/i }).click()
    await page.getByRole('menuitem', { name: /logout/i }).click()
    
    // Should redirect to login page
    await expect(page).toHaveURL('/auth/login')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })

  test('should redirect to login when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Should redirect to login page
    await expect(page).toHaveURL('/auth/login')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })

  test('should remember user after page refresh', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page).toHaveURL('/dashboard')
    
    // Refresh the page
    await page.reload()
    
    // Should still be logged in
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText(/welcome/i)).toBeVisible()
  })

  test('should handle social login buttons', async ({ page }) => {
    await page.goto('/auth/login')
    
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /continue with facebook/i })).toBeVisible()
    
    // Click Google login button
    await page.getByRole('button', { name: /continue with google/i }).click()
    
    // Should redirect to Google OAuth (we'll mock this in actual tests)
    // For now, just check that the button is clickable
  })

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/auth/login')
    
    const passwordInput = page.getByLabel(/password/i)
    const toggleButton = page.getByRole('button', { name: /toggle password visibility/i })
    
    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Click toggle to show password
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Click toggle to hide password again
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('should navigate between login and register pages', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Click link to register page
    await page.getByRole('link', { name: /create account/i }).click()
    await expect(page).toHaveURL('/auth/register')
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
    
    // Click link back to login page
    await page.getByRole('link', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/auth/login')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })

  test('should handle forgot password flow', async ({ page }) => {
    await page.goto('/auth/login')
    
    await page.getByRole('link', { name: /forgot password/i }).click()
    await expect(page).toHaveURL('/auth/forgot-password')
    
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByRole('button', { name: /send reset link/i }).click()
    
    await expect(page.getByText(/reset link sent/i)).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.goto('/auth/login')
    
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/invalid email format/i)).toBeVisible()
  })

  test('should validate password strength on registration', async ({ page }) => {
    await page.goto('/auth/register')
    
    await page.getByLabel(/password/i).fill('weak')
    
    await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible()
  })

  test('should show loading state during authentication', async ({ page }) => {
    await page.goto('/auth/login')
    
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    
    // Click login and immediately check for loading state
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should show loading spinner or disabled button
    await expect(page.getByRole('button', { name: /signing in/i })).toBeVisible()
  })
})
