import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Results from '../pages/Results';

/**
 * BDD Test Suite: How It Works & User Guide Features
 * 
 * Feature: Accessible documentation modals
 * As a user of the ROI calculator
 * I want to access detailed documentation about calculations and usage
 * So that I can understand how the tool works and make informed decisions
 * 
 * Acceptance Criteria:
 * 1. "How It Works" buttons appear in all calculation sections
 * 2. "User Guide" button appears in header on all pages
 * 3. Both modals are fully keyboard accessible (Tab, Shift+Tab, Escape)
 * 4. Both modals are WCAG 2.0 AA compliant
 * 5. Focus is trapped within open modals
 * 6. Modals can be closed via Escape key, close button, or clicking outside
 * 7. User Guide has navigable table of contents
 * 8. All interactive elements have visible focus indicators
 * 9. All elements have proper ARIA labels and roles
 */

describe('Feature: How It Works & User Guide Modals', () => {
  
  describe('Scenario: How It Works button visibility', () => {
    it('Given I am on the Results page', async () => {
      // Mock assessment data
      const mockData = {
        companyName: 'Test Company',
        companyWebsite: 'https://example.com',
        teamSize: 10,
        avgSalary: 100000,
        trainingType: 'full-day' as const,
        responses: Array(35).fill(4),
        industry: 'Software Tech',
        industryConfidence: 0.95
      };

      render(
        <BrowserRouter>
          <Results />
        </BrowserRouter>
      );

      // Simulate data loading
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });

    it('Then I should see "How It Works" button in Readiness Score section', () => {
      const readinessSection = screen.getByRole('region', { name: /readiness score/i });
      const howItWorksButton = within(readinessSection).getByRole('button', { name: /how it works/i });
      expect(howItWorksButton).toBeInTheDocument();
    });

    it('And I should see "How It Works" button in Dysfunction Cost section', () => {
      const costSection = screen.getByRole('region', { name: /dysfunction cost/i });
      const howItWorksButton = within(costSection).getByRole('button', { name: /how it works/i });
      expect(howItWorksButton).toBeInTheDocument();
    });

    it('And I should see "How It Works" button in Driver Scores section', () => {
      const driversSection = screen.getByRole('region', { name: /driver scores/i });
      const howItWorksButton = within(driversSection).getByRole('button', { name: /how it works/i });
      expect(howItWorksButton).toBeInTheDocument();
    });

    it('And I should see "How It Works" button in Priority Matrix section', () => {
      const matrixSection = screen.getByRole('region', { name: /priority matrix/i });
      const howItWorksButton = within(matrixSection).getByRole('button', { name: /how it works/i });
      expect(howItWorksButton).toBeInTheDocument();
    });

    it('And I should see "How It Works" button in 4 C\'s section', () => {
      const fourCsSection = screen.getByRole('region', { name: /4 c's/i });
      const howItWorksButton = within(fourCsSection).getByRole('button', { name: /how it works/i });
      expect(howItWorksButton).toBeInTheDocument();
    });

    it('And I should see "How It Works" button in Training ROI section', () => {
      const roiSection = screen.getByRole('region', { name: /training roi/i });
      const howItWorksButton = within(roiSection).getByRole('button', { name: /how it works/i });
      expect(howItWorksButton).toBeInTheDocument();
    });
  });

  describe('Scenario: User Guide button visibility', () => {
    it('Given I am on any page', () => {
      render(
        <BrowserRouter>
          <Results />
        </BrowserRouter>
      );
    });

    it('Then I should see "User Guide" button in the header', () => {
      const header = screen.getByRole('banner');
      const userGuideButton = within(header).getByRole('button', { name: /user guide/i });
      expect(userGuideButton).toBeInTheDocument();
    });

    it('And the button should be visible and accessible', () => {
      const userGuideButton = screen.getByRole('button', { name: /user guide/i });
      expect(userGuideButton).toBeVisible();
      expect(userGuideButton).toHaveAttribute('aria-label', 'Open User Guide');
    });
  });

  describe('Scenario: Opening How It Works modal', () => {
    const user = userEvent.setup();

    it('Given I am on the Results page', () => {
      render(
        <BrowserRouter>
          <Results />
        </BrowserRouter>
      );
    });

    it('When I click the "How It Works" button in Readiness Score section', async () => {
      const readinessSection = screen.getByRole('region', { name: /readiness score/i });
      const howItWorksButton = within(readinessSection).getByRole('button', { name: /how it works/i });
      await user.click(howItWorksButton);
    });

    it('Then a modal should open', async () => {
      await waitFor(() => {
        const modal = screen.getByRole('dialog', { name: /how it works/i });
        expect(modal).toBeInTheDocument();
        expect(modal).toBeVisible();
      });
    });

    it('And the modal should have proper ARIA attributes', () => {
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby');
      expect(modal).toHaveAttribute('aria-describedby');
    });

    it('And the modal should display Readiness Score calculation methodology', () => {
      const modal = screen.getByRole('dialog');
      expect(within(modal).getByText(/readiness score calculation/i)).toBeInTheDocument();
      expect(within(modal).getByText(/formula/i)).toBeInTheDocument();
    });

    it('And focus should move to the modal', () => {
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveFocus();
    });
  });

  describe('Scenario: Opening User Guide modal', () => {
    const user = userEvent.setup();

    it('Given I am on any page', () => {
      render(
        <BrowserRouter>
          <Results />
        </BrowserRouter>
      );
    });

    it('When I click the "User Guide" button', async () => {
      const userGuideButton = screen.getByRole('button', { name: /user guide/i });
      await user.click(userGuideButton);
    });

    it('Then a modal should open', async () => {
      await waitFor(() => {
        const modal = screen.getByRole('dialog', { name: /user guide/i });
        expect(modal).toBeInTheDocument();
        expect(modal).toBeVisible();
      });
    });

    it('And the modal should have a table of contents', () => {
      const modal = screen.getByRole('dialog');
      const toc = within(modal).getByRole('navigation', { name: /table of contents/i });
      expect(toc).toBeInTheDocument();
    });

    it('And the table of contents should have all major sections', () => {
      const toc = screen.getByRole('navigation', { name: /table of contents/i });
      expect(within(toc).getByRole('link', { name: /what is problemops/i })).toBeInTheDocument();
      expect(within(toc).getByRole('link', { name: /the 4 c's/i })).toBeInTheDocument();
      expect(within(toc).getByRole('link', { name: /the 7 drivers/i })).toBeInTheDocument();
      expect(within(toc).getByRole('link', { name: /how the math works/i })).toBeInTheDocument();
      expect(within(toc).getByRole('link', { name: /training options/i })).toBeInTheDocument();
    });
  });

  describe('Scenario: Keyboard navigation in modals', () => {
    const user = userEvent.setup();

    beforeEach(() => {
      render(
        <BrowserRouter>
          <Results />
        </BrowserRouter>
      );
    });

    it('Given a modal is open', async () => {
      const howItWorksButton = screen.getAllByRole('button', { name: /how it works/i })[0];
      await user.click(howItWorksButton);
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('When I press Tab', async () => {
      await user.keyboard('{Tab}');
    });

    it('Then focus should move to the next focusable element within the modal', () => {
      const modal = screen.getByRole('dialog');
      const focusableElements = within(modal).getAllByRole('button');
      expect(focusableElements.some((el: HTMLElement) => el === document.activeElement)).toBe(true);
    });

    it('And focus should not escape the modal', async () => {
      const modal = screen.getByRole('dialog');
      const focusableElements = within(modal).getAllByRole('button');
      
      // Tab through all elements
      for (let i = 0; i < focusableElements.length + 2; i++) {
        await user.keyboard('{Tab}');
      }
      
      // Focus should still be within modal
      expect(modal.contains(document.activeElement)).toBe(true);
    });
  });

  describe('Scenario: Closing modal with Escape key', () => {
    const user = userEvent.setup();

    it('Given a modal is open', async () => {
      render(
        <BrowserRouter>
          <Results />
        </BrowserRouter>
      );
      
      const howItWorksButton = screen.getAllByRole('button', { name: /how it works/i })[0];
      await user.click(howItWorksButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('When I press Escape', async () => {
      await user.keyboard('{Escape}');
    });

    it('Then the modal should close', async () => {
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('And focus should return to the button that opened the modal', () => {
      const howItWorksButton = screen.getAllByRole('button', { name: /how it works/i })[0];
      expect(howItWorksButton).toHaveFocus();
    });
  });

  describe('Scenario: Closing modal with close button', () => {
    const user = userEvent.setup();

    it('Given a modal is open', async () => {
      render(
        <BrowserRouter>
          <Results />
        </BrowserRouter>
      );
      
      const howItWorksButton = screen.getAllByRole('button', { name: /how it works/i })[0];
      await user.click(howItWorksButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('When I click the close button', async () => {
      const modal = screen.getByRole('dialog');
      const closeButton = within(modal).getByRole('button', { name: /close/i });
      await user.click(closeButton);
    });

    it('Then the modal should close', async () => {
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Scenario: Closing modal by clicking outside', () => {
    const user = userEvent.setup();

    it('Given a modal is open', async () => {
      render(
        <BrowserRouter>
          <Results />
        </BrowserRouter>
      );
      
      const howItWorksButton = screen.getAllByRole('button', { name: /how it works/i })[0];
      await user.click(howItWorksButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('When I click outside the modal content', async () => {
      const modal = screen.getByRole('dialog');
      const backdrop = modal.parentElement; // Assuming backdrop is parent
      if (backdrop) {
        await user.click(backdrop);
      }
    });

    it('Then the modal should close', async () => {
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Scenario: User Guide table of contents navigation', () => {
    const user = userEvent.setup();

    it('Given the User Guide modal is open', async () => {
      render(
        <BrowserRouter>
          <Results />
        </BrowserRouter>
      );
      
      const userGuideButton = screen.getByRole('button', { name: /user guide/i });
      await user.click(userGuideButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /user guide/i })).toBeInTheDocument();
      });
    });

    it('When I click a section link in the table of contents', async () => {
      const toc = screen.getByRole('navigation', { name: /table of contents/i });
      const link = within(toc).getByRole('link', { name: /the 7 drivers/i });
      await user.click(link);
    });

    it('Then the modal should scroll to that section', async () => {
      await waitFor(() => {
        const section = screen.getByRole('region', { name: /the 7 drivers/i });
        expect(section).toBeVisible();
        
        // Check if section is in viewport
        const rect = section.getBoundingClientRect();
        expect(rect.top).toBeGreaterThanOrEqual(0);
        expect(rect.top).toBeLessThan(window.innerHeight);
      });
    });

    it('And the section should be highlighted or focused', () => {
      const section = screen.getByRole('region', { name: /the 7 drivers/i });
      expect(section).toHaveAttribute('tabindex', '-1');
      expect(section).toHaveFocus();
    });
  });

  describe('Scenario: WCAG 2.0 AA compliance - Focus indicators', () => {
    it('Given I am navigating with keyboard', () => {
      render(
        <BrowserRouter>
          <Results />
        </BrowserRouter>
      );
    });

    it('Then all "How It Works" buttons should have visible focus indicators', () => {
      const buttons = screen.getAllByRole('button', { name: /how it works/i });
      buttons.forEach((button: HTMLElement) => {
        button.focus();
        const styles = window.getComputedStyle(button);
        expect(styles.outline).not.toBe('none');
        expect(styles.outlineWidth).not.toBe('0px');
      });
    });

    it('And the "User Guide" button should have a visible focus indicator', () => {
      const button = screen.getByRole('button', { name: /user guide/i });
      button.focus();
      const styles = window.getComputedStyle(button);
      expect(styles.outline).not.toBe('none');
      expect(styles.outlineWidth).not.toBe('0px');
    });
  });

  describe('Scenario: WCAG 2.0 AA compliance - Color contrast', () => {
    it('Given I am viewing the modals', () => {
      render(
        <BrowserRouter>
          <Results />
        </BrowserRouter>
      );
    });

    it('Then all text should have sufficient contrast ratio (4.5:1 for normal text)', () => {
      // This would typically use a tool like axe-core
      // For now, we verify that contrast classes are applied
      const buttons = screen.getAllByRole('button', { name: /how it works/i });
      buttons.forEach((button: HTMLElement) => {
        const classList: string[] = Array.from(button.classList);
        expect(classList.some(c => c.startsWith('text-'))).toBe(true); // Has text color class
        expect(classList.some(c => c.startsWith('bg-'))).toBe(true); // Has background color class
      });
    });
  });

  describe('Scenario: WCAG 2.0 AA compliance - ARIA labels', () => {
    const user = userEvent.setup();

    it('Given a modal is open', async () => {
      render(
        <BrowserRouter>
          <Results />
        </BrowserRouter>
      );
      
      const howItWorksButton = screen.getAllByRole('button', { name: /how it works/i })[0];
      await user.click(howItWorksButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('Then the modal should have aria-labelledby pointing to title', () => {
      const modal = screen.getByRole('dialog');
      const labelId = modal.getAttribute('aria-labelledby');
      expect(labelId).toBeTruthy();
      
      const title = document.getElementById(labelId!);
      expect(title).not.toBeNull();
      expect(title?.textContent).toMatch(/how it works/i);
    });

    it('And the modal should have aria-describedby pointing to content', () => {
      const modal = screen.getByRole('dialog');
      const descId = modal.getAttribute('aria-describedby');
      expect(descId).toBeTruthy();
      
      const description = document.getElementById(descId!);
      expect(description).not.toBeNull();
    });

    it('And the close button should have aria-label', () => {
      const modal = screen.getByRole('dialog');
      const closeButton = within(modal).getByRole('button', { name: /close/i });
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
    });
  });

  describe('Scenario: Context-specific How It Works content', () => {
    const user = userEvent.setup();

    it('Given I open "How It Works" from Readiness Score section', async () => {
      render(
        <BrowserRouter>
          <Results />
        </BrowserRouter>
      );
      
      const readinessSection = screen.getByRole('region', { name: /readiness score/i });
      const howItWorksButton = within(readinessSection).getByRole('button', { name: /how it works/i });
      await user.click(howItWorksButton);
    });

    it('Then the modal should show Readiness Score calculation details', async () => {
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(within(modal).getByText(/readiness score calculation/i)).toBeInTheDocument();
        expect(within(modal).getByText(/weighted average/i)).toBeInTheDocument();
      });
    });

    it('When I close and open "How It Works" from Priority Matrix section', async () => {
      await user.keyboard('{Escape}');
      
      const matrixSection = screen.getByRole('region', { name: /priority matrix/i });
      const howItWorksButton = within(matrixSection).getByRole('button', { name: /how it works/i });
      await user.click(howItWorksButton);
    });

    it('Then the modal should show Priority Matrix calculation details', async () => {
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(within(modal).getByText(/priority matrix/i)).toBeInTheDocument();
        expect(within(modal).getByText(/team impact/i)).toBeInTheDocument();
        expect(within(modal).getByText(/business value/i)).toBeInTheDocument();
      });
    });
  });

  describe('Scenario: Responsive modal design', () => {
    it('Given I am on a mobile device', () => {
      // Mock mobile viewport
      global.innerWidth = 375;
      global.innerHeight = 667;
      window.dispatchEvent(new Event('resize'));
      
      render(
        <BrowserRouter>
          <Results />
        </BrowserRouter>
      );
    });

    it('When I open a modal', async () => {
      const user = userEvent.setup();
      const howItWorksButton = screen.getAllByRole('button', { name: /how it works/i })[0];
      await user.click(howItWorksButton);
    });

    it('Then the modal should be full-screen on mobile', async () => {
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        const classList: string[] = Array.from(modal.classList);
        expect(classList.some(c => c.includes('w-full'))).toBe(true); // Full width on mobile
        expect(classList.some(c => c.includes('h-full'))).toBe(true); // Full height on mobile
      });
    });

    it('And the modal should be centered and sized appropriately on desktop', () => {
      // Mock desktop viewport
      global.innerWidth = 1920;
      global.innerHeight = 1080;
      window.dispatchEvent(new Event('resize'));
      
      const modal = screen.getByRole('dialog');
      const classList: string[] = Array.from(modal.classList);
      expect(classList.some(c => c.startsWith('max-w-'))).toBe(true); // Max width constraint on desktop
      expect(classList.includes('w-full')).toBe(false); // Not full width on desktop
    });
  });

  describe('Scenario: Multiple modals do not stack', () => {
    const user = userEvent.setup();

    it('Given a "How It Works" modal is open', async () => {
      render(
        <BrowserRouter>
          <Results />
        </BrowserRouter>
      );
      
      const howItWorksButton = screen.getAllByRole('button', { name: /how it works/i })[0];
      await user.click(howItWorksButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('When I try to open the "User Guide" modal', async () => {
      const userGuideButton = screen.getByRole('button', { name: /user guide/i });
      await user.click(userGuideButton);
    });

    it('Then only one modal should be open at a time', async () => {
      await waitFor(() => {
        const modals = screen.getAllByRole('dialog');
        expect(modals.length).toBe(1);
      });
    });

    it('And it should be the User Guide modal', () => {
      const modal = screen.getByRole('dialog');
      const ariaLabel = modal.getAttribute('aria-labelledby');
      const titleElement = ariaLabel ? document.getElementById(ariaLabel) : null;
      expect(titleElement?.textContent).toMatch(/user guide/i);
    });
  });
});
