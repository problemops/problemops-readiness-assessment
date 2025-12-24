import { describe, it, expect } from 'vitest';
import {
  getSeverityLevel,
  getSeverityLabel,
  generateDriverImpact,
  generateTeamStory,
  getSeverityColorClass,
  getSeverityTextClass,
  getSeverityBadgeClass,
} from '../client/src/lib/driverImpactContent';

/**
 * Driver Impact Content - BDD Tests
 * 
 * Tests for Epic 28-30: Dynamic Driver Impact Analysis
 * Using correct driver keys: trust, communication, goalAlignment, 
 * psychologicalSafety, conflictResolution, roleClarity, decisionMaking
 */

describe('Driver Impact Content - BDD Tests', () => {
  
  // Epic 28: Dynamic Driver Impact Analysis
  describe('Epic 28: Dynamic Driver Impact Analysis', () => {
    
    // Feature 28.1: Severity Level Calculation
    describe('Feature 28.1: Severity Level Calculation', () => {
      it('should return "critical" for scores 1-2', () => {
        expect(getSeverityLevel(1)).toBe('critical');
        expect(getSeverityLevel(1.5)).toBe('critical');
        expect(getSeverityLevel(2)).toBe('critical');
      });
      
      it('should return "high" for scores 2.1-4', () => {
        expect(getSeverityLevel(2.1)).toBe('high');
        expect(getSeverityLevel(3)).toBe('high');
        expect(getSeverityLevel(4)).toBe('high');
      });
      
      it('should return "moderate" for scores 4.1-5', () => {
        expect(getSeverityLevel(4.1)).toBe('moderate');
        expect(getSeverityLevel(4.5)).toBe('moderate');
        expect(getSeverityLevel(5)).toBe('moderate');
      });
      
      it('should return "strength" for scores 6-7', () => {
        expect(getSeverityLevel(6)).toBe('strength');
        expect(getSeverityLevel(6.5)).toBe('strength');
        expect(getSeverityLevel(7)).toBe('strength');
      });
    });
    
    // Feature 28.2: Severity Labels
    describe('Feature 28.2: Severity Labels', () => {
      it('should return correct labels for each severity level', () => {
        expect(getSeverityLabel('critical')).toBe('Critical Dysfunction');
        expect(getSeverityLabel('high')).toBe('High Risk');
        expect(getSeverityLabel('moderate')).toBe('Moderate Concern');
        expect(getSeverityLabel('low')).toBe('Low Risk');
        expect(getSeverityLabel('strength')).toBe('Team Strength');
      });
    });
    
    // Feature 28.3: Driver Impact Generation
    describe('Feature 28.3: Driver Impact Generation', () => {
      it('should generate impact for trust driver with low score', () => {
        const impact = generateDriverImpact('trust', 2.5);
        
        expect(impact.driverKey).toBe('trust');
        expect(impact.driverName).toBe('Trust');
        expect(impact.score).toBe(2.5);
        expect(impact.severityLevel).toBe('high');
        expect(impact.severityLabel).toBe('High Risk');
        expect(impact.summaryStatement).toBeTruthy();
        expect(impact.behavioralConsequences.length).toBeGreaterThan(0);
        expect(impact.wasteOutcomes.length).toBeGreaterThan(0);
        expect(impact.citation).toBeTruthy();
        expect(impact.citation.authors).toBeTruthy();
        expect(impact.citation.year).toBeTruthy();
      });
      
      it('should generate positive impact for trust driver with high score', () => {
        const impact = generateDriverImpact('trust', 6.5);
        
        expect(impact.severityLevel).toBe('strength');
        expect(impact.severityLabel).toBe('Team Strength');
      });
      
      it('should generate impact for communication driver', () => {
        const impact = generateDriverImpact('communication', 3.0);
        
        expect(impact.driverName).toBe('Communication Quality');
        expect(impact.severityLevel).toBe('high');
        expect(impact.behavioralConsequences.length).toBeGreaterThan(0);
      });
      
      it('should generate impact for psychological safety driver', () => {
        const impact = generateDriverImpact('psychologicalSafety', 2.0);
        
        expect(impact.driverName).toBe('Psychological Safety');
        expect(impact.severityLevel).toBe('critical');
        expect(impact.behavioralConsequences.length).toBeGreaterThan(0);
      });
      
      it('should generate impact for goal alignment driver', () => {
        const impact = generateDriverImpact('goalAlignment', 4.5);
        
        expect(impact.driverName).toBe('Goal Alignment');
        expect(impact.severityLevel).toBe('moderate');
      });
      
      it('should generate impact for conflict resolution driver', () => {
        const impact = generateDriverImpact('conflictResolution', 6.0);
        
        expect(impact.driverName).toBe('Conflict Resolution');
        expect(impact.severityLevel).toBe('strength');
      });
      
      it('should generate impact for role clarity driver', () => {
        const impact = generateDriverImpact('roleClarity', 6.0);
        
        expect(impact.driverName).toBe('Role Clarity');
        expect(impact.severityLevel).toBe('strength');
      });
      
      it('should generate impact for decision making driver', () => {
        const impact = generateDriverImpact('decisionMaking', 3.5);
        
        expect(impact.driverName).toBe('Decision Making');
        expect(impact.severityLevel).toBe('high');
      });
    });
    
    // Feature 28.4: Team Story Generation
    describe('Feature 28.4: Team Story Generation', () => {
      it('should generate team story with mixed scores', () => {
        const drivers = {
          trust: 2.5,
          communication: 3.0,
          psychologicalSafety: 4.0,
          goalAlignment: 5.5,
          conflictResolution: 6.0,
          roleClarity: 6.5,
          decisionMaking: 4.5,
        };
        
        const story = generateTeamStory(drivers);
        
        expect(story.narrative).toBeTruthy();
        expect(story.driverImpacts.length).toBe(7);
        expect(story.strengths.length).toBeGreaterThan(0);
        expect(story.concerns.length).toBeGreaterThan(0);
        expect(story.overallSeverity).toBeTruthy();
      });
      
      it('should identify low-scoring drivers as concerns', () => {
        const drivers = {
          trust: 2.0,
          communication: 2.5,
          psychologicalSafety: 3.0,
          goalAlignment: 6.0,
          conflictResolution: 6.5,
          roleClarity: 7.0,
          decisionMaking: 5.5,
        };
        
        const story = generateTeamStory(drivers);
        
        // Low scores should be in concerns
        expect(story.concerns.some(d => d.driverKey === 'trust')).toBe(true);
        expect(story.concerns.some(d => d.driverKey === 'communication')).toBe(true);
        expect(story.concerns.some(d => d.driverKey === 'psychologicalSafety')).toBe(true);
      });
      
      it('should identify high-scoring drivers as strengths', () => {
        const drivers = {
          trust: 2.0,
          communication: 2.5,
          psychologicalSafety: 3.0,
          goalAlignment: 6.0,
          conflictResolution: 6.5,
          roleClarity: 7.0,
          decisionMaking: 5.5,
        };
        
        const story = generateTeamStory(drivers);
        
        // High scores should be in strengths
        expect(story.strengths.some(d => d.driverKey === 'goalAlignment')).toBe(true);
        expect(story.strengths.some(d => d.driverKey === 'conflictResolution')).toBe(true);
        expect(story.strengths.some(d => d.driverKey === 'roleClarity')).toBe(true);
      });
      
      it('should sort concerns by severity (worst first)', () => {
        const drivers = {
          trust: 4.0,           // high risk
          communication: 2.0,   // critical
          psychologicalSafety: 3.0, // high risk
          goalAlignment: 5.0,   // moderate
          conflictResolution: 6.0,
          roleClarity: 6.5,
          decisionMaking: 4.5,
        };
        
        const story = generateTeamStory(drivers);
        
        // First concern should be the most critical (communication at 2.0)
        expect(story.concerns[0].driverKey).toBe('communication');
        expect(story.concerns[0].severityLevel).toBe('critical');
      });
      
      it('should determine overall severity correctly', () => {
        // Team with critical issues
        const criticalDrivers = {
          trust: 2.0,
          communication: 6.0,
          psychologicalSafety: 6.0,
          goalAlignment: 6.0,
          conflictResolution: 6.0,
          roleClarity: 6.0,
          decisionMaking: 6.0,
        };
        const criticalStory = generateTeamStory(criticalDrivers);
        expect(criticalStory.overallSeverity).toBe('critical');
        
        // Team with all strengths
        const strongDrivers = {
          trust: 7.0,
          communication: 7.0,
          psychologicalSafety: 7.0,
          goalAlignment: 7.0,
          conflictResolution: 7.0,
          roleClarity: 7.0,
          decisionMaking: 7.0,
        };
        const strongStory = generateTeamStory(strongDrivers);
        expect(strongStory.overallSeverity).toBe('strength');
      });
    });
    
    // Feature 28.5: Waste Outcomes
    describe('Feature 28.5: Waste Outcomes', () => {
      it('should include specific waste categories for low trust', () => {
        const impact = generateDriverImpact('trust', 2.0);
        
        const wasteCategories = impact.wasteOutcomes.map(w => w.category);
        expect(wasteCategories.length).toBeGreaterThan(0);
        // Should include common waste types
        expect(wasteCategories.some(c => 
          c.includes('Bug') || c.includes('Cycle') || c.includes('Ticket') || c.includes('Error')
        )).toBe(true);
      });
      
      it('should include waste descriptions', () => {
        const impact = generateDriverImpact('communication', 2.5);
        
        impact.wasteOutcomes.forEach(waste => {
          expect(waste.category).toBeTruthy();
          expect(waste.description).toBeTruthy();
          expect(waste.icon).toBeTruthy();
        });
      });
    });
    
    // Feature 28.6: Academic Citations
    describe('Feature 28.6: Academic Citations', () => {
      const driverKeys = ['trust', 'communication', 'psychologicalSafety', 'goalAlignment', 'conflictResolution', 'roleClarity', 'decisionMaking'];
      
      it('should include academic citation for each driver', () => {
        driverKeys.forEach(driverKey => {
          const impact = generateDriverImpact(driverKey, 3.0);
          
          expect(impact.citation).toBeTruthy();
          expect(impact.citation.authors).toBeTruthy();
          expect(impact.citation.year).toBeTruthy();
          expect(impact.citation.finding).toBeTruthy();
        });
      });
      
      it('should have correct citations for key drivers', () => {
        const trustImpact = generateDriverImpact('trust', 4.0);
        expect(trustImpact.citation.authors).toBe('Morrissette & Kisamore');
        expect(trustImpact.citation.year).toBe(2020);
        
        const commImpact = generateDriverImpact('communication', 4.0);
        expect(commImpact.citation.authors).toBe('Marlow et al.');
        expect(commImpact.citation.year).toBe(2018);
      });
    });
    
    // Feature 28.7: Color Classes
    describe('Feature 28.7: Visual Styling Classes', () => {
      it('should return correct color classes for severity levels', () => {
        expect(getSeverityColorClass('critical')).toContain('red');
        expect(getSeverityColorClass('high')).toContain('orange');
        expect(getSeverityColorClass('moderate')).toContain('yellow');
        expect(getSeverityColorClass('low')).toContain('blue');
        expect(getSeverityColorClass('strength')).toContain('green');
      });
      
      it('should return correct text classes for severity levels', () => {
        expect(getSeverityTextClass('critical')).toContain('red');
        expect(getSeverityTextClass('high')).toContain('orange');
        expect(getSeverityTextClass('moderate')).toContain('yellow');
        expect(getSeverityTextClass('low')).toContain('blue');
        expect(getSeverityTextClass('strength')).toContain('green');
      });
      
      it('should return correct badge classes for severity levels', () => {
        expect(getSeverityBadgeClass('critical')).toContain('red');
        expect(getSeverityBadgeClass('strength')).toContain('green');
      });
      
      it('should include dark mode variants', () => {
        expect(getSeverityColorClass('critical')).toContain('dark:');
        expect(getSeverityTextClass('critical')).toContain('dark:');
        expect(getSeverityBadgeClass('critical')).toContain('dark:');
      });
    });
  });
  
  // Epic 30: Positive Impact Narratives
  describe('Epic 30: Positive Impact Narratives', () => {
    
    describe('Feature 30.1: High Score Recognition', () => {
      it('should generate positive narrative for high trust score', () => {
        const impact = generateDriverImpact('trust', 6.5);
        
        expect(impact.severityLevel).toBe('strength');
        expect(impact.behavioralConsequences.length).toBeGreaterThan(0);
        expect(impact.wasteOutcomes.length).toBeGreaterThan(0);
      });
      
      it('should generate positive narrative for high communication score', () => {
        const impact = generateDriverImpact('communication', 6.0);
        
        expect(impact.severityLevel).toBe('strength');
        expect(impact.summaryStatement).toBeTruthy();
      });
      
      it('should generate positive narrative for high psychological safety', () => {
        const impact = generateDriverImpact('psychologicalSafety', 6.5);
        
        expect(impact.severityLevel).toBe('strength');
        expect(impact.summaryStatement).toBeTruthy();
      });
    });
    
    describe('Feature 30.2: Efficiency Gains', () => {
      it('should show efficiency gains for high-scoring drivers', () => {
        const impact = generateDriverImpact('roleClarity', 6.5);
        
        expect(impact.wasteOutcomes.length).toBeGreaterThan(0);
        expect(impact.severityLevel).toBe('strength');
        // For strengths, outcomes represent efficiency gains
        impact.wasteOutcomes.forEach(outcome => {
          expect(outcome.description).toBeTruthy();
        });
      });
    });
    
    describe('Feature 30.3: Team Story Balance', () => {
      it('should include both concerns and strengths in team story', () => {
        const drivers = {
          trust: 2.5,
          communication: 6.5,
          psychologicalSafety: 3.0,
          goalAlignment: 6.0,
          conflictResolution: 4.0,
          roleClarity: 6.5,
          decisionMaking: 3.5,
        };
        
        const story = generateTeamStory(drivers);
        
        expect(story.concerns.length).toBeGreaterThan(0);
        expect(story.strengths.length).toBeGreaterThan(0);
        expect(story.narrative).toContain('strength');
      });
    });
  });
  
  // Regression Tests
  describe('Regression Tests', () => {
    
    describe('ROI Calculation Support', () => {
      it('should provide data structure compatible with ROI calculations', () => {
        const impact = generateDriverImpact('trust', 3.0);
        
        expect(typeof impact.score).toBe('number');
        expect(impact.score).toBeGreaterThanOrEqual(1);
        expect(impact.score).toBeLessThanOrEqual(7);
      });
    });
    
    describe('All 7 Drivers Coverage', () => {
      it('should support all 7 team effectiveness drivers', () => {
        const driverKeys = ['trust', 'communication', 'psychologicalSafety', 'goalAlignment', 'conflictResolution', 'roleClarity', 'decisionMaking'];
        
        driverKeys.forEach(key => {
          const impact = generateDriverImpact(key, 4.0);
          expect(impact.driverKey).toBe(key);
          expect(impact.driverName).toBeTruthy();
        });
      });
    });
    
    describe('Edge Cases', () => {
      it('should handle minimum score (1.0)', () => {
        const impact = generateDriverImpact('trust', 1.0);
        expect(impact.severityLevel).toBe('critical');
      });
      
      it('should handle maximum score (7.0)', () => {
        const impact = generateDriverImpact('trust', 7.0);
        expect(impact.severityLevel).toBe('strength');
      });
      
      it('should handle boundary score (5.0)', () => {
        const impact = generateDriverImpact('trust', 5.0);
        expect(impact.severityLevel).toBe('moderate');
      });
      
      it('should handle unknown driver key gracefully', () => {
        const impact = generateDriverImpact('unknown_driver', 4.0);
        expect(impact.driverKey).toBe('unknown_driver');
        expect(impact.driverName).toBeTruthy();
        expect(impact.behavioralConsequences.length).toBeGreaterThan(0);
      });
      
      it('should use default score of 4 for missing drivers in team story', () => {
        const story = generateTeamStory({});
        
        expect(story.driverImpacts.length).toBe(7);
        story.driverImpacts.forEach(impact => {
          expect(impact.score).toBe(4);
          expect(impact.severityLevel).toBe('high');
        });
      });
    });
  });
});
