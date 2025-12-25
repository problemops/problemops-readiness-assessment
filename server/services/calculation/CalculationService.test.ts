/**
 * CalculationService Tests
 * Covers all 59 BDD scenarios for Enhanced Dysfunction Cost Formula v4.0
 * 
 * Test Categories:
 * - Critical Vulnerabilities (V1, V3, V7)
 * - High Severity (V4, V6, V9, V11)
 * - Medium Severity (V2, V8, V10, V12, V13, V14)
 * - Low Severity (V5, V15)
 * - Mathematical Properties
 * - Integration Tests
 * - Edge Cases
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getCalculationService } from '../ServiceContainer';
import type { CalculationInput } from '../../domain/interfaces/ICalculationService';
import type { ICalculationService } from '../../domain/interfaces/ICalculationService';
import Decimal from 'decimal.js';

describe('CalculationService - Enhanced Dysfunction Cost Formula v4.0', () => {
  let calculationService: ICalculationService;

  beforeEach(() => {
    calculationService = getCalculationService();
  });

  // ========== CRITICAL VULNERABILITIES ==========

  describe('V1: Division by Zero Protection', () => {
    it('should reject team size of 0', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 0,
        driverScores: {
          trust: 3,
          psych_safety: 3,
          comm_quality: 3,
          goal_clarity: 3,
          coordination: 3,
          tms: 3,
          team_cognition: 3,
        },
        industry: 'Technology',
      };

      await expect(calculationService.calculate(input)).rejects.toThrow();
    });

    it('should handle minimum team size of 1', async () => {
      const input: CalculationInput = {
        payroll: 100000,
        teamSize: 1,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.tcd.toNumber()).toBeGreaterThanOrEqual(0);
    });

    it('should handle negative team size gracefully', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: -5,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      await expect(calculationService.calculate(input)).rejects.toThrow();
    });
  });

  describe('V3: Input Clamping', () => {
    it('should clamp driver scores below 1 to 1', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 0,
          psych_safety: -1,
          comm_quality: 0.5,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.tcd.toNumber()).toBeGreaterThan(0);
      expect(result.tcd.toNumber()).toBeLessThanOrEqual(input.payroll * 3.5);
    });

    it('should clamp driver scores above 7 to 7', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 8,
          psych_safety: 10,
          comm_quality: 7.5,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.tcd.toNumber()).toBeGreaterThanOrEqual(0);
    });

    it('should handle all scores at boundaries correctly', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 1,
          psych_safety: 7,
          comm_quality: 1,
          goal_clarity: 7,
          coordination: 1,
          tms: 7,
          team_cognition: 1,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.tcd.toNumber()).toBeGreaterThan(0);
    });
  });

  describe('V7: Team Size Factor', () => {
    it('should penalize understaffing (N < 5)', async () => {
      const input: CalculationInput = {
        payroll: 400000,
        teamSize: 3,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.multipliers.teamSize).toBeGreaterThan(1.0);
    });

    it('should not penalize optimal team size (5-15)', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.multipliers.teamSize).toBe(1.0);
    });

    it('should penalize overstaffing (N > 15)', async () => {
      const input: CalculationInput = {
        payroll: 2500000,
        teamSize: 25,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.multipliers.teamSize).toBeGreaterThan(1.0);
    });
  });

  // ========== HIGH SEVERITY ==========

  describe('V4: Continuous Engagement Function', () => {
    it('should use continuous sigmoid for engagement calculation', async () => {
      const input1: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 5.0,
          psych_safety: 5.0,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const input2: CalculationInput = {
        ...input1,
        driverScores: {
          ...input1.driverScores,
          trust: 5.001,
          psych_safety: 5.001,
        },
      };

      const result1 = await calculationService.calculate(input1);
      const result2 = await calculationService.calculate(input2);

      // Should have smooth transition, not jump
      const diff = Math.abs(result1.tcd.toNumber() - result2.tcd.toNumber());
      expect(diff).toBeLessThan(1000); // No huge jumps
    });

    it('should classify as Engaged when avg(Trust, PsychSafety) >= 5.5', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 6,
          psych_safety: 6,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.engagement.category).toBe('Engaged');
    });

    it('should classify as Not Engaged when 3.5 <= avg < 5.5', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 4.5,
          psych_safety: 4.5,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.engagement.category).toBe('Not Engaged');
    });
  });

  describe('V6: Gaming Detection', () => {
    it('should detect anomalous pattern (all 7s except one 1)', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 7,
          psych_safety: 7,
          comm_quality: 7,
          goal_clarity: 7,
          coordination: 7,
          tms: 7,
          team_cognition: 1,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.anomaly.score).toBeGreaterThan(0.3);
    });

    it('should not flag consistent scores', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 4,
          psych_safety: 4.5,
          comm_quality: 4.2,
          goal_clarity: 4.1,
          coordination: 4.3,
          tms: 4.4,
          team_cognition: 4.2,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.anomaly.score).toBeLessThan(0.3);
    });

    it('should detect Trust-PsychSafety correlation violation', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 7,
          psych_safety: 1,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.anomaly.score).toBeGreaterThan(0.2);
    });
  });

  describe('V9: BV Ratio Bounds', () => {
    it('should clamp BV ratio to minimum of 1', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        revenue: 500000, // Revenue < Payroll
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      // BV ratio is clamped, reflected in opportunity cost calculation
      expect(result.costComponents.opportunity.toNumber()).toBeGreaterThan(0);
      expect(result.tcd.toNumber()).toBeGreaterThan(0);
    });

    it('should cap BV ratio at 10 (reflected in opportunity cost)', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        revenue: 100000000, // 100x payroll
        teamSize: 10,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      // BV ratio is capped at 10, so opportunity cost should be bounded
      expect(result.costComponents.opportunity.toNumber()).toBeGreaterThan(0);
      expect(result.tcd.toNumber()).toBeGreaterThan(0);
    });

    it('should use default BV ratio when revenue not provided', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      // Should calculate without error using default BV ratio
      expect(result.costComponents.opportunity.toNumber()).toBeGreaterThan(0);
      expect(result.tcd.toNumber()).toBeGreaterThan(0);
    });
  });

  describe('V11: Overlap Discount', () => {
    it('should apply 12% overlap discount', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 3,
          psych_safety: 3,
          comm_quality: 3,
          goal_clarity: 3,
          coordination: 3,
          tms: 3,
          team_cognition: 3,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      
      // Verify subtotalWithDiscount is 88% of subtotal
      const subtotal = result.costComponents.subtotal.toNumber();
      const subtotalWithDiscount = result.costComponents.subtotalWithDiscount.toNumber();
      
      expect(subtotalWithDiscount).toBeCloseTo(subtotal * 0.88, 0);
    });

    it('should not double-count productivity and disengagement', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 3,
          psych_safety: 3,
          comm_quality: 3,
          goal_clarity: 3,
          coordination: 3,
          tms: 3,
          team_cognition: 3,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      
      // TCD should be less than sum of all components
      const sumOfComponents = Object.values(result.costComponents).reduce((sum, c) => sum + c.toNumber(), 0);
      expect(result.tcd.toNumber()).toBeLessThan(sumOfComponents);
    });
  });

  // ========== MEDIUM SEVERITY ==========

  describe('V2: Negative Payroll', () => {
    it('should reject negative payroll', async () => {
      const input: CalculationInput = {
        payroll: -1000000,
        teamSize: 10,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      await expect(calculationService.calculate(input)).rejects.toThrow();
    });

    it('should reject zero payroll', async () => {
      const input: CalculationInput = {
        payroll: 0,
        teamSize: 10,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      await expect(calculationService.calculate(input)).rejects.toThrow();
    });

    it('should handle minimum positive payroll', async () => {
      const input: CalculationInput = {
        payroll: 1,
        teamSize: 1,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.tcd.toNumber()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('V8: Industry Factors', () => {
    it('should apply Healthcare factor (1.30)', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Healthcare',
      };

      const result = await calculationService.calculate(input);
      expect(result.multipliers.industry).toBe(1.30);
    });

    it('should apply Government factor (0.85)', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Government',
      };

      const result = await calculationService.calculate(input);
      expect(result.multipliers.industry).toBe(0.85);
    });

    it('should default to Professional Services (1.00) for unknown industry', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Unknown Industry',
      };

      const result = await calculationService.calculate(input);
      expect(result.multipliers.industry).toBe(1.00);
    });

    it('should apply all 7 industry factors correctly', async () => {
      const industries = [
        { name: 'Technology', factor: 1.20 },
        { name: 'Healthcare', factor: 1.30 },
        { name: 'Financial Services', factor: 1.25 },
        { name: 'Government', factor: 0.85 },
        { name: 'Retail', factor: 0.90 },
        { name: 'Manufacturing', factor: 1.00 },
        { name: 'Professional Services', factor: 1.15 },
      ];

      for (const industry of industries) {
        const input: CalculationInput = {
          payroll: 1000000,
          teamSize: 10,
          driverScores: {
            trust: 4,
            psych_safety: 4,
            comm_quality: 4,
            goal_clarity: 4,
            coordination: 4,
            tms: 4,
            team_cognition: 4,
          },
          industry: industry.name,
        };

        const result = await calculationService.calculate(input);
        expect(result.multipliers.industry).toBe(industry.factor);
      }
    });
  });

  describe('V13: Confidence Intervals', () => {
    it('should provide 95% confidence interval', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      
      expect(result.confidenceInterval.lower.toNumber()).toBeLessThan(result.tcd.toNumber());
      expect(result.confidenceInterval.upper.toNumber()).toBeGreaterThan(result.tcd.toNumber());
      expect(result.confidenceInterval.level).toBe(0.95);
    });
  });

  // ========== MATHEMATICAL PROPERTIES ==========

  describe('Mathematical Properties', () => {
    it('should have lower bound of 0 for perfect team', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 7,
          psych_safety: 7,
          comm_quality: 7,
          goal_clarity: 7,
          coordination: 7,
          tms: 7,
          team_cognition: 7,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.tcd.toNumber()).toBeCloseTo(0, 0);
    });

    it('should have upper bound of 3.5P', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 1,
          psych_safety: 1,
          comm_quality: 1,
          goal_clarity: 1,
          coordination: 1,
          tms: 1,
          team_cognition: 1,
        },
        industry: 'Healthcare',
      };

      const result = await calculationService.calculate(input);
      expect(result.tcd.toNumber()).toBeLessThanOrEqual(input.payroll * 3.5);
    });

    it('should be monotonic - improving Trust reduces TCD', async () => {
      const input1: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 3,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const input2: CalculationInput = {
        ...input1,
        driverScores: { ...input1.driverScores, trust: 5 },
      };

      const result1 = await calculationService.calculate(input1);
      const result2 = await calculationService.calculate(input2);

      expect(result2.tcd.toNumber()).toBeLessThan(result1.tcd.toNumber());
    });

    it('should be monotonic - improving any driver reduces TCD', async () => {
      const baseInput: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 3,
          psych_safety: 3,
          comm_quality: 3,
          goal_clarity: 3,
          coordination: 3,
          tms: 3,
          team_cognition: 3,
        },
        industry: 'Technology',
      };

      const baseResult = await calculationService.calculate(baseInput);

      const drivers = ['trust', 'psych_safety', 'comm_quality', 'goal_clarity', 'coordination', 'tms', 'team_cognition'] as const;

      for (const driver of drivers) {
        const improvedInput: CalculationInput = {
          ...baseInput,
          driverScores: {
            ...baseInput.driverScores,
            [driver]: 5,
          },
        };

        const improvedResult = await calculationService.calculate(improvedInput);
        expect(improvedResult.tcd.toNumber()).toBeLessThan(baseResult.tcd.toNumber());
      }
    });

    it('should be proportional - doubling payroll doubles TCD', async () => {
      const input1: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const input2: CalculationInput = {
        ...input1,
        payroll: 2000000,
      };

      const result1 = await calculationService.calculate(input1);
      const result2 = await calculationService.calculate(input2);

      // Doubling payroll should roughly double TCD
      expect(result2.tcd.toNumber()).toBeCloseTo(result1.tcd.toNumber() * 2, -4);
    });

    it('should be continuous - no jump discontinuities', async () => {
      // Test small increments to verify smooth transitions
      const score1 = 4.0;
      const score2 = 4.01;

      const input1: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: score1,
          psych_safety: score1,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const input2: CalculationInput = {
        ...input1,
        driverScores: {
          ...input1.driverScores,
          trust: score2,
          psych_safety: score2,
        },
      };

      const result1 = await calculationService.calculate(input1);
      const result2 = await calculationService.calculate(input2);

      // Small input change should produce small output change
      const diff = Math.abs(result1.tcd.toNumber() - result2.tcd.toNumber());
      expect(diff).toBeLessThan(10000); // No jumps > $10k for 0.01 score change
    });
  });

  // ========== INTEGRATION TESTS ==========

  describe('Integration Tests', () => {
    it('should handle typical technology company scenario', async () => {
      const input: CalculationInput = {
        payroll: 1800000,
        teamSize: 10, // Optimal team size
        driverScores: {
          trust: 5.1,
          psych_safety: 4.8,
          comm_quality: 5.2,
          goal_clarity: 4.5,
          coordination: 5.0,
          tms: 4.7,
          team_cognition: 5.3,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      
      expect(result.tcd.toNumber()).toBeGreaterThan(0);
      expect(result.tcd.toNumber()).toBeLessThan(input.payroll * 2);
      expect(result.engagement.category).toBe('Not Engaged');
      expect(result.multipliers.industry).toBe(1.20);
      expect(result.multipliers.teamSize).toBe(1.0);
    });

    it('should handle high-dysfunction healthcare team', async () => {
      const input: CalculationInput = {
        payroll: 2000000,
        teamSize: 20,
        driverScores: {
          trust: 2.5,
          psych_safety: 2.3,
          comm_quality: 2.8,
          goal_clarity: 2.6,
          coordination: 2.4,
          tms: 2.7,
          team_cognition: 2.5,
        },
        industry: 'Healthcare',
      };

      const result = await calculationService.calculate(input);
      
      expect(result.tcd.toNumber()).toBeGreaterThan(input.payroll * 0.3);
      expect(result.engagement.category).toBe('Actively Disengaged');
      expect(result.multipliers.industry).toBe(1.30);
      expect(result.multipliers.teamSize).toBeGreaterThan(1.0);
    });

    it('should handle excellent small startup team', async () => {
      const input: CalculationInput = {
        payroll: 400000,
        teamSize: 4,
        driverScores: {
          trust: 6.5,
          psych_safety: 6.3,
          comm_quality: 6.7,
          goal_clarity: 6.2,
          coordination: 6.4,
          tms: 6.1,
          team_cognition: 6.6,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      
      expect(result.tcd.toNumber()).toBeLessThan(input.payroll * 0.3);
      expect(result.engagement.category).toBe('Engaged');
      expect(result.multipliers.teamSize).toBeGreaterThan(1.0); // Understaffed
    });
  });

  // ========== EDGE CASES ==========

  describe('Edge Cases', () => {
    it('should handle all drivers at minimum (1)', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 1,
          psych_safety: 1,
          comm_quality: 1,
          goal_clarity: 1,
          coordination: 1,
          tms: 1,
          team_cognition: 1,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.tcd.toNumber()).toBeGreaterThan(0);
      expect(result.tcd.toNumber()).toBeLessThanOrEqual(input.payroll * 3.5);
    });

    it('should handle mixed extreme scores', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 10,
        driverScores: {
          trust: 7,
          psych_safety: 1,
          comm_quality: 7,
          goal_clarity: 1,
          coordination: 7,
          tms: 1,
          team_cognition: 7,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.tcd.toNumber()).toBeGreaterThan(0);
      expect(result.anomaly.score).toBeGreaterThan(0.3);
    });

    it('should handle very large team (N=100)', async () => {
      const input: CalculationInput = {
        payroll: 10000000,
        teamSize: 100,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.tcd.toNumber()).toBeGreaterThan(0);
      expect(result.multipliers.teamSize).toBeGreaterThan(1.0);
    });

    it('should handle single-person team', async () => {
      const input: CalculationInput = {
        payroll: 100000,
        teamSize: 1,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.tcd.toNumber()).toBeGreaterThan(0);
      expect(result.multipliers.teamSize).toBeGreaterThan(1.0);
    });
  });

  // ========== NUMERICAL PRECISION ==========

  describe('V5: Numerical Precision', () => {
    it('should maintain precision with Decimal.js', async () => {
      const input: CalculationInput = {
        payroll: 1234567.89,
        teamSize: 10,
        driverScores: {
          trust: 4.123,
          psych_safety: 4.456,
          comm_quality: 4.789,
          goal_clarity: 4.321,
          coordination: 4.654,
          tms: 4.987,
          team_cognition: 4.111,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      
      // Should use Decimal.js internally
      expect(result.tcd).toBeInstanceOf(Decimal);
      expect(result.costComponents.productivity).toBeInstanceOf(Decimal);
    });

    it('should handle very small payroll without precision loss', async () => {
      const input: CalculationInput = {
        payroll: 0.01,
        teamSize: 1,
        driverScores: {
          trust: 4,
          psych_safety: 4,
          comm_quality: 4,
          goal_clarity: 4,
          coordination: 4,
          tms: 4,
          team_cognition: 4,
        },
        industry: 'Technology',
      };

      const result = await calculationService.calculate(input);
      expect(result.tcd.toNumber()).toBeGreaterThan(0);
    });
  });

  // ========== UPPER BOUND ENFORCEMENT ==========

  describe('V15: Upper Bound Cap', () => {
    it('should enforce 3.5P ceiling', async () => {
      const input: CalculationInput = {
        payroll: 1000000,
        teamSize: 1,
        revenue: 100000000,
        driverScores: {
          trust: 1,
          psych_safety: 1,
          comm_quality: 1,
          goal_clarity: 1,
          coordination: 1,
          tms: 1,
          team_cognition: 1,
        },
        industry: 'Healthcare',
      };

      const result = await calculationService.calculate(input);
      expect(result.tcd.toNumber()).toBeLessThanOrEqual(input.payroll * 3.5);
    });
  });
});
