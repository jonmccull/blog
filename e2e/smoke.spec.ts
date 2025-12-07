import { test, expect } from '@playwright/test'

const pages = ['/', '/blog', '/cv']

test.describe('Smoke tests', () => {
  for (const path of pages) {
    test(`${path} loads without errors`, async ({ page }) => {
      const errors: string[] = []

      // Capture console errors
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })

      // Capture uncaught exceptions
      page.on('pageerror', (err) => {
        errors.push(err.message)
      })

      await page.goto(path)

      // Wait for hydration to complete
      await page.waitForLoadState('networkidle')

      // Check no errors occurred (filter out non-critical issues)
      const criticalErrors = errors.filter(
        (e) =>
          !e.includes('favicon') && // Ignore favicon 404s
          !e.includes('Download the React DevTools') && // Ignore dev tools message
          !e.includes('Failed to load resource') // Ignore missing assets (e.g., analytics)
      )

      expect(criticalErrors).toEqual([])
    })

    test(`${path} is interactive (no hydration issues)`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      // Check that nav links are clickable
      const navLinks = page.locator('nav a')
      const count = await navLinks.count()
      expect(count).toBeGreaterThan(0)

      // Verify links have proper href and are not broken by hydration
      for (let i = 0; i < count; i++) {
        const link = navLinks.nth(i)
        await expect(link).toBeVisible()
        await expect(link).toBeEnabled()
      }
    })
  }

  test('theme toggle works without errors', async ({ page }) => {
    const errors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    page.on('pageerror', (err) => {
      errors.push(err.message)
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Find and click theme toggle
    const themeToggle = page.locator('button[aria-label="Toggle Dark Mode"]')
    await expect(themeToggle).toBeVisible()
    await themeToggle.click()

    // Wait a moment for any potential infinite loops to manifest
    await page.waitForTimeout(500)

    // Check no errors after toggle
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('Download the React DevTools') &&
        !e.includes('Failed to load resource')
    )

    expect(criticalErrors).toEqual([])
  })
})
