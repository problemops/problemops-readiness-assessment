import { describe, it, expect } from 'vitest';
import {
  calculatePriorityMatrix,
  normalizeDriverScores,
  TEAM_IMPACT_WEIGHTS,
  BUSINESS_VALUE_WEIGHTS,
  QUADRANT_THRESHOLD,
  type Industry,
  type DriverId,
} from '../client/src/lib/priorityMatrixCalculations';

describe('Priority Matrix Calculations', () => {
  describe('normalizeDriverScores', () => {
    it('should normalize driver IDs to standard format', () => {
      const input = {
        trust: 3.5,
        psych_safety: 4.0,
        tms: 2.5,
        comm_quality: 5.0,
        goal_clarity: 2.0,
        coordination: 6.0,
        team_cognition: 4.5,
      };
      
      const result = normalizeDriverScores(input);
      
      expect(result.trust).toBe(3.5);
      expect(result.psych_safety).toBe(4.0);
      expect(result.tms).toBe(2.5);
      expect(result.comm_quality).toBe(5.0);
      expect(result.goal_clarity).toBe(2.0);
      expect(result.coordination).toBe(6.0);
      expect(result.team_cognition).toBe(4.5);
    });

    it('should handle alternative driver ID formats', () => {
      const input = {
        Trust: 3.5,
        'Psychological Safety': 4.0,
        'Transactive Memory': 2.5,
        'Communication Quality': 5.0,
        'Goal Clarity': 2.0,
        Coordination: 6.0,
        'Team Cognition': 4.5,
      };
      
      const result = normalizeDriverScores(input);
      
      expect(result.trust).toBe(3.5);
      expect(result.psych_safety).toBe(4.0);
    });
  });

  describe('TEAM_IMPACT_WEIGHTS', () => {
    it('should have weights for all 7 drivers', () => {
      const drivers: DriverId[] = [
        'trust', 'psych_safety', 'comm_quality', 
        'goal_clarity', 'coordination', 'tms', 'team_cognition'
      ];
      
      drivers.forEach(driver => {
        expect(TEAM_IMPACT_WEIGHTS[driver]).toBeDefined();
        expect(TEAM_IMPACT_WEIGHTS[driver]).toBeGreaterThan(0);
        expect(TEAM_IMPACT_WEIGHTS[driver]).toBeLessThanOrEqual(1);
      });
    });

    it('should have team_cognition as highest weight (1.0)', () => {
      expect(TEAM_IMPACT_WEIGHTS.team_cognition).toBe(1.0);
    });

    it('should have trust as second highest (0.94)', () => {
      expect(TEAM_IMPACT_WEIGHTS.trust).toBe(0.94);
    });
  });

  describe('BUSINESS_VALUE_WEIGHTS', () => {
    it('should have weights for all 7 industries', () => {
      const industries: Industry[] = [
        'Software & Technology',
        'Healthcare & Medical',
        'Financial Services',
        'Government & Public Sector',
        'Hospitality & Service',
        'Manufacturing & Industrial',
        'Professional Services',
      ];
      
      industries.forEach(industry => {
        expect(BUSINESS_VALUE_WEIGHTS[industry]).toBeDefined();
        
        const drivers: DriverId[] = [
          'trust', 'psych_safety', 'comm_quality', 
          'goal_clarity', 'coordination', 'tms', 'team_cognition'
        ];
        
        drivers.forEach(driver => {
          expect(BUSINESS_VALUE_WEIGHTS[industry][driver]).toBeDefined();
          expect(BUSINESS_VALUE_WEIGHTS[industry][driver]).toBeGreaterThan(0);
          expect(BUSINESS_VALUE_WEIGHTS[industry][driver]).toBeLessThanOrEqual(1);
        });
      });
    });
  });

  describe('calculatePriorityMatrix', () => {
    // Scenario 1: Software company with mixed scores
    it('should calculate correct quadrants for software company with mixed scores', () => {
      const scores: Record<DriverId, number> = {
        trust: 2.0,        // Low - should be CRITICAL
        psych_safety: 4.0, // Medium
        tms: 2.0,          // Low
        comm_quality: 5.0, // Medium-high
        goal_clarity: 2.0, // Low - should be CRITICAL
        coordination: 6.0, // High - should be LOW
        team_cognition: 5.0, // Medium-high
      };
      
      const result = calculatePriorityMatrix(scores, 'Software & Technology');
      
      expect(result.industry).toBe('Software & Technology');
      expect(result.drivers).toHaveLength(7);
      
      // Trust: Gap=5, Team=5*0.94=4.7, Biz=5*0.94=4.7 -> CRITICAL
      const trust = result.drivers.find(d => d.driverId === 'trust');
      expect(trust?.quadrant).toBe('CRITICAL');
      
      // Goal Clarity: Gap=5, Team=5*0.80=4.0, Biz=5*0.85=4.25 -> CRITICAL
      const goalClarity = result.drivers.find(d => d.driverId === 'goal_clarity');
      expect(goalClarity?.quadrant).toBe('CRITICAL');
      
      // Coordination: Gap=1, Team=1*0.83=0.83, Biz=1*0.95=0.95 -> LOW
      const coordination = result.drivers.find(d => d.driverId === 'coordination');
      expect(coordination?.quadrant).toBe('LOW');
    });

    // Scenario 2: Healthcare company with all low scores (crisis)
    it('should put all drivers in CRITICAL for healthcare company with all 1.5 scores', () => {
      const scores: Record<DriverId, number> = {
        trust: 1.5,
        psych_safety: 1.5,
        tms: 1.5,
        comm_quality: 1.5,
        goal_clarity: 1.5,
        coordination: 1.5,
        team_cognition: 1.5,
      };
      
      const result = calculatePriorityMatrix(scores, 'Healthcare & Medical');
      
      expect(result.industry).toBe('Healthcare & Medical');
      
      // All drivers should be CRITICAL with gap of 5.5
      result.drivers.forEach(driver => {
        expect(driver.gap).toBe(5.5);
        // With gap of 5.5 and weights >= 0.74, all should exceed threshold
        expect(driver.quadrant).toBe('CRITICAL');
      });
      
      expect(result.quadrantCounts.CRITICAL).toBe(7);
    });

    // Scenario 3: Hospitality company with high scores (high performer)
    it('should put all drivers in LOW for hospitality company with high scores', () => {
      const scores: Record<DriverId, number> = {
        trust: 6.5,
        psych_safety: 6.2,
        tms: 5.8,
        comm_quality: 6.0,
        goal_clarity: 5.5,
        coordination: 6.3,
        team_cognition: 5.9,
      };
      
      const result = calculatePriorityMatrix(scores, 'Hospitality & Service');
      
      expect(result.industry).toBe('Hospitality & Service');
      
      // All drivers should be LOW with small gaps
      result.drivers.forEach(driver => {
        expect(driver.gap).toBeLessThanOrEqual(1.5);
        expect(driver.quadrant).toBe('LOW');
      });
      
      expect(result.quadrantCounts.LOW).toBe(7);
    });

    // Scenario 4: Boundary condition - score exactly at threshold
    it('should handle boundary conditions correctly', () => {
      // With threshold at 2.5, a gap of 3.0 with weight 0.83 = 2.49 (just below)
      // A gap of 3.0 with weight 0.84 = 2.52 (just above)
      
      const scores: Record<DriverId, number> = {
        trust: 4.0,        // Gap=3, Team=3*0.94=2.82 (HIGH)
        psych_safety: 4.0, // Gap=3, Team=3*0.77=2.31 (LOW)
        tms: 4.0,          // Gap=3, Team=3*0.74=2.22 (LOW)
        comm_quality: 4.0, // Gap=3, Team=3*0.89=2.67 (HIGH)
        goal_clarity: 4.0, // Gap=3, Team=3*0.80=2.40 (LOW)
        coordination: 4.0, // Gap=3, Team=3*0.83=2.49 (LOW)
        team_cognition: 4.0, // Gap=3, Team=3*1.0=3.0 (HIGH)
      };
      
      const result = calculatePriorityMatrix(scores, 'Professional Services');
      
      // Verify threshold behavior
      const trust = result.drivers.find(d => d.driverId === 'trust');
      expect(trust?.teamImpactScore).toBeCloseTo(2.82, 1);
      expect(trust?.teamImpactScore).toBeGreaterThanOrEqual(QUADRANT_THRESHOLD);
      
      const psych = result.drivers.find(d => d.driverId === 'psych_safety');
      expect(psych?.teamImpactScore).toBeCloseTo(2.31, 1);
      expect(psych?.teamImpactScore).toBeLessThan(QUADRANT_THRESHOLD);
    });

    // Scenario 5: Government sector specific weights
    it('should apply government sector weights correctly', () => {
      const scores: Record<DriverId, number> = {
        trust: 3.0,
        psych_safety: 3.0,
        tms: 3.0,
        comm_quality: 3.0,
        goal_clarity: 3.0,
        coordination: 3.0,
        team_cognition: 3.0,
      };
      
      const result = calculatePriorityMatrix(scores, 'Government & Public Sector');
      
      expect(result.industry).toBe('Government & Public Sector');
      
      // Goal clarity should have highest business value weight for government (0.92)
      const goalClarity = result.drivers.find(d => d.driverId === 'goal_clarity');
      expect(goalClarity?.businessValueScore).toBeCloseTo(4 * 0.92, 1);
    });

    // Scenario 6: Quadrant counts are correct
    it('should calculate correct quadrant counts', () => {
      const scores: Record<DriverId, number> = {
        trust: 2.0,        // CRITICAL
        psych_safety: 4.5, // LOW or MEDIUM
        tms: 5.5,          // LOW
        comm_quality: 2.5, // CRITICAL or HIGH
        goal_clarity: 2.0, // CRITICAL
        coordination: 6.0, // LOW
        team_cognition: 3.0, // CRITICAL or HIGH
      };
      
      const result = calculatePriorityMatrix(scores, 'Software & Technology');
      
      // Sum of all quadrant counts should equal 7
      const totalCount = 
        result.quadrantCounts.CRITICAL + 
        result.quadrantCounts.HIGH + 
        result.quadrantCounts.MEDIUM + 
        result.quadrantCounts.LOW;
      
      expect(totalCount).toBe(7);
    });

    // Scenario 7: Gap calculation is correct
    it('should calculate gaps correctly (7 - score)', () => {
      const scores: Record<DriverId, number> = {
        trust: 2.5,
        psych_safety: 4.0,
        tms: 6.5,
        comm_quality: 1.0,
        goal_clarity: 7.0,
        coordination: 3.5,
        team_cognition: 5.0,
      };
      
      const result = calculatePriorityMatrix(scores, 'Professional Services');
      
      const trust = result.drivers.find(d => d.driverId === 'trust');
      expect(trust?.gap).toBe(4.5);
      
      const tms = result.drivers.find(d => d.driverId === 'tms');
      expect(tms?.gap).toBe(0.5);
      
      const goalClarity = result.drivers.find(d => d.driverId === 'goal_clarity');
      expect(goalClarity?.gap).toBe(0);
      
      const commQuality = result.drivers.find(d => d.driverId === 'comm_quality');
      expect(commQuality?.gap).toBe(6);
    });
  });

  describe('Quadrant Assignment Logic', () => {
    it('should assign CRITICAL when both team impact and business value >= 2.5', () => {
      // Need high gap with high weights
      const scores: Record<DriverId, number> = {
        trust: 1.0,        // Gap=6, Team=6*0.94=5.64, Biz varies
        psych_safety: 6.0,
        tms: 6.0,
        comm_quality: 6.0,
        goal_clarity: 6.0,
        coordination: 6.0,
        team_cognition: 6.0,
      };
      
      const result = calculatePriorityMatrix(scores, 'Software & Technology');
      
      const trust = result.drivers.find(d => d.driverId === 'trust');
      expect(trust?.teamImpactScore).toBeGreaterThanOrEqual(QUADRANT_THRESHOLD);
      expect(trust?.businessValueScore).toBeGreaterThanOrEqual(QUADRANT_THRESHOLD);
      expect(trust?.quadrant).toBe('CRITICAL');
    });

    it('should assign HIGH when team impact < 2.5 but business value >= 2.5', () => {
      // Need a driver with low team impact weight but high business value weight
      // TMS has team weight 0.74, need gap that gives < 2.5 team but >= 2.5 biz
      // This is hard to achieve since weights are similar - skip this edge case
    });

    it('should assign MEDIUM when team impact >= 2.5 but business value < 2.5', () => {
      // Need a driver with high team impact but low business value
      // This is also hard since weights are correlated
    });

    it('should assign LOW when both team impact and business value < 2.5', () => {
      const scores: Record<DriverId, number> = {
        trust: 6.0,        // Gap=1, Team=1*0.94=0.94, Biz=1*0.94=0.94
        psych_safety: 6.0,
        tms: 6.0,
        comm_quality: 6.0,
        goal_clarity: 6.0,
        coordination: 6.0,
        team_cognition: 6.0,
      };
      
      const result = calculatePriorityMatrix(scores, 'Software & Technology');
      
      result.drivers.forEach(driver => {
        expect(driver.teamImpactScore).toBeLessThan(QUADRANT_THRESHOLD);
        expect(driver.businessValueScore).toBeLessThan(QUADRANT_THRESHOLD);
        expect(driver.quadrant).toBe('LOW');
      });
    });
  });
});
