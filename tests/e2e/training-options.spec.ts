import { test, expect } from '@playwright/test';

test.describe('P0: Training Options Scenarios', () => {
  /**
   * BDD Scenario 15.1: Half Day Workshop displays correct price and duration
   * Priority: P0
   */
  test('Half Day Workshop: should display $2,000 and 4 hours', async ({ page }) => {
    await page.goto('/');
    
    // Verify Half Day option exists
    const halfDayOption = page.locator('#half-day');
    await expect(halfDayOption).toBeVisible();
    
    // Verify price
    await expect(page.locator('text=/\\$2,000/')).toBeVisible();
    
    // Verify duration
    await expect(page.locator('text=/4 hours of training/')).toBeVisible();
    
    // Verify focus description
    await expect(page.locator('text=/Focus on your #1 critical area/')).toBeVisible();
  });

  /**
   * BDD Scenario 15.2: Full Day Workshop displays correct price and duration
   * Priority: P0
   */
  test('Full Day Workshop: should display $3,500 and 8 hours', async ({ page }) => {
    await page.goto('/');
    
    // Verify Full Day option exists
    const fullDayOption = page.locator('#full-day');
    await expect(fullDayOption).toBeVisible();
    
    // Verify price
    await expect(page.locator('text=/\\$3,500/')).toBeVisible();
    
    // Verify duration
    await expect(page.locator('text=/8 hours of training/')).toBeVisible();
    
    // Verify focus description
    await expect(page.locator('text=/Focus on your top 2 critical areas/')).toBeVisible();
  });

  /**
   * BDD Scenario 15.3: Month-Long Engagement displays correct price and duration
   * Priority: P0
   */
  test('Month-Long Engagement: should display $30,000 and 80 hours', async ({ page }) => {
    await page.goto('/');
    
    // Verify Month-Long option exists
    const monthLongOption = page.locator('#month-long');
    await expect(monthLongOption).toBeVisible();
    
    // Verify price is $30,000 (not $50,000)
    await expect(page.locator('text=/\\$30,000/')).toBeVisible();
    await expect(page.locator('text=/\\$50,000/')).not.toBeVisible();
    
    // Verify duration
    await expect(page.locator('text=/80 hours of training, coaching, and consulting/')).toBeVisible();
    
    // Verify focus description
    await expect(page.locator('text=/Comprehensive training across all areas/')).toBeVisible();
  });

  /**
   * BDD Scenario 15.4: Training selection persists through assessment
   * Priority: P0
   */
  test('Training selection: should persist selected training type', async ({ page }) => {
    await page.goto('/');
    
    // Fill required fields
    await page.fill('#company-name', 'Test Company');
    await page.fill('#team-size', '10');
    await page.fill('#avg-salary', '100000');
    
    // Select Full Day
    await page.click('#full-day');
    
    // Verify Full Day is checked
    const fullDayButton = page.locator('#full-day');
    await expect(fullDayButton).toHaveAttribute('data-state', 'checked');
    
    // Start assessment
    await page.click('button:has-text("Start Assessment")');
    
    // Go back to home
    await page.goBack();
    
    // Verify Full Day is still selected
    await expect(fullDayButton).toHaveAttribute('data-state', 'checked');
  });

  /**
   * BDD Scenario 15.5: Not Sure Yet option shows all training comparisons
   * Priority: P0
   */
  test('Not Sure Yet: should show comparative ROI analysis', async ({ page }) => {
    await page.goto('/');
    
    // Fill required fields
    await page.fill('#company-name', 'Test Company');
    await page.fill('#team-size', '10');
    await page.fill('#avg-salary', '100000');
    
    // Select "Not Sure Yet"
    await page.click('#not-sure');
    
    // Start assessment
    await page.click('button:has-text("Start Assessment")');
    
    // Answer all questions with rating 3
    for (let i = 1; i <= 35; i++) {
      await page.locator(`#q${i}-3`).click({ force: true });
    }
    
    // Submit
    await page.click('button:has-text("See Results")');
    
    // Wait for results
    await page.waitForURL(/\/results\//);
    
    // Verify all three training options are shown
    await expect(page.locator('text=/Half Day Workshop/i')).toBeVisible();
    await expect(page.locator('text=/Full Day Workshop/i')).toBeVisible();
    await expect(page.locator('text=/Month-Long Engagement/i')).toBeVisible();
    
    // Verify comparative pricing
    await expect(page.locator('text=/\\$2,000/')).toBeVisible();
    await expect(page.locator('text=/\\$3,500/')).toBeVisible();
    await expect(page.locator('text=/\\$30,000/')).toBeVisible();
  });
});
