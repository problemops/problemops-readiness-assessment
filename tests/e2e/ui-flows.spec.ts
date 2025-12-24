import { test, expect } from '@playwright/test';

test.describe('P0: UI/UX Flow Scenarios', () => {
  /**
   * BDD Scenario 2.1: Homepage to Results complete user flow
   * Priority: P0
   */
  test('Complete flow: should navigate from homepage to results successfully', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    await expect(page).toHaveURL('/');
    
    // Verify homepage elements
    await expect(page.locator('text=/Team Cross-Functional Efficiency Readiness Assessment/i')).toBeVisible();
    await expect(page.locator('#company-name')).toBeVisible();
    await expect(page.locator('button:has-text("Start Assessment")')).toBeVisible();
    
    // Fill form
    await page.fill('#company-name', 'UI Flow Test');
    await page.fill('#team-size', '10');
    await page.fill('#avg-salary', '100000');
    await page.click('#half-day');
    
    // Start assessment
    await page.click('button:has-text("Start Assessment")');
    
    // Verify assessment page loaded
    await expect(page.locator('text=/0 of 35 questions completed/i')).toBeVisible();
    
    // Answer questions
    for (let i = 1; i <= 35; i++) {
      await page.locator(`#q${i}-4`).click({ force: true });
    }
    
    // Verify progress updated
    await expect(page.locator('text=/35 of 35 questions completed/i')).toBeVisible();
    
    // Submit
    await page.click('button:has-text("See Results")');
    
    // Verify results page
    await page.waitForURL(/\/results\//);
    await expect(page.locator('text=/UI Flow Test/i')).toBeVisible();
    await expect(page.locator('text=/readiness/i')).toBeVisible();
  });

  /**
   * BDD Scenario 2.2: Form validation prevents invalid submissions
   * Priority: P0
   */
  test('Form validation: should prevent submission with missing required fields', async ({ page }) => {
    await page.goto('/');
    
    // Try to submit without filling anything
    await page.click('button:has-text("Start Assessment")');
    
    // Should still be on homepage
    await expect(page).toHaveURL('/');
    
    // Fill only company name
    await page.fill('#company-name', 'Test');
    await page.click('button:has-text("Start Assessment")');
    
    // Should still be on homepage (team size and salary required)
    await expect(page).toHaveURL('/');
    
    // Fill all required fields
    await page.fill('#team-size', '10');
    await page.fill('#avg-salary', '100000');
    await page.click('#half-day');
    await page.click('button:has-text("Start Assessment")');
    
    // Should navigate to assessment
    await expect(page.locator('text=/questions completed/i')).toBeVisible();
  });
});
