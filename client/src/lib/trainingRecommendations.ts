/**
 * Training Recommendations Logic
 * 
 * Generates tailored recommendations based on training type selection
 */

export type TrainingType = 'half-day' | 'full-day' | 'month-long' | 'not-sure';

export interface TrainingOption {
  type: TrainingType;
  name: string;
  cost: number;
  duration: string;
  focusAreas: number; // How many critical areas to focus on
  description: string;
}

export const TRAINING_OPTIONS: Record<TrainingType, TrainingOption> = {
  'half-day': {
    type: 'half-day',
    name: 'Half Day Workshop',
    cost: 2000,
    duration: '4 hours',
    focusAreas: 1,
    description: 'Intensive half-day session focused on your #1 most critical area for immediate impact'
  },
  'full-day': {
    type: 'full-day',
    name: 'Full Day Workshop',
    cost: 3500,
    duration: '8 hours',
    focusAreas: 2,
    description: 'Comprehensive full-day workshop addressing your top 2 critical areas with hands-on exercises'
  },
  'month-long': {
    type: 'month-long',
    name: 'Month-Long Engagement',
    cost: 50000,
    duration: '4 weeks',
    focusAreas: 7,
    description: 'Comprehensive month-long program covering all 7 drivers with ongoing support and implementation'
  },
  'not-sure': {
    type: 'not-sure',
    name: 'Compare All Options',
    cost: 0,
    duration: 'Variable',
    focusAreas: 0,
    description: 'See detailed comparison of all training options to make an informed decision'
  }
};

export interface PriorityArea {
  id: string;
  name: string;
  score: number;
  weight: number;
  priority: number; // 1 = highest priority
  gap: number; // Distance from target (85%)
  description: string;
}

/**
 * Get priority areas ranked by criticality
 */
export function getPriorityAreas(
  driverScores: Record<string, number>,
  driverWeights: Record<string, number>
): PriorityArea[] {
  const driverTitles: Record<string, string> = {
    trust: 'Trust',
    psych_safety: 'Psychological Safety',
    tms: 'Transactive Memory',
    comm_quality: 'Communication Quality',
    goal_clarity: 'Goal Clarity',
    coordination: 'Coordination',
    team_cognition: 'Team Cognition'
  };

  const target = 0.85; // 85% target
  
  const driverDescriptions: Record<string, string> = {
    trust: 'The degree to which team members can rely on each other to follow through on commitments and believe others have good intentions.',
    psych_safety: 'The extent to which team members feel comfortable taking risks and speaking up without fear of embarrassment or punishment.',
    tms: "The team's shared understanding of who knows what and where to find specific information or expertise.",
    comm_quality: 'The clarity, timeliness, and effectiveness of information sharing within the team.',
    goal_clarity: 'The degree to which team members understand objectives and how their work contributes to team success.',
    coordination: 'How smoothly work flows between team members and how well the team manages handoffs and dependencies.',
    team_cognition: "The team's ability to think and solve problems effectively as a collective unit."
  };

  const areas: PriorityArea[] = Object.entries(driverScores).map(([driver, score]) => {
    const normalizedScore = score / 7; // Convert 1-7 scale to 0-1
    const weight = driverWeights[driver] || 0.143;
    const gap = target - normalizedScore;
    
    // Priority score: higher gap + higher weight = higher priority
    const priorityScore = gap * weight;
    
    return {
      id: driver,
      name: driverTitles[driver] || driver,
      score,
      weight,
      priority: 0, // Will be assigned after sorting
      gap,
      description: driverDescriptions[driver] || ''
    };
  });

  // Sort by priority score (descending)
  areas.sort((a, b) => {
    const aPriority = (a.gap * a.weight);
    const bPriority = (b.gap * b.weight);
    return bPriority - aPriority;
  });

  // Assign priority ranks
  areas.forEach((area, index) => {
    area.priority = index + 1;
  });

  return areas;
}

/**
 * Get recommended areas based on training type
 */
export function getRecommendedAreas(
  trainingType: TrainingType,
  priorityAreas: PriorityArea[]
): PriorityArea[] {
  const option = TRAINING_OPTIONS[trainingType];
  
  if (trainingType === 'not-sure') {
    return priorityAreas; // Return all for comparison
  }
  
  // Return top N areas based on focus count
  return priorityAreas.slice(0, option.focusAreas);
}

/**
 * Generate timeline for month-long engagement
 */
