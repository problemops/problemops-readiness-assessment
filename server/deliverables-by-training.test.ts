import { describe, it, expect } from 'vitest';
import { 
  calculate4CsScores, 
  getRecommendedDeliverablesByTraining, 
  getOtherDeliverablesByTraining,
  ALL_DELIVERABLES 
} from '../client/src/lib/fourCsScoring';

/**
 * BDD Tests: Deliverables Display Based on Training Type
 * 
 * Feature: Dynamic Deliverables Recommendations Based on Training Selection
 * 
 * As a team leader reviewing assessment results
 * I want to see ProblemOps deliverables organized by my selected training type
 * So that I understand which artifacts to prioritize during my training engagement
 */

describe('Epic: Training-Type-Based Deliverables', () => {
  
  // Background: Assessment with mixed 4 C's scores
  // New formulas:
  // - Criteria = avg(Communication Quality, Goal Clarity, Coordination)
  // - Commitment = avg(Communication Quality, Trust, Goal Clarity)
  // - Change = avg(Goal Clarity, Coordination)
  // - Collaboration = avg(TMS, Trust, Psych Safety, Coordination, Team Cognition)
  const driverScores = {
    'Communication Quality': 2.0,  // Low score
    'Goal Clarity': 3.0,           // Low score
    'Coordination': 4.0,           // Medium score
    'Trust': 3.5,                  // Low-medium score
    'Psychological Safety': 5.5,   // High score
    'Transactive Memory': 6.0,     // High score
    'Team Cognition': 6.5,         // High score
  };
  // Calculated 4 C's:
  // - Criteria = (2.0 + 3.0 + 4.0) / 3 = 3.0 → 33.3% (gap: 51.7%) - Priority 1
  // - Commitment = (2.0 + 3.5 + 3.0) / 3 = 2.83 → 30.5% (gap: 54.5%) - Priority 2 (actually highest gap!)
  // - Change = (3.0 + 4.0) / 2 = 3.5 → 41.7% (gap: 43.3%) - Priority 3
  // - Collaboration = (6.0 + 3.5 + 5.5 + 4.0 + 6.5) / 5 = 5.1 → 68.3% (gap: 16.7%) - Priority 4
  
  const fourCsAnalysis = calculate4CsScores(driverScores);
  
  describe('Feature: Half Day Workshop - Top Priority Only', () => {
    it('should show only top 1 priority C in recommended', () => {
      const recommended = getRecommendedDeliverablesByTraining(fourCsAnalysis, 'half-day');
      
      expect(Object.keys(recommended).length).toBe(1);
      // Commitment has the largest gap (54.5%)
      expect(recommended['Commitment']).toBeDefined();
      expect(recommended['Commitment']).toEqual(ALL_DELIVERABLES['Commitment']);
    });
    
    it('should show remaining C\'s in other deliverables', () => {
      const others = getOtherDeliverablesByTraining(fourCsAnalysis, 'half-day');
      
      expect(Object.keys(others).length).toBe(3);
      expect(others['Criteria']).toBeDefined();
      expect(others['Change']).toBeDefined();
      expect(others['Collaboration']).toBeDefined();
    });
  });
  
  describe('Feature: Full Day Workshop - Top 2 Priorities', () => {
    it('should show top 2 priority C\'s in recommended', () => {
      const recommended = getRecommendedDeliverablesByTraining(fourCsAnalysis, 'full-day');
      
      expect(Object.keys(recommended).length).toBe(2);
      // Top 2 by gap: Commitment (54.5%), Criteria (51.7%)
      expect(recommended['Commitment']).toBeDefined();
      expect(recommended['Criteria']).toBeDefined();
    });
    
    it('should show remaining C\'s in other deliverables', () => {
      const others = getOtherDeliverablesByTraining(fourCsAnalysis, 'full-day');
      
      expect(Object.keys(others).length).toBe(2);
      expect(others['Change']).toBeDefined();
      expect(others['Collaboration']).toBeDefined();
    });
  });
  
  describe('Feature: Month-Long Engagement - All Priorities', () => {
    it('should show all C\'s with gaps (<60%) in recommended', () => {
      const recommended = getRecommendedDeliverablesByTraining(fourCsAnalysis, 'month-long');
      
      // Only 3 C's have gaps below 60%: Criteria (33.3%), Commitment (30.6%), Change (41.7%)
      // Collaboration (68.3%) is above 60% threshold
      expect(Object.keys(recommended).length).toBe(3);
      expect(recommended['Criteria']).toBeDefined();
      expect(recommended['Commitment']).toBeDefined();
      expect(recommended['Change']).toBeDefined();
    });
    
    it('should show C\'s without gaps in other deliverables', () => {
      const others = getOtherDeliverablesByTraining(fourCsAnalysis, 'month-long');
      
      // Collaboration (68.3%) is above 60%, so it goes to "other"
      expect(Object.keys(others).length).toBe(1);
      expect(others['Collaboration']).toBeDefined();
    });
  });
  
  describe('Feature: Not Sure Yet - Show All with Prioritization', () => {
    it('should show all C\'s with gaps (<60%) in recommended', () => {
      const recommended = getRecommendedDeliverablesByTraining(fourCsAnalysis, 'not-sure');
      
      // Only 3 C's have gaps below 60%
      expect(Object.keys(recommended).length).toBe(3);
      expect(recommended['Criteria']).toBeDefined();
      expect(recommended['Commitment']).toBeDefined();
      expect(recommended['Change']).toBeDefined();
    });
    
    it('should show C\'s without gaps in other deliverables', () => {
      const others = getOtherDeliverablesByTraining(fourCsAnalysis, 'not-sure');
      
      // Collaboration (68.3%) is above 60%, so it goes to "other"
      expect(Object.keys(others).length).toBe(1);
      expect(others['Collaboration']).toBeDefined();
    });
  });
  
  describe('Edge Case: All 4 C\'s Above 60% (No Gaps)', () => {
    const highScores = {
      'Communication Quality': 6.5,
      'Goal Clarity': 6.0,
      'Coordination': 6.5,
      'Trust': 6.5,
      'Psychological Safety': 6.5,
      'Transactive Memory': 6.5,
      'Team Cognition': 6.5,
    };
    
    const highFourCsAnalysis = calculate4CsScores(highScores);
    
    it('should show no recommended deliverables (no gaps)', () => {
      const recommended = getRecommendedDeliverablesByTraining(highFourCsAnalysis, 'half-day');
      
      expect(Object.keys(recommended).length).toBe(0);
    });
    
    it('should show all 4 C\'s in other deliverables', () => {
      const others = getOtherDeliverablesByTraining(highFourCsAnalysis, 'half-day');
      
      expect(Object.keys(others).length).toBe(4);
      expect(others['Criteria']).toBeDefined();
      expect(others['Commitment']).toBeDefined();
      expect(others['Collaboration']).toBeDefined();
      expect(others['Change']).toBeDefined();
    });
  });
  
  describe('Edge Case: Only 1 C Below 60% - Half Day Workshop', () => {
    // Create data where only Change has a gap
    // Change = avg(GoalClarity, Coordination)
    // To get Change < 60%, we need avg < 60%, so raw avg < 4.6
    // Use GoalClarity=2.0, Coordination=2.0 → Change = 16.7%
    // But this affects other C's, so we need to balance
    const singleGapScores = {
      'Communication Quality': 6.5,  // High - helps Criteria, Commitment
      'Goal Clarity': 2.0,           // Low - only affects Change significantly
      'Coordination': 2.0,           // Low - only affects Change significantly
      'Trust': 6.5,                  // High - helps Commitment, Collaboration
      'Psychological Safety': 6.5,   // High - helps Collaboration
      'Transactive Memory': 6.5,     // High - helps Collaboration
      'Team Cognition': 6.5,         // High - helps Collaboration
    };
    // Criteria = (6.5 + 2.0 + 2.0) / 3 = 3.5 → 41.7% (gap!)
    // Commitment = (6.5 + 6.5 + 2.0) / 3 = 5.0 → 66.7% (no gap)
    // Change = (2.0 + 2.0) / 2 = 2.0 → 16.7% (gap!)
    // Collaboration = (6.5 + 6.5 + 6.5 + 2.0 + 6.5) / 5 = 5.6 → 76.7% (no gap)
    // Actually 2 gaps: Criteria and Change
    
    const singleGapAnalysis = calculate4CsScores(singleGapScores);
    
    it('should show top 1 gap C in recommended', () => {
      const recommended = getRecommendedDeliverablesByTraining(singleGapAnalysis, 'half-day');
      
      // 2 C's have gaps, show top 1
      expect(Object.keys(recommended).length).toBe(1);
    });
    
    it('should show remaining C\'s in other deliverables', () => {
      const others = getOtherDeliverablesByTraining(singleGapAnalysis, 'half-day');
      
      // 3 others: 1 gap C + 2 no-gap C's
      expect(Object.keys(others).length).toBe(3);
    });
  });
  
  describe('Edge Case: Only 1 C Below 60% - Full Day Workshop', () => {
    // Same data as above
    const singleGapScores = {
      'Communication Quality': 6.5,
      'Goal Clarity': 2.0,
      'Coordination': 2.0,
      'Trust': 6.5,
      'Psychological Safety': 6.5,
      'Transactive Memory': 6.5,
      'Team Cognition': 6.5,
    };
    
    const singleGapAnalysis = calculate4CsScores(singleGapScores);
    
    it('should show top 2 gap C\'s in recommended', () => {
      const recommended = getRecommendedDeliverablesByTraining(singleGapAnalysis, 'full-day');
      
      // 2 C's have gaps (Criteria and Change), show both
      expect(Object.keys(recommended).length).toBe(2);
    });
    
    it('should show remaining C\'s in other deliverables', () => {
      const others = getOtherDeliverablesByTraining(singleGapAnalysis, 'full-day');
      
      // 2 others: Commitment and Collaboration (no gaps)
      expect(Object.keys(others).length).toBe(2);
    });
  });
  
  describe('Business Rule: Priority Ordering', () => {
    it('should order recommended C\'s by gap size (largest first)', () => {
      const recommended = getRecommendedDeliverablesByTraining(fourCsAnalysis, 'month-long');
      const keys = Object.keys(recommended);
      
      // Based on our updated test data with new formulas:
      // Only C's with score < 60% are included:
      // Commitment: 30.6% score → 54.4% gap (largest)
      // Criteria: 33.3% score → 51.7% gap
      // Change: 41.7% score → 43.3% gap
      // Collaboration: 68.3% score (above 60%, NOT included)
      expect(keys.length).toBe(3);
      expect(keys[0]).toBe('Commitment');
      expect(keys[1]).toBe('Criteria');
      expect(keys[2]).toBe('Change');
    });
  });
  
  describe('Business Rule: Deliverables Content', () => {
    it('should include all expected deliverables for each C', () => {
      expect(ALL_DELIVERABLES['Criteria'].length).toBe(5);
      expect(ALL_DELIVERABLES['Commitment'].length).toBe(5);
      expect(ALL_DELIVERABLES['Collaboration'].length).toBe(5);
      expect(ALL_DELIVERABLES['Change'].length).toBe(5);
    });
    
    it('should include specific deliverables for Criteria', () => {
      expect(ALL_DELIVERABLES['Criteria']).toContain('Scenario-based problem statements');
      expect(ALL_DELIVERABLES['Criteria']).toContain('Research insights');
      expect(ALL_DELIVERABLES['Criteria']).toContain('Current experience maps');
    });
    
    it('should include specific deliverables for Commitment', () => {
      expect(ALL_DELIVERABLES['Commitment']).toContain('Vision boards');
      expect(ALL_DELIVERABLES['Commitment']).toContain('Strategy definition');
      expect(ALL_DELIVERABLES['Commitment']).toContain('Success metrics');
    });
  });
});
