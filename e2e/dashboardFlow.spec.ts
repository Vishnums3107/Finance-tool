import { test, expect } from '@playwright/test'

test.describe('Finance Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to local dev server (configured in playwright.config.ts)
    await page.goto('/')
  })

  test('Viewer cannot add transactions, Admin can add transactions', async ({ page }) => {
    // 1. Initial State should be "Viewer"
    await expect(page.getByText('Read-Only Access')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add Transaction' })).not.toBeVisible()

    // 2. Switch to Admin mode
    await page.getByRole('combobox', { name: 'Select user role' }).selectOption('admin')

    // 3. Verify Admin form is visible
    await expect(page.getByText('Read-Only Access')).not.toBeVisible()
    const formContext = page.locator('form.transaction-form')
    await expect(formContext.getByRole('button', { name: 'Add Transaction' })).toBeVisible()

    // 4. Submit a new Transaction
    // Fill text input
    await formContext.getByPlaceholder('Example: Grocery run').fill('Playwright Test Setup')
    await formContext.locator('input[type="number"]').fill('1337')

    // Since we know the native select behavior, force the custom category
    await formContext.locator('select').nth(0).selectOption('__custom__')
    await formContext.getByPlaceholder('Enter custom category').fill('E2E Audit')
    
    // Select Type "expense"
    await formContext.locator('select').nth(1).selectOption('expense')

    // Click Submit
    await formContext.getByRole('button', { name: 'Add Transaction' }).click()

    // 5. Verify it appeared in the table (search for "Playwright Test Setup")
    const searchInput = page.getByPlaceholder('Search description or category')
    await searchInput.fill('Playwright Test')

    // Wait for the UI / Debounce to catch up
    await page.waitForTimeout(1000)

    // Verify the table row displays the new data
    const testRow = page.locator('tbody').locator('tr').filter({ hasText: 'Playwright Test Setup' })
    await expect(testRow).toBeVisible()
    await expect(testRow).toContainText('E2E Audit')
  })
})
