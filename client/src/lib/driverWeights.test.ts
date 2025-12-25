/**
 * Unit Tests for Driver Weights and Cost Calculations
 * Based on BDD scenarios from features/driver-cost-calculations.feature
 */

import { describe, it, expect } from 'vitest';
import {
  DRIVER_WEIGHTS,
  validateWeights,
  calculateDriverCostFromTCD,
  calculateAllDriverCostsFromTCD,
  calculateValueIfFixed,
  getDriverWeightPercent,
} from './driverWeights';

describe('Driver Weights', () => {
  describe('Weight Definitions', () => {
    it('should have all 7 drivers defined', () => {
      const expectedDrivers = [
        'trust',
        'psych_safety',
        'comm_quality',
        'goal_clarity',
        'coordination',
        'tms',
        'team_cognition',
      ];
      
      expectedDrivers.forEach(driver => {
        expect(DRIVER_WEIGHTS[driver]).toBeDefined();
        expect(DRIVER_WEIGHTS[driver]).toBeGreaterThan(0);
      });
    });

    it('should have correct weight values', () => {
      expect(DRIVER_WEIGHTS.trust).toBe(0.18);
      expect(DRIVER_WEIGHTS.psych_safety).toBe(0.17);
      expect(DRIVER_WEIGHTS.comm_quality).toBe(0.15);
      expect(DRIVER_WEIGHTS.goal_clarity).toBe(0.14);
      expect(DRIVER_WEIGHTS.coordination).toBe(0.13);
      expect(DRIVER_WEIGHTS.tms).toBe(0.12);
      expect(DRIVER_WEIGHTS.team_cognition).toBe(0.11);
    });

    it('should have weights that sum to 1.0', () => {
      expect(validateWeights()).toBe(true);
      
      const sum = Object.values(DRIVER_WEIGHTS).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 2);
    });
  });

  describe('calculateDriverCostFromTCD', () => {
    it('should calculate driver cost as TCD × weight', () => {
      const tcd = 100000;
      
      // Trust: 100000 × 0.18 = 18000
      expect(calculateDriverCostFromTCD(tcd, 'trust')).toBe(18000);
      
      // Psych Safety: 100000 × 0.17 = 17000
      expect(calculateDriverCostFromTCD(tcd, 'psych_safety')).toBe(17000);
      
      // Communication: 100000 × 0.15 = 15000
      expect(calculateDriverCostFromTCD(tcd, 'comm_quality')).toBe(15000);
    });

    it('should return 0 for unknown driver', () => {
      expect(calculateDriverCostFromTCD(100000, 'unknown_driver')).toBe(0);
    });

    it('should handle zero TCD', () => {
      expect(calculateDriverCostFromTCD(0, 'trust')).toBe(0);
    });

    it('should handle large TCD values', () => {
      const tcd = 10000000; // $10M
      const trustCost = calculateDriverCostFromTCD(tcd, 'trust');
      expect(trustCost).toBe(1800000); // $1.8M
    });
  });

  describe('calculateAllDriverCostsFromTCD', () => {
    it('should calculate costs for all drivers', () => {
      const tcd = 100000;
      const costs = calculateAllDriverCostsFromTCD(tcd);
      
      expect(costs.trust).toBeCloseTo(18000, 2);
      expect(costs.psych_safety).toBeCloseTo(17000, 2);
      expect(costs.comm_quality).toBeCloseTo(15000, 2);
      expect(costs.goal_clarity).toBeCloseTo(14000, 2);
      expect(costs.coordination).toBeCloseTo(13000, 2);
      expect(costs.tms).toBeCloseTo(12000, 2);
      expect(costs.team_cognition).toBeCloseTo(11000, 2);
    });

    it('should have driver costs that sum to TCD', () => {
      const tcd = 514286; // Example from test assessment
      const costs = calculateAllDriverCostsFromTCD(tcd);
      
      const sum = Object.values(costs).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(tcd, 0);
    });

    it('should handle zero TCD', () => {
      const costs = calculateAllDriverCostsFromTCD(0);
      
      Object.values(costs).forEach(cost => {
        expect(cost).toBe(0);
      });
    });
  });

  describe('calculateValueIfFixed', () => {
    it('should calculate value as driver cost × 0.85 by default', () => {
      const driverCost = 18000;
      const value = calculateValueIfFixed(driverCost);
      
      expect(value).toBe(15300); // 18000 × 0.85
    });

    it('should accept custom improvement factor', () => {
      const driverCost = 18000;
      
      // 50% improvement
      expect(calculateValueIfFixed(driverCost, 0.50)).toBe(9000);
      
      // 100% improvement
      expect(calculateValueIfFixed(driverCost, 1.0)).toBe(18000);
    });

    it('should handle zero driver cost', () => {
      expect(calculateValueIfFixed(0)).toBe(0);
    });
  });

  describe('getDriverWeightPercent', () => {
    it('should return weight as percentage string', () => {
      expect(getDriverWeightPercent('trust')).toBe('18%');
      expect(getDriverWeightPercent('psych_safety')).toBe('17%');
      expect(getDriverWeightPercent('team_cognition')).toBe('11%');
    });

    it('should return 0% for unknown driver', () => {
      expect(getDriverWeightPercent('unknown')).toBe('0%');
    });
  });

  describe('Integration: Full Cost Calculation Flow', () => {
    it('should correctly distribute TCD across drivers', () => {
      // Scenario: Technology company, 15 employees, $120k avg salary
      // TCD = $514,286 (from v4.0 formula)
      const tcd = 514286;
      
      const costs = calculateAllDriverCostsFromTCD(tcd);
      
      // Verify each driver's cost
      expect(costs.trust).toBeCloseTo(92571.48, 0); // 18%
      expect(costs.psych_safety).toBeCloseTo(87428.62, 0); // 17%
      expect(costs.comm_quality).toBeCloseTo(77142.9, 0); // 15%
      expect(costs.goal_clarity).toBeCloseTo(72000.04, 0); // 14%
      expect(costs.coordination).toBeCloseTo(66857.18, 0); // 13%
      expect(costs.tms).toBeCloseTo(61714.32, 0); // 12%
      expect(costs.team_cognition).toBeCloseTo(56571.46, 0); // 11%
      
      // Verify sum equals TCD
      const sum = Object.values(costs).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(tcd, 0);
    });

    it('should correctly calculate Value If Fixed for each driver', () => {
      const tcd = 514286;
      const costs = calculateAllDriverCostsFromTCD(tcd);
      
      // Value If Fixed = Driver Cost × 85%
      const trustValue = calculateValueIfFixed(costs.trust);
      expect(trustValue).toBeCloseTo(78685.76, 0); // 92571.48 × 0.85
      
      const psychSafetyValue = calculateValueIfFixed(costs.psych_safety);
      expect(psychSafetyValue).toBeCloseTo(74314.33, 0); // 87428.62 × 0.85
    });

    it('should handle edge case: perfect team (TCD = 0)', () => {
      const costs = calculateAllDriverCostsFromTCD(0);
      
      Object.values(costs).forEach(cost => {
        expect(cost).toBe(0);
      });
      
      const value = calculateValueIfFixed(costs.trust);
      expect(value).toBe(0);
    });
  });
});
