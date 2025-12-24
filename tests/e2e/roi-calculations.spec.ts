import { test, expect } from '@playwright/test';
import {
  TEST_COMPANY,
  TEST_ANSWERS,
  TRAINING_TYPES,
  EXPECTED_ROI_RANGES,
} from '../helpers/test-data';

/**
 * Helper function to fill assessment form and answer all questions
 */
async function completeAssessment(
  page: any,
  trainingType: string,
  answers: number[]
) {
  // Fill company info
  await page.fill('#company-name', TEST_COMPANY.name);
  await page.fill('#team-size', TEST_COMPANY.teamSize.toString());
  await page.fill('#avg-salary', TEST_COMPANY.avgSalary.toString());
  
  // Select training type
  await page.click(`#${trainingType}`);
  
  // Start assessment
  await page.click('button:has-text("Start Assessment")');
  
  // Wait for questions to load
  await page.waitForSelector('[id^="q1-"]');
  
  // Answer all 35 questions (5 questions × 7 sections)
  for (let i = 1; i <= 35; i++) {
    const answer = answers[i - 1];
    // Use force click to bypass sticky header interception
    await page.locator(`#q${i}-${answer}`).click({ force: true });
  }
  
  // Submit assessment
  await page.click('button:has-text("See Results")');
  
  // Wait for results page
  await page.waitForURL(/\/results\//);
}

test.describe('P0: ROI Calculation Scenarios', () => {
  /**
   * BDD Scenario 14.1: ROI calculated using gap-based improvement model
   * Priority: P0
   */
  test('should calculate ROI using gap-based improvement model', async ({ page }) => {
    await page.goto('/');
    await completeAssessment(page, TRAINING_TYPES.HALF_DAY, TEST_ANSWERS.mixed);
    
    // Verify ROI is calculated and displayed
    const roiElement = page.locator('text=/ROI.*%/').first();
    await expect(roiElement).toBeVisible();
    
    const roiText = await roiElement.textContent();
    const roiMatch = roiText?.match(/([\d,]+)%/);
    expect(roiMatch).toBeTruthy();
    
    const roiPercent = parseInt(roiMatch![1].replace(/,/g, ''));
    expect(roiPercent).toBeGreaterThanOrEqual(EXPECTED_ROI_RANGES.MIN_ROI_PERCENT);
    expect(roiPercent).toBeLessThanOrEqual(EXPECTED_ROI_RANGES.MAX_ROI_PERCENT);
    
    // Verify payback period exists
    await expect(page.locator('text=/payback/i').first()).toBeVisible();
  });

  /**
   * BDD Scenario 14.2: Half Day ROI uses only top 1 driver cost
   * Priority: P0
   */
  test('Half Day: should calculate ROI using only top 1 priority driver', async ({ page }) => {
    await page.goto('/');
    await completeAssessment(page, TRAINING_TYPES.HALF_DAY, TEST_ANSWERS.mixed);
    
    // Verify Half Day training is shown
    await expect(page.locator('text=/Half Day Workshop/i').first()).toBeVisible();
    
    // Verify cost is $2,000
    await expect(page.locator('text=/\\$2,000/').first()).toBeVisible();
    
    // Verify focus mentions top 1 or #1
    const focusText = await page.locator('text=/focus/i').first().textContent();
    expect(focusText?.toLowerCase()).toMatch(/(top 1|#1|highest priority|1 critical)/);
  });

  /**
   * BDD Scenario 14.3: Full Day ROI uses only top 2 drivers cost
   * Priority: P0
   */
  test('Full Day: should calculate ROI using only top 2 priority drivers', async ({ page }) => {
    await page.goto('/');
    await completeAssessment(page, TRAINING_TYPES.FULL_DAY, TEST_ANSWERS.mixed);
    
    // Verify Full Day training is shown
    await expect(page.locator('text=/Full Day Workshop/i').first()).toBeVisible();
    
    // Verify cost is $3,500
    await expect(page.locator('text=/\\$3,500/').first()).toBeVisible();
    
    // Verify focus mentions top 2
    const focusText = await page.locator('text=/focus/i').first().textContent();
    expect(focusText?.toLowerCase()).toMatch(/(top 2|2 critical|2 highest)/);
  });

  /**
   * BDD Scenario 14.4: Month-Long ROI uses all 7 drivers cost
   * Priority: P0
   */
  test('Month-Long: should calculate ROI using all 7 drivers', async ({ page }) => {
    await page.goto('/');
    await completeAssessment(page, TRAINING_TYPES.MONTH_LONG, TEST_ANSWERS.mixed);
    
    // Verify Month-Long training is shown
    await expect(page.locator('text=/Month-Long Engagement/i').first()).toBeVisible();
    
    // Verify cost is $30,000
    await expect(page.locator('text=/\\$30,000/').first()).toBeVisible();
    
    // Verify focus mentions all 7 or comprehensive
    const focusText = await page.locator('text=/focus/i').first().textContent();
    expect(focusText?.toLowerCase()).toMatch(/(all 7|comprehensive|all drivers|all areas)/);
  });

  /**
   * BDD Scenario 13.1: Readiness score calculation formula
   * Priority: P0
   */
  test('should calculate readiness score correctly from answers', async ({ page }) => {
    await page.goto('/');
    await completeAssessment(page, TRAINING_TYPES.HALF_DAY, TEST_ANSWERS.uniform);
    
    // Calculate expected readiness (all 3s = 3/7 = ~43%)
    const expectedPercent = Math.round((3 / 7) * 100);
    
    // Verify readiness score is displayed
    const readinessElement = page.locator('text=/readiness.*%/i').first();
    await expect(readinessElement).toBeVisible();
    
    const readinessText = await readinessElement.textContent();
    const readinessMatch = readinessText?.match(/(\d+)%/);
    expect(readinessMatch).toBeTruthy();
    
    const actualPercent = parseInt(readinessMatch![1]);
    
    // Allow ±2% tolerance for rounding
    expect(Math.abs(actualPercent - expectedPercent)).toBeLessThanOrEqual(2);
  });
});
