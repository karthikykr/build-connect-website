import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues on homepage', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should not have accessibility issues on login page', async ({ page }) => {
    await page.goto('/auth/login')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should not have accessibility issues on properties page', async ({ page }) => {
    await page.goto('/properties')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')
    
    // Test tab navigation through main navigation
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toBeVisible()
    
    // Continue tabbing through interactive elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    }
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    
    // Should have at least one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)
    
    // Check heading hierarchy
    let previousLevel = 0
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase())
      const currentLevel = parseInt(tagName.charAt(1))
      
      if (previousLevel > 0) {
        // Heading levels should not skip (e.g., h1 -> h3)
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1)
      }
      
      previousLevel = currentLevel
    }
  })

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/auth/login')
    
    // All form inputs should have associated labels
    const inputs = await page.locator('input[type="text"], input[type="email"], input[type="password"], textarea, select').all()
    
    for (const input of inputs) {
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')
      
      if (id) {
        // Check if there's a label with for attribute
        const label = page.locator(`label[for="${id}"]`)
        const hasLabel = await label.count() > 0
        
        // Input should have either a label, aria-label, or aria-labelledby
        expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy()
      }
    }
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    
    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    )
    
    expect(contrastViolations).toEqual([])
  })

  test('should have proper alt text for images', async ({ page }) => {
    await page.goto('/properties')
    
    const images = await page.locator('img').all()
    
    for (const image of images) {
      const alt = await image.getAttribute('alt')
      const role = await image.getAttribute('role')
      const ariaLabel = await image.getAttribute('aria-label')
      
      // Images should have alt text, unless they're decorative (role="presentation")
      if (role !== 'presentation' && role !== 'none') {
        expect(alt !== null || ariaLabel !== null).toBeTruthy()
        
        // Alt text should not be empty for content images
        if (alt !== null) {
          expect(alt.trim().length).toBeGreaterThan(0)
        }
      }
    }
  })

  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper landmark roles
    await expect(page.locator('nav, [role="navigation"]')).toHaveCount({ min: 1 })
    await expect(page.locator('main, [role="main"]')).toHaveCount(1)
    
    // Check for skip links
    const skipLink = page.locator('a[href="#main"], a[href="#content"]').first()
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeVisible()
    }
  })

  test('should handle focus management in modals', async ({ page }) => {
    await page.goto('/properties')
    
    // Open a modal (if available)
    const modalTrigger = page.getByRole('button', { name: /filter/i }).first()
    if (await modalTrigger.count() > 0) {
      await modalTrigger.click()
      
      // Focus should be trapped within the modal
      const modal = page.locator('[role="dialog"], .modal').first()
      if (await modal.count() > 0) {
        await expect(modal).toBeVisible()
        
        // First focusable element in modal should receive focus
        const firstFocusable = modal.locator('button, input, select, textarea, a[href]').first()
        await expect(firstFocusable).toBeFocused()
        
        // Escape key should close modal
        await page.keyboard.press('Escape')
        await expect(modal).not.toBeVisible()
      }
    }
  })

  test('should provide proper error messages', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Submit form without filling required fields
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Error messages should be associated with form fields
    const errorMessages = await page.locator('[role="alert"], .error-message, .field-error').all()
    
    for (const error of errorMessages) {
      await expect(error).toBeVisible()
      
      // Error should have meaningful text
      const text = await error.textContent()
      expect(text?.trim().length).toBeGreaterThan(0)
    }
  })

  test('should support high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' })
    await page.goto('/')
    
    // Check that content is still visible and accessible
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
    
    // Run accessibility scan in high contrast mode
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should support reduced motion preferences', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    
    // Check that animations are disabled or reduced
    const animatedElements = await page.locator('[class*="animate"], [class*="transition"]').all()
    
    for (const element of animatedElements) {
      const computedStyle = await element.evaluate(el => {
        const style = window.getComputedStyle(el)
        return {
          animationDuration: style.animationDuration,
          transitionDuration: style.transitionDuration
        }
      })
      
      // Animations should be disabled or very short
      if (computedStyle.animationDuration !== 'none') {
        expect(parseFloat(computedStyle.animationDuration)).toBeLessThanOrEqual(0.1)
      }
      if (computedStyle.transitionDuration !== 'none') {
        expect(parseFloat(computedStyle.transitionDuration)).toBeLessThanOrEqual(0.1)
      }
    }
  })

  test('should have proper button and link semantics', async ({ page }) => {
    await page.goto('/')
    
    // Check buttons
    const buttons = await page.locator('button, [role="button"]').all()
    for (const button of buttons) {
      // Buttons should have accessible names
      const accessibleName = await button.evaluate(el => {
        return el.textContent?.trim() || 
               el.getAttribute('aria-label') || 
               el.getAttribute('aria-labelledby') ||
               el.getAttribute('title')
      })
      expect(accessibleName?.length).toBeGreaterThan(0)
    }
    
    // Check links
    const links = await page.locator('a[href]').all()
    for (const link of links) {
      // Links should have accessible names
      const accessibleName = await link.evaluate(el => {
        return el.textContent?.trim() || 
               el.getAttribute('aria-label') || 
               el.getAttribute('aria-labelledby') ||
               el.getAttribute('title')
      })
      expect(accessibleName?.length).toBeGreaterThan(0)
    }
  })

  test('should handle zoom up to 200%', async ({ page }) => {
    await page.goto('/')
    
    // Zoom to 200%
    await page.setViewportSize({ width: 640, height: 480 }) // Simulate 200% zoom on 1280x960
    
    // Content should still be accessible and usable
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
    
    // Interactive elements should still be clickable
    const buttons = page.locator('button').first()
    if (await buttons.count() > 0) {
      await expect(buttons).toBeVisible()
    }
  })

  test('should provide status updates for dynamic content', async ({ page }) => {
    await page.goto('/properties')
    
    // Apply filters to trigger dynamic content update
    await page.getByLabel(/min price/i).fill('1000000')
    await page.getByRole('button', { name: /apply filters/i }).click()
    
    // Should have status region for screen readers
    const statusRegions = await page.locator('[role="status"], [aria-live]').all()
    
    // At least one status region should exist for dynamic updates
    expect(statusRegions.length).toBeGreaterThan(0)
  })

  test('should support voice control and speech recognition', async ({ page }) => {
    await page.goto('/')
    
    // Check that interactive elements have proper names for voice control
    const interactiveElements = await page.locator('button, a, input, select, textarea').all()
    
    for (const element of interactiveElements) {
      const tagName = await element.evaluate(el => el.tagName.toLowerCase())
      const accessibleName = await element.evaluate(el => {
        return el.textContent?.trim() || 
               el.getAttribute('aria-label') || 
               el.getAttribute('aria-labelledby') ||
               el.getAttribute('placeholder') ||
               el.getAttribute('title')
      })
      
      // Interactive elements should have clear, unique names
      expect(accessibleName?.length).toBeGreaterThan(0)
      
      // Names should not be generic
      const genericNames = ['click here', 'read more', 'button', 'link', 'input']
      const isGeneric = genericNames.some(generic => 
        accessibleName?.toLowerCase().includes(generic)
      )
      expect(isGeneric).toBeFalsy()
    }
  })
})
