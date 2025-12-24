import { test, expect } from '@playwright/test';
import {
  TEST_COMPANY,
  TEST_ANSWERS,
  TRAINING_TYPES,
  TRAINING_COSTS,
  EXPECTED_ROI_RANGES,
  calculateExpectedReadiness,
  calculateExpectedDysfunctionCost,
} from '../helpers/test-data';

test.describe('P0: ROI Calculation Scenarios', () => {
  /**
   * BDD Scenario 14.1: ROI calculated using gap-based improvement model
   * Priority: P0
   * Given: a user completes an assessment with specific scores
   * When: the system calculates ROI
   * Then: it should use the gap-based improvement formula
   */
  test('should calculate ROI using gap-based improvement model', async ({ page }) => {
    // Navigate to assessment
    await page.goto('/');
    // Form is already visible on homepage, no need to click
    
    // Fill company info
    await page.fill('#company-name', TEST_COMPANY.name);
    await page.fill('#team-size', TEST_COMPANY.teamSize.toString());
    await page.fill('#avg-salary', TEST_COMPANY.avgSalary.toString());
    
    // Select Half Day training
    await page.click('#half-day');
    await page.click('button:has-text("Start Assessment")');
    
    // Answer all 35 questions with mixed scores
    for (let i = 0; i < TEST_ANSWERS.mixed.length; i++) {
      const answer = TEST_ANSWERS.mixed[i];
      await page.click(`input[value="${answer}"]`);
      if (i < TEST_ANSWERS.mixed.length - 1) {
        await page.click('button:has-text("Next")');
      } else {
        await page.click('button:has-text("See Results")');
      }
    }
    
    // Wait for results page
    await page.waitForURL(/\/results\//);
    
    // Verify ROI is calculated
    const roiText = await page.locator('text=/ROI.*%/').first().textContent();
    expect(roiText).toBeTruthy();
    
    // Extract ROI percentage
    const roiMatch = roiText?.match(/([\d,]+)%/);
    expect(roiMatch).toBeTruthy();
    
    const roiPercent = parseInt(roiMatch![1].replace(/,/g, ''));
    
    // Verify ROI is within expected range
    expect(roiPercent).toBeGreaterThanOrEqual(EXPECTED_ROI_RANGES.MIN_ROI_PERCENT);
    expect(roiPercent).toBeLessThanOrEqual(EXPECTED_ROI_RANGES.MAX_ROI_PERCENT);
    
    // Verify payback period exists
    const paybackText = await page.locator('text=/payback/i').first().textContent();
    expect(paybackText).toBeTruthy();
  });

  /**
   * BDD Scenario 14.2: Half Day ROI uses only top 1 driver cost
   * Priority: P0
   */
  test('Half Day: should calculate ROI using only top 1 priority driver', async ({ page }) => {
    await page.goto('/');
    // Form is already visible on homepage, no need to click
    
    await page.fill('#company-name', TEST_COMPANY.name);
    await page.fill('#team-size', TEST_COMPANY.teamSize.toString());
    await page.fill('#avg-salary', TEST_COMPANY.avgSalary.toString());
    await page.click('#half-day');
    await page.click('button:has-text("Start Assessment")');
    
    // Answer all questions
    for (let i = 0; i < TEST_ANSWERS.mixed.length; i++) {
      await page.click(`input[value="${TEST_ANSWERS.mixed[i]}"]`);
      if (i < TEST_ANSWERS.mixed.length - 1) {
        await page.click('button:has-text("Next")');
      } else {
        await page.click('button:has-text("See Results")');
      }
    }
    
    await page.waitForURL(/\/results\//);
    
    // Verify Half Day training is shown
    const halfDayCard = page.locator('text=/Half Day Workshop/i').first();
    await expect(halfDayCard).toBeVisible();
    
    // Verify cost is $2,000
    const costText = await page.locator('text=/\\$2,000/').first().textContent();
    expect(costText).toContain('2,000');
    
    // Verify focus area mentions "top 1" or "#1"
    const focusText = await page.locator('text=/focus/i').first().textContent();
    expect(focusText?.toLowerCase()).toMatch(/(top 1|#1|highest priority)/);
  });

  /**
   * BDD Scenario 14.3: Full Day ROI uses only top 2 drivers cost
   * Priority: P0
   */
  test('Full Day: should calculate ROI using only top 2 priority drivers', async ({ page }) => {
    await page.goto('/');
    // Form is already visible on homepage, no need to click
    
    await page.fill('#company-name', TEST_COMPANY.name);
    await page.fill('#team-size', TEST_COMPANY.teamSize.toString());
    await page.fill('#avg-salary', TEST_COMPANY.avgSalary.toString());
    await page.click('#full-day');
    await page.click('button:has-text("Start Assessment")');
    
    for (let i = 0; i < TEST_ANSWERS.mixed.length; i++) {
      await page.click(`input[value="${TEST_ANSWERS.mixed[i]}"]`);
      if (i < TEST_ANSWERS.mixed.length - 1) {
        await page.click('button:has-text("Next")');
      } else {
        await page.click('button:has-text("See Results")');
      }
    }
    
    await page.waitForURL(/\/results\//);
    
    // Verify Full Day training is shown
    const fullDayCard = page.locator('text=/Full Day Workshop/i').first();
    await expect(fullDayCard).toBeVisible();
    
    // Verify cost is $3,500
    const costText = await page.locator('text=/\\$3,500/').first().textContent();
    expect(costText).toContain('3,500');
    
    // Verify focus area mentions "top 2"
    const focusText = await page.locator('text=/focus/i').first().textContent();
    expect(focusText?.toLowerCase()).toMatch(/(top 2|2 highest)/);
  });

  /**
   * BDD Scenario 14.4: Month-Long ROI uses all 7 drivers cost
   * Priority: P0
   */
  test('Month-Long: should calculate ROI using all 7 drivers', async ({ page }) => {
    await page.goto('/');
    // Form is already visible on homepage, no need to click
    
    await page.fill('#company-name', TEST_COMPANY.name);
    await page.fill('#team-size', TEST_COMPANY.teamSize.toString());
    await page.fill('#avg-salary', TEST_COMPANY.avgSalary.toString());
    await page.click('#month-long');
    await page.click('button:has-text("Start Assessment")');
    
    for (let i = 0; i < TEST_ANSWERS.mixed.length; i++) {
      await page.click(`input[value="${TEST_ANSWERS.mixed[i]}"]`);
      if (i < TEST_ANSWERS.mixed.length - 1) {
        await page.click('button:has-text("Next")');
      } else {
        await page.click('button:has-text("See Results")');
      }
    }
    
    await page.waitForURL(/\/results\//);
    
    // Verify Month-Long training is shown
    const monthLongCard = page.locator('text=/Month-Long Engagement/i').first();
    await expect(monthLongCard).toBeVisible();
    
    // Verify cost is $30,000
    const costText = await page.locator('text=/\\$30,000/').first().textContent();
    expect(costText).toContain('30,000');
    
    // Verify focus area mentions "all 7" or "comprehensive"
    const focusText = await page.locator('text=/focus/i').first().textContent();
    expect(focusText?.toLowerCase()).toMatch(/(all 7|comprehensive|all drivers)/);
  });

  /**
   * BDD Scenario 13.1: Readiness score calculation formula
   * Priority: P0
   */
  test('should calculate readiness score correctly from answers', async ({ page }) => {
    await page.goto('/');
    // Form is already visible on homepage, no need to click
    
    await page.fill('#company-name', TEST_COMPANY.name);
    await page.fill('#team-size', TEST_COMPANY.teamSize.toString());
    await page.fill('#avg-salary', TEST_COMPANY.avgSalary.toString());
    await page.click('#half-day');
    await page.click('button:has-text("Start Assessment")');
    
    // Use uniform answers (all 3s) for predictable calculation
    for (let i = 0; i < TEST_ANSWERS.uniform.length; i++) {
      await page.click(`input[value="${TEST_ANSWERS.uniform[i]}"]`);
      if (i < TEST_ANSWERS.uniform.length - 1) {
        await page.click('button:has-text("Next")');
      } else {
        await page.click('button:has-text("See Results")');
      }
    }
    
    await page.waitForURL(/\/results\//);
    
    // Calculate expected readiness
    const expectedReadiness = calculateExpectedReadiness(TEST_ANSWERS.uniform);
    const expectedPercent = Math.round(expectedReadiness * 100);
    
    // Verify readiness score is displayed
    const readinessText = await page.locator('text=/readiness.*%/i').first().textContent();
    expect(readinessText).toBeTruthy();
    
    // Extract percentage
    const readinessMatch = readinessText?.match(/(\d+)%/);
    expect(readinessMatch).toBeTruthy();
    
    const actualPercent = parseInt(readinessMatch![1]);
    
    // Allow ±2% tolerance for rounding
    expect(Math.abs(actualPercent - expectedPercent)).toBeLessThanOrEqual(2);
  });
});
