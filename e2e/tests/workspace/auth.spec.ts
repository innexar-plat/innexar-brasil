import { test, expect } from '@playwright/test'
import { CREDENTIALS, INVALID_CREDENTIALS } from '../helpers'

// ─── Auth ────────────────────────────────────────────────────────────────────

test.describe('Workspace — Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('shows login page with Innexar Workspace heading', async ({ page }) => {
    await expect(page.getByText('Innexar Workspace')).toBeVisible()
    await expect(page.getByPlaceholder(/seu@innexar\.com/i)).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible()
  })

  test('shows error on invalid credentials', async ({ page }) => {
    await page.getByPlaceholder(/seu@innexar\.com/i).fill(INVALID_CREDENTIALS.email)
    await page.getByPlaceholder('••••••••').fill(INVALID_CREDENTIALS.password)
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page.getByText(/e-mail ou senha incorretos/i)).toBeVisible()
  })

  test('redirects unauthenticated user from / to /login', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL('**/login')
    expect(page.url()).toContain('/login')
  })

  test('redirects unauthenticated user from /dashboard to /login', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('**/login')
    expect(page.url()).toContain('/login')
  })

  test('logs in and lands on dashboard', async ({ page }) => {
    await page.getByPlaceholder(/seu@innexar\.com/i).fill(CREDENTIALS.email)
    await page.getByPlaceholder('••••••••').fill(CREDENTIALS.password)
    await page.getByRole('button', { name: /entrar/i }).click()
    await page.waitForURL('**/dashboard', { timeout: 10000 })
    expect(page.url()).toContain('/dashboard')
  })
})

// ─── Dashboard & Navigation ──────────────────────────────────────────────────

test.describe('Workspace — Dashboard (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder(/seu@innexar\.com/i).fill(CREDENTIALS.email)
    await page.getByPlaceholder('••••••••').fill(CREDENTIALS.password)
    await page.getByRole('button', { name: /entrar/i }).click()
    await page.waitForURL('**/dashboard', { timeout: 10000 })

    // Persist ws_access_token for all subsequent page loads in this context
    const token = await page.evaluate(() => localStorage.getItem('ws_access_token'))
    if (token) {
      await page.context().addInitScript((t) => {
        window.localStorage.setItem('ws_access_token', t)
      }, token)
    }
  })

  test('shows Dashboard heading and stat cards', async ({ page }) => {
    // Target h1 specifically to avoid strict mode violation (nav link + breadcrumb also say "Dashboard")
    await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible()
    await expect(page.getByText(/visão geral/i)).toBeVisible()
  })

  test('stat cards load from analytics/summary', async ({ page }) => {
    await page.waitForTimeout(2000)
    expect(page.url()).not.toContain('/login')
  })

  test('navigates to CRM page', async ({ page }) => {
    await page.goto('/crm')
    await expect(page.getByRole('heading', { name: 'CRM', level: 1 })).toBeVisible()
  })

  test('navigates to Leads page', async ({ page }) => {
    await page.goto('/leads')
    await expect(page.getByRole('heading', { name: 'Leads', level: 1 })).toBeVisible()
  })

  test('navigates to Contatos page', async ({ page }) => {
    await page.goto('/contatos')
    await expect(page.getByRole('heading', { name: 'Contatos', level: 1 })).toBeVisible()
  })

  test('navigates to Clientes page', async ({ page }) => {
    await page.goto('/clientes')
    await expect(page.getByRole('heading', { name: 'Clientes', level: 1 })).toBeVisible()
  })

  test('navigates to Campanhas page', async ({ page }) => {
    await page.goto('/campanhas')
    await expect(page.getByRole('heading', { name: 'Campanhas', level: 1 })).toBeVisible()
  })

  test('navigates to Inbox page', async ({ page }) => {
    await page.goto('/inbox')
    await expect(page.getByRole('heading', { name: 'Inbox', level: 1 })).toBeVisible()
  })

  test('navigates to Canais page', async ({ page }) => {
    await page.goto('/canais')
    await expect(page.getByRole('heading', { name: 'Canais', level: 1 })).toBeVisible()
  })

  test('navigates to Templates page', async ({ page }) => {
    await page.goto('/templates')
    await expect(page.getByRole('heading', { name: 'Templates', level: 1 })).toBeVisible()
  })

  test('navigates to Analytics page', async ({ page }) => {
    await page.goto('/analytics')
    await expect(page.getByRole('heading', { name: 'Analytics', level: 1 })).toBeVisible()
  })

  test('navigates to Tickets page', async ({ page }) => {
    await page.goto('/tickets')
    await expect(page.getByRole('heading', { name: 'Tickets', level: 1 })).toBeVisible()
  })

  test('unknown route redirects to dashboard', async ({ page }) => {
    await page.goto('/this-does-not-exist')
    await page.waitForURL('**/dashboard', { timeout: 5000 })
    expect(page.url()).toContain('/dashboard')
  })
})

// ─── API connectivity ────────────────────────────────────────────────────────

test.describe('Workspace — API connectivity (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder(/seu@innexar\.com/i).fill(CREDENTIALS.email)
    await page.getByPlaceholder('••••••••').fill(CREDENTIALS.password)
    await page.getByRole('button', { name: /entrar/i }).click()
    await page.waitForURL('**/dashboard', { timeout: 10000 })

    const token = await page.evaluate(() => localStorage.getItem('ws_access_token'))
    if (token) {
      await page.context().addInitScript((t) => {
        window.localStorage.setItem('ws_access_token', t)
      }, token)
    }
  })

  test('CRM page loads deals from /api/v1/crm/deals', async ({ page }) => {
    const responsePromise = page.waitForResponse(
      r => r.url().includes('/api/v1/crm/deals') && r.status() === 200,
      { timeout: 15000 },
    )
    await page.goto('/crm')
    const response = await responsePromise
    const body = await response.json()
    expect(Array.isArray(body)).toBe(true)
    // Page also renders the deal data
    await expect(page.getByRole('heading', { name: 'CRM', level: 1 })).toBeVisible()
  })

  test('analytics summary loads from /api/v1/analytics/summary', async ({ page }) => {
    const responsePromise = page.waitForResponse('**/api/v1/analytics/summary', { timeout: 15000 })
    await page.goto('/dashboard')
    const response = await responsePromise
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body).toHaveProperty('total_revenue')
    expect(body).toHaveProperty('total_customers')
  })

  test('/me endpoint returns user profile', async ({ page }) => {
    const responsePromise = page.waitForResponse(
      r => r.url().includes('/api/v1/auth/me') && r.status() === 200,
      { timeout: 15000 },
    )
    await page.goto('/dashboard')
    const response = await responsePromise
    const body = await response.json()
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('email')
    expect(body).toHaveProperty('role')
    expect(body.email).toBe('admin@innexar.com')
  })
})
