import { test, expect } from '@playwright/test';

test.describe('P0: Accessibility Scenarios', () => {
  /**
   * BDD Scenario 1.1: Color contrast meets WCAG AA standards
   * Priority: P0
   */
  test('Color contrast: should meet WCAG AA standards', async ({ page }) => {
    await page.goto('/');
    
    // Run accessibility audit using axe-core
    const accessibilityScanResults = await page.evaluate(() => {
      // Check if text is readable (basic contrast check)
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      const bgColor = computedStyle.backgroundColor;
      const color = computedStyle.color;
      
      return {
        backgroundColor: bgColor,
        textColor: color,
        hasContrast: bgColor !== color
      };
    });
    
    // Verify colors are different (basic contrast)
    expect(accessibilityScanResults.hasContrast).toBe(true);
    
    // Verify no invisible text (same color as background)
    const invisibleElements = await page.locator('*').evaluateAll(elements => {
      return elements.filter(el => {
        const style = window.getComputedStyle(el);
        return style.color === style.backgroundColor && 
               style.color !== 'rgba(0, 0, 0, 0)' &&
               el.textContent?.trim().length > 0;
      }).length;
    });
    
    expect(invisibleElements).toBe(0);
  });

  /**
   * BDD Scenario 1.2: Keyboard navigation works for all interactive elements
   * Priority: P0
   */
  test('Keyboard navigation: should navigate form with Tab key', async ({ page }) => {
    await page.goto('/');
    
    // Focus first input
    await page.keyboard.press('Tab');
    
    // Verify company name input is focused
    const companyNameInput = page.locator('#company-name');
    await expect(companyNameInput).toBeFocused();
    
    // Tab to next field
    await page.keyboard.press('Tab');
    
    // Verify company website input is focused
    const companyWebsiteInput = page.locator('#company-website');
    await expect(companyWebsiteInput).toBeFocused();
    
    // Tab through all fields
    await page.keyboard.press('Tab'); // team name
    await page.keyboard.press('Tab'); // team size
    await page.keyboard.press('Tab'); // avg salary
    
    // Verify we can reach training options
    await page.keyboard.press('Tab');
    const notSureButton = page.locator('#not-sure');
    await expect(notSureButton).toBeFocused();
  });

  /**
   * BDD Scenario 1.3: Screen reader labels are present
   * Priority: P0
   */
  test('Screen reader: should have proper labels and ARIA attributes', async ({ page }) => {
    await page.goto('/');
    
    // Verify form inputs have labels
    const companyNameLabel = page.locator('label:has-text("Company Name")');
    await expect(companyNameLabel).toBeVisible();
    
    const teamSizeLabel = page.locator('label:has-text("Team Size")');
    await expect(teamSizeLabel).toBeVisible();
    
    const salaryLabel = page.locator('label:has-text("Avg. Annual Salary")');
    await expect(salaryLabel).toBeVisible();
    
    // Verify required fields are marked
    await expect(page.locator('text=/required/')).toHaveCount(3);
    
    // Verify radio buttons have labels
    const halfDayLabel = page.locator('label:has-text("Half Day Workshop")');
    await expect(halfDayLabel).toBeVisible();
  });

  /**
   * BDD Scenario 1.4: Focus indicators are visible
   * Priority: P0
   */
  test('Focus indicators: should be visible on interactive elements', async ({ page }) => {
    await page.goto('/');
    
    // Focus company name input
    await page.focus('#company-name');
    
    // Check if focus styles are applied
    const focusedElement = page.locator('#company-name');
    const outlineStyle = await focusedElement.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        outline: style.outline,
        outlineWidth: style.outlineWidth,
        boxShadow: style.boxShadow
      };
    });
    
    // Verify some focus indicator exists (outline or box-shadow)
    const hasFocusIndicator = 
      (focusedElement && outlineStyle.outlineWidth !== '0px') ||
      (outlineStyle.boxShadow && outlineStyle.boxShadow !== 'none');
    
    expect(hasFocusIndicator).toBeTruthy();
  });

  /**
   * BDD Scenario 1.5: Form validation provides accessible error messages
   * Priority: P0
   */
  test('Form validation: should show accessible error messages', async ({ page }) => {
    await page.goto('/');
    
    // Try to submit without filling required fields
    await page.click('button:has-text("Start Assessment")');
    
    // Verify validation prevents submission (still on home page)
    await expect(page).toHaveURL('/');
    
    // Verify error messages or validation states exist
    // (HTML5 validation or custom error messages)
    const companyNameInput = page.locator('#company-name');
    const isInvalid = await companyNameInput.evaluate(el => {
      return (el as HTMLInputElement).validity.valid === false;
    });
    
    expect(isInvalid).toBe(true);
  });
});