export function getMonthLongTimeline(priorityAreas: PriorityArea[]): {
  week: number;
  areas: PriorityArea[];
  focus: string;
}[] {
  // Distribute 7 drivers across 4 weeks, prioritizing critical areas first
  const timeline = [
    {
      week: 1,
      areas: priorityAreas.slice(0, 2),
      focus: 'Foundation - Address most critical gaps'
    },
    {
      week: 2,
      areas: priorityAreas.slice(2, 4),
      focus: 'Building Momentum - Strengthen core capabilities'
    },
    {
      week: 3,
      areas: priorityAreas.slice(4, 6),
      focus: 'Integration - Connect systems and processes'
    },
    {
      week: 4,
      areas: priorityAreas.slice(6, 7),
      focus: 'Sustainability - Embed practices and measure progress'
    }
  ];

  return timeline;
}

/**
 * Get recommended deliverables based on training type and priority areas
 */
export function getRecommendedDeliverables(
  trainingType: TrainingType,
  recommendedAreas: PriorityArea[]
): {
  category: string;
  deliverables: string[];
  rationale: string;
}[] {
  const option = TRAINING_OPTIONS[trainingType];
  
  if (trainingType === 'not-sure') {
    return []; // Will show deliverables for each option in comparison
  }

  // Map drivers to their primary 4C category and deliverables
  const driverToDeliverables: Record<string, { category: string; deliverables: string[] }> = {
    trust: {
      category: 'Collaboration',
      deliverables: [
        'Team Charter defining working agreements and commitments',
        'Trust-building exercises and vulnerability workshops',
        'Accountability framework and follow-through tracking'
      ]
    },
    psych_safety: {
      category: 'Collaboration',
      deliverables: [
        'Psychological safety assessment and action plan',
        'Speak-up culture guidelines and practices',
        'Feedback loops and learning-from-failure protocols'
      ]
    },
    tms: {
      category: 'Collaboration',
      deliverables: [
        'Skills matrix and expertise mapping',
        'Knowledge-sharing systems and documentation',
        'Cross-training plan and mentorship pairings'
      ]
    },
    comm_quality: {
      category: 'Criteria',
      deliverables: [
        'Communication protocols and channel guidelines',
        'Meeting effectiveness standards and templates',
        'Information-sharing cadence and formats'
      ]
    },
    goal_clarity: {
      category: 'Commitment & Change',
      deliverables: [
        'Vision board and strategic alignment workshop',
        'OKRs or goal-setting framework implementation',
        'Success metrics dashboard and tracking system'
      ]
    },
    coordination: {
      category: 'Change',
      deliverables: [
        'Workflow mapping and process documentation',
        'Coordination mechanisms and handoff protocols',
        'Task management system and visibility tools'
      ]
    },
    team_cognition: {
      category: 'Criteria',
      deliverables: [
        'Shared mental models workshop',
        'Problem-solving frameworks and decision-making protocols',
        'Team learning rituals and reflection practices'
      ]
    }
  };

  const results: {
    category: string;
    deliverables: string[];
    rationale: string;
  }[] = [];

  recommendedAreas.forEach(area => {
    const mapping = driverToDeliverables[area.id];
    if (mapping) {
      results.push({
        category: mapping.category,
        deliverables: mapping.deliverables,
        rationale: `${area.name} scored ${area.score.toFixed(1)}/7, indicating a ${area.gap > 0.3 ? 'significant' : 'moderate'} gap from optimal performance. Addressing this will improve team effectiveness in ${mapping.category}.`
      });
    }
  });

  return results;
}

/**
 * Calculate ROI for a specific training option
 * 
 * Formula:
 * - Half Day (1 driver): Improves 1/7th of total gap
 * - Full Day (2 drivers): Improves 2/7th of total gap  
 * - Month-Long (7 drivers): Improves full gap to 85% target
 */
export function calculateTrainingROI(
  trainingCost: number,
  annualCostOfDysfunction: number,
  currentReadiness: number,
  focusAreas: number,
  totalAreas: number = 7
): {
  cost: number;
  savings: number;
  roi: number;
  paybackMonths: number;
  improvementPercentage: number;
} {
  const target = 0.85;
  const currentScore = currentReadiness;
  
  // Calculate improvement based on focus areas
  // Each driver addressed contributes 1/7th of the total gap
  const totalGap = target - currentScore;
  const improvementPerDriver = totalGap / totalAreas;
  const totalImprovement = improvementPerDriver * focusAreas;
  
  // Calculate savings from dysfunction reduction
  const currentDysfunction = 1 - currentScore;
  const projectedSavings = annualCostOfDysfunction * (totalImprovement / currentDysfunction);
  
  // Calculate ROI metrics
  const roi = (projectedSavings - trainingCost) / trainingCost;
  const paybackMonths = projectedSavings > 0 ? (trainingCost / projectedSavings) * 12 : 999;
  
  return {
    cost: trainingCost,
    savings: projectedSavings,
    roi,
    paybackMonths,
    improvementPercentage: totalImprovement * 100
  };
}
