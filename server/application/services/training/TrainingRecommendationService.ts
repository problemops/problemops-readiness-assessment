/**
 * Training Recommendation Service
 * Calculates ROI and recommends training programs based on assessment results
 */

import { DriverMatrixResult, PriorityMatrixResult } from '../priorityMatrix/PriorityMatrixService';

export type TrainingType = 'half-day' | 'full-day' | 'month-long' | 'not-sure';

export interface TrainingRecommendation {
  trainingType: TrainingType;
  focusDrivers: string[];
  estimatedCost: number;
  estimatedSavings: number;
  roi: number;
  roiPercentage: number;
  paybackPeriod: number;
  deliverables: string[];
}

export interface ROICalculation {
  currentDysfunctionCost: number;
  estimatedImprovement: number;
  estimatedSavings: number;
  trainingCost: number;
  roi: number;
  roiPercentage: number;
  paybackPeriod: number;
}

export class TrainingRecommendationService {
  // Training program costs (base estimates)
  private readonly TRAINING_COSTS = {
    'half-day': 5000,
    'full-day': 10000,
    'month-long': 50000,
    'not-sure': 10000,
  };

  // Expected improvement rates by training type
  private readonly IMPROVEMENT_RATES = {
    'half-day': 0.15,      // 15% improvement
    'full-day': 0.25,      // 25% improvement
    'month-long': 0.85,    // 85% improvement
    'not-sure': 0.25,      // Default to full-day
  };

  /**
   * Calculate ROI for a training program
   */
  calculateROI(
    dysfunctionCost: number,
    trainingType: TrainingType
  ): ROICalculation {
    const improvementRate = this.IMPROVEMENT_RATES[trainingType];
    const trainingCost = this.TRAINING_COSTS[trainingType];
    
    const estimatedSavings = dysfunctionCost * improvementRate;
    const roi = estimatedSavings - trainingCost;
    const roiPercentage = (roi / trainingCost) * 100;
    
    // Payback period in months (assuming annual dysfunction cost)
    const paybackPeriod = trainingCost / (estimatedSavings / 12);

    return {
      currentDysfunctionCost: dysfunctionCost,
      estimatedImprovement: improvementRate,
      estimatedSavings,
      trainingCost,
      roi,
      roiPercentage,
      paybackPeriod,
    };
  }

  /**
   * Get focus drivers based on training type
   */
  private getFocusDrivers(
    trainingType: TrainingType,
    priorityMatrix: PriorityMatrixResult
  ): DriverMatrixResult[] {
    const sortedDrivers = [...priorityMatrix.drivers].sort((a, b) => {
      // Sort by quadrant priority first
      const quadrantOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      const aOrder = quadrantOrder[a.quadrant];
      const bOrder = quadrantOrder[b.quadrant];
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      
      // Then by team impact score
      return b.teamImpactScore - a.teamImpactScore;
    });

    // Determine number of drivers based on training type
    const driverCounts = {
      'half-day': 1,
      'full-day': 2,
      'month-long': 7,
      'not-sure': 7,
    };

    return sortedDrivers.slice(0, driverCounts[trainingType]);
  }

  /**
   * Get deliverables for training type
   */
  private getDeliverables(trainingType: TrainingType): string[] {
    const deliverables = {
      'half-day': [
        'Interactive workshop focused on top priority driver',
        'Team assessment debrief and action planning',
        'Quick-win strategies and implementation roadmap',
        'Follow-up resources and tools',
      ],
      'full-day': [
        'Comprehensive workshop covering top 2 priority drivers',
        'Team assessment deep-dive analysis',
        'Customized action plan with 30-60-90 day milestones',
        'Team charter and working agreements',
        'Implementation toolkit and resources',
        '30-day follow-up coaching session',
      ],
      'month-long': [
        'Multi-session program addressing all 7 drivers',
        'Weekly coaching sessions with team leader',
        'Custom team playbook and operating system',
        'Behavioral assessments and 360° feedback',
        'Team charter, norms, and decision-making frameworks',
        'Conflict resolution and communication protocols',
        'Goal-setting and accountability structures',
        'Quarterly review and continuous improvement plan',
        '90-day post-program support',
      ],
      'not-sure': [
        'Consultation to determine optimal program',
        'Detailed assessment review and recommendations',
        'Customized proposal based on team needs',
      ],
    };

    return deliverables[trainingType];
  }

  /**
   * Generate training recommendation
   */
  generateRecommendation(
    trainingType: TrainingType,
    dysfunctionCost: number,
    priorityMatrix: PriorityMatrixResult
  ): TrainingRecommendation {
    const roi = this.calculateROI(dysfunctionCost, trainingType);
    const focusDrivers = this.getFocusDrivers(trainingType, priorityMatrix);
    const deliverables = this.getDeliverables(trainingType);

    return {
      trainingType,
      focusDrivers: focusDrivers.map(d => d.driverName),
      estimatedCost: roi.trainingCost,
      estimatedSavings: roi.estimatedSavings,
      roi: roi.roi,
      roiPercentage: roi.roiPercentage,
      paybackPeriod: roi.paybackPeriod,
      deliverables,
    };
  }

  /**
   * Generate all training recommendations
   */
  generateAllRecommendations(
    dysfunctionCost: number,
    priorityMatrix: PriorityMatrixResult
  ): Record<TrainingType, TrainingRecommendation> {
    const types: TrainingType[] = ['half-day', 'full-day', 'month-long', 'not-sure'];
    
    const recommendations: Record<string, TrainingRecommendation> = {};
    
    for (const type of types) {
      recommendations[type] = this.generateRecommendation(type, dysfunctionCost, priorityMatrix);
    }

    return recommendations as Record<TrainingType, TrainingRecommendation>;
  }
}
