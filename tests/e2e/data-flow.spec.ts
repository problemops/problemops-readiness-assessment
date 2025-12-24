import { test, expect } from '@playwright/test';

test.describe('P0: Data Flow Scenarios', () => {
  /**
   * BDD Scenario 16.1: Assessment data persists to database
   * Priority: P0
   */
  test('Assessment creation: should save data to database and generate results URL', async ({ page }) => {
    await page.goto('/');
    
    // Fill company info
    await page.fill('#company-name', 'Data Flow Test Company');
    await page.fill('#team-size', '15');
    await page.fill('#avg-salary', '120000');
    
    // Select training type
    await page.click('#half-day');
    
    // Start assessment
    await page.click('button:has-text("Start Assessment")');
    
    // Answer all questions with rating 4
    for (let i = 1; i <= 35; i++) {
      await page.locator(`#q${i}-4`).click({ force: true });
    }
    
    // Submit
    await page.click('button:has-text("See Results")');
    
    // Wait for results page
    await page.waitForURL(/\/results\/[a-f0-9-]+/);
    
    // Verify URL contains assessment ID
    const url = page.url();
    const assessmentIdMatch = url.match(/\/results\/([a-f0-9-]+)/);
    expect(assessmentIdMatch).toBeTruthy();
    expect(assessmentIdMatch![1].length).toBeGreaterThan(20); // UUID length
    
    // Verify company name is displayed
    await expect(page.locator('text=/Data Flow Test Company/i')).toBeVisible();
    
    // Verify results are rendered
    await expect(page.locator('text=/readiness/i')).toBeVisible();
    await expect(page.locator('text=/ROI/i')).toBeVisible();
  });

  /**
   * BDD Scenario 16.2: Results page loads from database using assessment ID
   * Priority: P0
   */
  test('Results retrieval: should load saved assessment from database', async ({ page }) => {
    // First, create an assessment
    await page.goto('/');
    await page.fill('#company-name', 'Retrieval Test Company');
    await page.fill('#team-size', '20');
    await page.fill('#avg-salary', '150000');
    await page.click('#full-day');
    await page.click('button:has-text("Start Assessment")');
    
    for (let i = 1; i <= 35; i++) {
      await page.locator(`#q${i}-5`).click({ force: true });
    }
    
    await page.click('button:has-text("See Results")');
    await page.waitForURL(/\/results\//);
    
    // Save the results URL
    const resultsUrl = page.url();
    
    // Navigate away
    await page.goto('/');
    
    // Navigate back to results using saved URL
    await page.goto(resultsUrl);
    
    // Verify results loaded correctly
    await expect(page.locator('text=/Retrieval Test Company/i')).toBeVisible();
    await expect(page.locator('text=/Full Day Workshop/i')).toBeVisible();
    await expect(page.locator('text=/\\$3,500/')).toBeVisible();
  });

  /**
   * BDD Scenario 16.3: Assessment answers calculate correct driver scores
   * Priority: P0
   */
  test('Score calculation: should correctly calculate driver scores from answers', async ({ page }) => {
    await page.goto('/');
    
    // Fill company info
    await page.fill('#company-name', 'Score Calculation Test');
    await page.fill('#team-size', '10');
    await page.fill('#avg-salary', '100000');
    await page.click('#half-day');
    await page.click('button:has-text("Start Assessment")');
    
    // Answer all questions with rating 7 (perfect score)
    for (let i = 1; i <= 35; i++) {
      await page.locator(`#q${i}-7`).click({ force: true });
    }
    
    await page.click('button:has-text("See Results")');
    await page.waitForURL(/\/results\//);
    
    // With all 7s, readiness should be 100%
    const readinessText = await page.locator('text=/readiness.*%/i').first().textContent();
    const readinessMatch = readinessText?.match(/(\d+)%/);
    expect(readinessMatch).toBeTruthy();
    
    const readinessPercent = parseInt(readinessMatch![1]);
    expect(readinessPercent).toBeGreaterThanOrEqual(95); // Allow small rounding tolerance
    expect(readinessPercent).toBeLessThanOrEqual(100);
    
    // Verify all drivers show high scores (no critical concerns)
    const criticalBadges = await page.locator('text=/Critical Concern/i').count();
    expect(criticalBadges).toBe(0);
  });
});
