import { test, expect } from '@playwright/test'

const pages = ['/', '/blog', '/projects', '/cv', '/photos']

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

test.describe('Home field', () => {
  test('draws the field and the portrait canvas on desktop, keeping the portrait alt text', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await expect(page.locator('.home-field > canvas')).toHaveCount(1, { timeout: 10000 })
    await expect(page.locator('.home-portrait')).toHaveClass(/is-canvas/, { timeout: 10000 })
    await expect(page.getByRole('img', { name: /dither portrait/ })).toHaveCount(1)
  })

  test('leaves phones text only, without fetching the portrait', async ({ page }) => {
    const portraitRequests: string[] = []
    page.on('request', (request) => {
      if (request.url().includes('jon-dither')) portraitRequests.push(request.url())
    })
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.home-field > canvas')).toHaveCount(0)
    await expect(page.locator('.home-portrait')).toBeHidden()
    await expect(page.locator('.home-name')).toBeVisible()
    expect(portraitRequests).toEqual([])
  })
})

test.describe('Photos lightbox', () => {
  test('opens a photo, steps with the keyboard, closes with Escape', async ({ page }) => {
    await page.goto('/photos')
    const dialog = page.locator('dialog.lightbox')
    await expect(dialog).toBeHidden()
    const first = page.locator('.photo-open').first()
    const firstAlt = await first.locator('img').getAttribute('alt')
    await first.click()
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('.lightbox-image')).toHaveAttribute('alt', firstAlt ?? '')
    await page.keyboard.press('ArrowRight')
    await expect(dialog.locator('.lightbox-image')).not.toHaveAttribute('alt', firstAlt ?? '')
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })
  test('fetches only the neighbouring photos early, at the size the lightbox shows', async ({
    page,
  }) => {
    // At 1x the lightbox's file is a different width from the list's, so list loads don't count
    await page.setViewportSize({ width: 1280, height: 800 })
    const requests: { file: string | null; width: string | null }[] = []
    page.on('request', (request) => {
      const url = new URL(request.url())
      if (url.pathname !== '/_next/image') return
      requests.push({ file: url.searchParams.get('url'), width: url.searchParams.get('w') })
    })
    await page.goto('/photos')
    await page.waitForLoadState('networkidle')
    const files = await page
      .locator('.photo-open img')
      .evaluateAll((images) => images.map((image) => (image as HTMLImageElement).src))
      .then((sources) => sources.map((src) => new URL(src).searchParams.get('url')))
    const at = 3
    expect(files.length).toBeGreaterThan(at + 3)
    const settle = async () => {
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(300)
    }

    const dialog = page.locator('dialog.lightbox')
    const shown = dialog.locator('.lightbox-image')
    await page.locator('.photo-open').nth(at).click()
    await expect(dialog).toBeVisible()
    await settle()
    const width = await shown.evaluate((image) =>
      new URL((image as HTMLImageElement).currentSrc).searchParams.get('w')
    )
    const lightboxFiles = () =>
      requests.filter((request) => request.width === width).map((request) => request.file)

    // On open: the open photo and its two neighbours, nothing further along
    expect(lightboxFiles().sort()).toEqual([files[at - 1], files[at], files[at + 1]].sort())
    // The neighbours are out of the accessibility tree and the tab order
    await expect(dialog.locator('[hidden] img')).toHaveCount(2)
    await expect(dialog.locator('[hidden] :is(a, button, [tabindex])')).toHaveCount(0)
    await expect(dialog.getByRole('img')).toHaveCount(1)

    // One step: nothing new for the photo now shown, only the next one along
    const before = lightboxFiles().length
    await page.keyboard.press('ArrowRight')
    await expect(shown).toHaveJSProperty('complete', true)
    await settle()
    expect(lightboxFiles().slice(before)).toEqual([files[at + 2]])

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(page.locator('dialog [hidden] img')).toHaveCount(0)
  })
})
