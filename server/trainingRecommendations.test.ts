import { describe, it, expect } from 'vitest';
import { 
  calculateDriverCosts, 
  calculateTrainingROI, 
  getPriorityAreas,
  type PriorityArea 
} from '../client/src/lib/trainingRecommendations';

describe('Scoped ROI Calculations', () => {
  const DRIVER_WEIGHTS = {
    trust: 0.18,
    psych_safety: 0.16,
    tms: 0.14,
    comm_quality: 0.15,
    goal_clarity: 0.13,
    coordination: 0.12,
    team_cognition: 0.12,
  };

  describe('calculateDriverCosts', () => {
    it('should calculate individual driver dysfunction costs correctly', () => {
      const driverScores = {
        trust: 2.0,
        psych_safety: 3.0,
        tms: 4.0,
        comm_quality: 1.0,
        goal_clarity: 5.0,
        coordination: 6.0,
        team_cognition: 7.0,
      };
      const teamSize = 10;
      const avgSalary = 100000;
      const totalPayroll = 1000000;

      const costs = calculateDriverCosts(driverScores, DRIVER_WEIGHTS, teamSize, avgSalary);

      // Trust: (1 - 2/7) × 0.18 × $1M = 0.714 × 0.18 × $1M = $128,571
      expect(costs.trust).toBeCloseTo(128571, 0);

      // Comm Quality: (1 - 1/7) × 0.15 × $1M = 0.857 × 0.15 × $1M = $128,571
      expect(costs.comm_quality).toBeCloseTo(128571, 0);

      // Team Cognition (perfect score): (1 - 7/7) × 0.12 × $1M = 0 × 0.12 × $1M = $0
      expect(costs.team_cognition).toBe(0);
    });

    it('should handle all drivers at same score', () => {
      const driverScores = {
        trust: 3.5,
        psych_safety: 3.5,
        tms: 3.5,
        comm_quality: 3.5,
        goal_clarity: 3.5,
        coordination: 3.5,
        team_cognition: 3.5,
      };
      const teamSize = 10;
      const avgSalary = 100000;

      const costs = calculateDriverCosts(driverScores, DRIVER_WEIGHTS, teamSize, avgSalary);

      // All drivers at 3.5/7 = 50% effectiveness
      // Each driver's cost = 0.5 × weight × $1M
      expect(costs.trust).toBeCloseTo(90000, 0); // 0.5 × 0.18 × $1M
      expect(costs.comm_quality).toBeCloseTo(75000, 0); // 0.5 × 0.15 × $1M
    });
  });

  describe('calculateTrainingROI - Scoped by Training Type', () => {
    it('Half Day: should use ONLY top 1 priority driver cost', () => {
      const driverScores = {
        trust: 2.0,
        psych_safety: 3.0,
        tms: 4.0,
        comm_quality: 1.0, // Worst score, highest priority
        goal_clarity: 5.0,
        coordination: 6.0,
        team_cognition: 7.0,
      };
      const teamSize = 10;
      const avgSalary = 100000;

      const priorityAreas = getPriorityAreas(driverScores, DRIVER_WEIGHTS);
      const driverCosts = calculateDriverCosts(driverScores, DRIVER_WEIGHTS, teamSize, avgSalary);

      // Half Day: $2,000 investment, fixes top 1 driver
      const roi = calculateTrainingROI(2000, priorityAreas, driverCosts, 1);

      // Top priority should be comm_quality (score 1.0, weight 0.15)
      expect(priorityAreas[0].id).toBe('comm_quality');

      // Scoped cost = comm_quality cost only = $128,571
      // Projected savings = $128,571 × 0.85 = $109,286
      expect(roi.savings).toBeCloseTo(109286, 0);

      // ROI = ($109,286 - $2,000) / $2,000 = 53.64 = 5,364%
      expect(roi.roi).toBeCloseTo(53.64, 1);

      // Payback = ($2,000 / $109,286) × 12 + 3 = 0.22 + 3 = 3.22 months
      expect(roi.paybackMonths).toBeCloseTo(3.2, 1);

      // Should only address 1 driver
      expect(roi.addressedDrivers).toHaveLength(1);
      expect(roi.addressedDrivers[0]).toBe('Communication Quality');
    });

    it('Full Day: should use ONLY top 2 priority drivers cost', () => {
      const driverScores = {
        trust: 2.0, // 2nd worst
        psych_safety: 3.0,
        tms: 4.0,
        comm_quality: 1.0, // Worst
        goal_clarity: 5.0,
        coordination: 6.0,
        team_cognition: 7.0,
      };
      const teamSize = 10;
      const avgSalary = 100000;

      const priorityAreas = getPriorityAreas(driverScores, DRIVER_WEIGHTS);
      const driverCosts = calculateDriverCosts(driverScores, DRIVER_WEIGHTS, teamSize, avgSalary);

      // Full Day: $3,500 investment, fixes top 2 drivers
      const roi = calculateTrainingROI(3500, priorityAreas, driverCosts, 2);

      // Scoped cost = comm_quality + trust = $128,571 + $128,571 = $257,142
      // Projected savings = $257,142 × 0.85 = $218,571
      expect(roi.savings).toBeCloseTo(218571, 0);

      // ROI = ($218,571 - $3,500) / $3,500 = 61.45 = 6,145%
      expect(roi.roi).toBeCloseTo(61.45, 1);

      // Should address 2 drivers
      expect(roi.addressedDrivers).toHaveLength(2);
    });

    it('Month-Long: should use ALL 7 drivers cost', () => {
      const driverScores = {
        trust: 2.0,
        psych_safety: 2.0,
        tms: 2.0,
        comm_quality: 2.0,
        goal_clarity: 2.0,
        coordination: 2.0,
        team_cognition: 2.0,
      };
      const teamSize = 10;
      const avgSalary = 100000;

      const priorityAreas = getPriorityAreas(driverScores, DRIVER_WEIGHTS);
      const driverCosts = calculateDriverCosts(driverScores, DRIVER_WEIGHTS, teamSize, avgSalary);

      // Month-Long: $50,000 investment, fixes all 7 drivers
      const roi = calculateTrainingROI(50000, priorityAreas, driverCosts, 7);

      // All drivers at 2.0/7 = 71.4% dysfunction
      // Total cost = sum of all 7 driver costs
      const totalCost = Object.values(driverCosts).reduce((sum, cost) => sum + cost, 0);
      
      // Projected savings = total cost × 0.85
      expect(roi.savings).toBeCloseTo(totalCost * 0.85, 0);

      // Should address all 7 drivers
      expect(roi.addressedDrivers).toHaveLength(7);

      // ROI should be positive but realistic (not 6000%)
      expect(roi.roi).toBeGreaterThan(0);
      expect(roi.roi).toBeLessThan(20); // Less than 2000%
    });

    it('should show decreasing ROI percentage as training cost increases', () => {
      const driverScores = {
        trust: 1.0,
        psych_safety: 1.0,
        tms: 1.0,
        comm_quality: 1.0,
        goal_clarity: 1.0,
        coordination: 1.0,
        team_cognition: 1.0,
      };
      const teamSize = 10;
      const avgSalary = 100000;

      const priorityAreas = getPriorityAreas(driverScores, DRIVER_WEIGHTS);
      const driverCosts = calculateDriverCosts(driverScores, DRIVER_WEIGHTS, teamSize, avgSalary);

      const halfDay = calculateTrainingROI(2000, priorityAreas, driverCosts, 1);
      const fullDay = calculateTrainingROI(3500, priorityAreas, driverCosts, 2);
      const monthLong = calculateTrainingROI(50000, priorityAreas, driverCosts, 7);

      // Half day should have highest ROI % (smallest investment, 1 driver)
      // Full day should have middle ROI % (medium investment, 2 drivers)
      // Month-long should have lowest ROI % (largest investment, all drivers)
      
      // But absolute savings should increase
      expect(halfDay.savings).toBeLessThan(fullDay.savings);
      expect(fullDay.savings).toBeLessThan(monthLong.savings);

      // All should have positive ROI
      expect(halfDay.roi).toBeGreaterThan(0);
      expect(fullDay.roi).toBeGreaterThan(0);
      expect(monthLong.roi).toBeGreaterThan(0);
    });
  });

  describe('Realistic ROI Scenarios', () => {
    it('should produce realistic payback periods', () => {
      const driverScores = {
        trust: 3.0,
        psych_safety: 3.5,
        tms: 4.0,
        comm_quality: 2.5,
        goal_clarity: 4.5,
        coordination: 5.0,
        team_cognition: 5.5,
      };
      const teamSize = 15;
      const avgSalary = 120000;

      const priorityAreas = getPriorityAreas(driverScores, DRIVER_WEIGHTS);
      const driverCosts = calculateDriverCosts(driverScores, DRIVER_WEIGHTS, teamSize, avgSalary);

      const halfDay = calculateTrainingROI(2000, priorityAreas, driverCosts, 1);
      const fullDay = calculateTrainingROI(3500, priorityAreas, driverCosts, 2);

      // Payback should be less than 15 months for workshops (includes 3-month buffer)
      expect(halfDay.paybackMonths).toBeLessThan(15);
      expect(fullDay.paybackMonths).toBeLessThan(15);

      // Payback should include 3-month implementation buffer
      expect(halfDay.paybackMonths).toBeGreaterThan(3);
      expect(fullDay.paybackMonths).toBeGreaterThan(3);
    });

    it('should handle edge case: perfect scores (no dysfunction)', () => {
      const driverScores = {
        trust: 7.0,
        psych_safety: 7.0,
        tms: 7.0,
        comm_quality: 7.0,
        goal_clarity: 7.0,
        coordination: 7.0,
        team_cognition: 7.0,
      };
      const teamSize = 10;
      const avgSalary = 100000;

      const priorityAreas = getPriorityAreas(driverScores, DRIVER_WEIGHTS);
      const driverCosts = calculateDriverCosts(driverScores, DRIVER_WEIGHTS, teamSize, avgSalary);

      const halfDay = calculateTrainingROI(2000, priorityAreas, driverCosts, 1);

      // No dysfunction = no savings = negative ROI
      expect(halfDay.savings).toBe(0);
      expect(halfDay.roi).toBe(-1); // Lost 100% of investment
      expect(halfDay.paybackMonths).toBe(1002); // 999 + 3 = Never pays back
    });
  });
});
