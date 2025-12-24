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
  const driverScores = {
    'Communication Quality': 3.5,  // Criteria: 41.7% (gap: 43.3%) - Priority 1
    'Goal Clarity': 4.0,            // Commitment: 50.0% (gap: 35.0%) - Priority 2
    'Coordination': 5.0,            // Collaboration: 72.9% (no gap), Change: 58.3% (gap: 26.7%) - Priority 3
    'Trust': 5.5,                   // Collaboration: 72.9%
    'Psychological Safety': 5.5,    // Collaboration: 72.9%
    'Transactive Memory': 5.5,      // Collaboration: 72.9%
  };
  
  const fourCsAnalysis = calculate4CsScores(driverScores);
  
  describe('Feature: Half Day Workshop - Top Priority Only', () => {
    it('should show only top 1 priority C in recommended', () => {
      const recommended = getRecommendedDeliverablesByTraining(fourCsAnalysis, 'half-day');
      
      expect(Object.keys(recommended).length).toBe(1);
      expect(recommended['Criteria']).toBeDefined();
      expect(recommended['Criteria']).toEqual(ALL_DELIVERABLES['Criteria']);
    });
    
    it('should show remaining C\'s in other deliverables', () => {
      const others = getOtherDeliverablesByTraining(fourCsAnalysis, 'half-day');
      
      expect(Object.keys(others).length).toBe(3);
      expect(others['Commitment']).toBeDefined();
      expect(others['Change']).toBeDefined();
      expect(others['Collaboration']).toBeDefined();
    });
  });
  
  describe('Feature: Full Day Workshop - Top 2 Priorities', () => {
    it('should show top 2 priority C\'s in recommended', () => {
      const recommended = getRecommendedDeliverablesByTraining(fourCsAnalysis, 'full-day');
      
      expect(Object.keys(recommended).length).toBe(2);
      expect(recommended['Criteria']).toBeDefined();
      expect(recommended['Commitment']).toBeDefined();
    });
    
    it('should show remaining C\'s in other deliverables', () => {
      const others = getOtherDeliverablesByTraining(fourCsAnalysis, 'full-day');
      
      expect(Object.keys(others).length).toBe(2);
      expect(others['Change']).toBeDefined();
      expect(others['Collaboration']).toBeDefined();
    });
  });
  
  describe('Feature: Month-Long Engagement - All Priorities', () => {
    it('should show all C\'s with gaps in recommended', () => {
      const recommended = getRecommendedDeliverablesByTraining(fourCsAnalysis, 'month-long');
      
      expect(Object.keys(recommended).length).toBe(3);
      expect(recommended['Criteria']).toBeDefined();
      expect(recommended['Commitment']).toBeDefined();
      expect(recommended['Change']).toBeDefined();
    });
    
    it('should show C\'s without gaps in other deliverables', () => {
      const others = getOtherDeliverablesByTraining(fourCsAnalysis, 'month-long');
      
      expect(Object.keys(others).length).toBe(1);
      expect(others['Collaboration']).toBeDefined();
    });
  });
  
  describe('Feature: Not Sure Yet - Show All with Prioritization', () => {
    it('should show all C\'s with gaps in recommended', () => {
      const recommended = getRecommendedDeliverablesByTraining(fourCsAnalysis, 'not-sure');
      
      expect(Object.keys(recommended).length).toBe(3);
      expect(recommended['Criteria']).toBeDefined();
      expect(recommended['Commitment']).toBeDefined();
      expect(recommended['Change']).toBeDefined();
    });
    
    it('should show C\'s without gaps in other deliverables', () => {
      const others = getOtherDeliverablesByTraining(fourCsAnalysis, 'not-sure');
      
      expect(Object.keys(others).length).toBe(1);
      expect(others['Collaboration']).toBeDefined();
    });
  });
  
  describe('Edge Case: All 4 C\'s Above 60% (No Gaps)', () => {
    const highScores = {
      'Communication Quality': 6.5,  // Criteria: 92%
      'Goal Clarity': 6.0,            // Commitment: 83%
      'Coordination': 6.5,            // Collaboration: 88%, Change: 88%
      'Trust': 6.5,
      'Psychological Safety': 6.5,
      'Transactive Memory': 6.5,
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
    const singleGapScores = {
      'Communication Quality': 3.5,  // Criteria: 42% (only gap)
      'Goal Clarity': 6.0,            // Commitment: 83%
      'Coordination': 6.5,            // Collaboration: 88%, Change: 88%
      'Trust': 6.5,
      'Psychological Safety': 6.5,
      'Transactive Memory': 6.5,
    };
    
    const singleGapAnalysis = calculate4CsScores(singleGapScores);
    
    it('should show only the single gap C in recommended', () => {
      const recommended = getRecommendedDeliverablesByTraining(singleGapAnalysis, 'half-day');
      
      expect(Object.keys(recommended).length).toBe(1);
      expect(recommended['Criteria']).toBeDefined();
    });
    
    it('should show remaining 3 C\'s in other deliverables', () => {
      const others = getOtherDeliverablesByTraining(singleGapAnalysis, 'half-day');
      
      expect(Object.keys(others).length).toBe(3);
      expect(others['Commitment']).toBeDefined();
      expect(others['Collaboration']).toBeDefined();
      expect(others['Change']).toBeDefined();
    });
  });
  
  describe('Edge Case: Only 1 C Below 60% - Full Day Workshop', () => {
    const singleGapScores = {
      'Communication Quality': 3.5,  // Criteria: 42% (only gap)
      'Goal Clarity': 6.0,            // Commitment: 83%
      'Coordination': 6.5,            // Collaboration: 88%, Change: 88%
      'Trust': 6.5,
      'Psychological Safety': 6.5,
      'Transactive Memory': 6.5,
    };
    
    const singleGapAnalysis = calculate4CsScores(singleGapScores);
    
    it('should show only 1 C in recommended (cannot show 2 when only 1 gap exists)', () => {
      const recommended = getRecommendedDeliverablesByTraining(singleGapAnalysis, 'full-day');
      
      expect(Object.keys(recommended).length).toBe(1);
      expect(recommended['Criteria']).toBeDefined();
    });
    
    it('should show remaining 3 C\'s in other deliverables', () => {
      const others = getOtherDeliverablesByTraining(singleGapAnalysis, 'full-day');
      
      expect(Object.keys(others).length).toBe(3);
    });
  });
  
  describe('Business Rule: Priority Ordering', () => {
    it('should order recommended C\'s by gap size (largest first)', () => {
      const recommended = getRecommendedDeliverablesByTraining(fourCsAnalysis, 'month-long');
      const keys = Object.keys(recommended);
      
      // Based on our test data:
      // Criteria: 43.3% gap (largest)
      // Commitment: 35.0% gap
      // Change: 26.7% gap (smallest)
      expect(keys[0]).toBe('Criteria');
      expect(keys[1]).toBe('Commitment');
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
