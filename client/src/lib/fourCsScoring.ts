// 4 C's Framework Scoring
// Maps assessment drivers to the 4 C's of ProblemOps

export interface FourCsScores {
  criteria: number;
  commitment: number;
  collaboration: number;
  change: number;
}

export interface FourCsGaps {
  criteria: number;
  commitment: number;
  collaboration: number;
  change: number;
}

export interface FourCsAnalysis {
  scores: FourCsScores;
  gaps: FourCsGaps;
  target: number;
}

/**
 * Calculate 4 C's scores from driver scores
 * 
 * Mapping:
 * - Criteria: Communication Quality
 * - Commitment: Goal Clarity
 * - Collaboration: Coordination, Trust, Psychological Safety, Transactive Memory
 * - Change: Goal Clarity, Coordination
 */
export function calculate4CsScores(driverScores: Record<string, number>): FourCsAnalysis {
  const TARGET = 0.85; // 85% target for all 4 C's
  
  // Normalize scores to 0-1 scale (drivers are 1-7)
  const normalize = (score: number) => (score - 1) / 6;
  
  // Criteria: Communication Quality only
  const criteriaScore = normalize(driverScores['Communication Quality'] || 1);
  
  // Commitment: Goal Clarity only
  const commitmentScore = normalize(driverScores['Goal Clarity'] || 1);
  
  // Collaboration: Average of Coordination, Trust, Psych Safety, TMS
  const collaborationDrivers = [
    driverScores['Coordination'] || 1,
    driverScores['Trust'] || 1,
    driverScores['Psychological Safety'] || 1,
    driverScores['Transactive Memory'] || 1,
  ];
  const collaborationScore = collaborationDrivers.reduce((sum, score) => sum + normalize(score), 0) / collaborationDrivers.length;
  
  // Change: Average of Goal Clarity and Coordination
  const changeDrivers = [
    driverScores['Goal Clarity'] || 1,
    driverScores['Coordination'] || 1,
  ];
  const changeScore = changeDrivers.reduce((sum, score) => sum + normalize(score), 0) / changeDrivers.length;
  
  const scores: FourCsScores = {
    criteria: criteriaScore,
    commitment: commitmentScore,
    collaboration: collaborationScore,
    change: changeScore,
  };
  
  const gaps: FourCsGaps = {
    criteria: TARGET - criteriaScore,
    commitment: TARGET - commitmentScore,
    collaboration: TARGET - collaborationScore,
    change: TARGET - changeScore,
  };
  
  return {
    scores,
    gaps,
    target: TARGET,
  };
}

/**
 * Get priority areas based on 4 C's gaps
 * Returns C's sorted by gap size (largest first)
 */
export function get4CsPriorities(analysis: FourCsAnalysis): Array<{ name: string; gap: number; score: number }> {
  const priorities = [
    { name: 'Criteria', gap: analysis.gaps.criteria, score: analysis.scores.criteria },
    { name: 'Commitment', gap: analysis.gaps.commitment, score: analysis.scores.commitment },
    { name: 'Collaboration', gap: analysis.gaps.collaboration, score: analysis.scores.collaboration },
    { name: 'Change', gap: analysis.gaps.change, score: analysis.scores.change },
  ];
  
  return priorities.sort((a, b) => b.gap - a.gap);
}

/**
 * All ProblemOps deliverables organized by the 4 C's
 */
export const ALL_DELIVERABLES: Record<string, string[]> = {
  'Criteria': [
    'Scenario-based problem statements',
    'Research insights',
    'Current experience maps',
    'Positioning statements',
    'Unique value propositions',
  ],
  'Commitment': [
    'Vision boards',
    'Release-level scope of outcomes',
    'Strategy definition',
    'Success metrics',
    'Team agreements',
  ],
  'Collaboration': [
    'User stories',
    'Acceptance criteria',
    'Task flows',
    'Backlogs',
    'Prototypes and working code',
  ],
  'Change': [
    'Testing plans',
    'Feedback loops',
    'Impact measurements',
    'Iteration strategies',
    'Continuous improvement cycles',
  ],
};

/**
 * Get recommended ProblemOps deliverables based on 4 C's scores
 */
export function getRecommendedDeliverables(analysis: FourCsAnalysis): Record<string, string[]> {
  const recommendations: Record<string, string[]> = {};
  
  // Low Criteria (< 60%) → Focus on Discovery deliverables
  if (analysis.scores.criteria < 0.6) {
    recommendations['Criteria'] = ALL_DELIVERABLES['Criteria'];
  }
  
  // Low Commitment (< 60%) → Focus on Vision & Scope deliverables
  if (analysis.scores.commitment < 0.6) {
    recommendations['Commitment'] = ALL_DELIVERABLES['Commitment'];
  }
  
  // Low Collaboration (< 60%) → Focus on Requirements & Install deliverables
  if (analysis.scores.collaboration < 0.6) {
    recommendations['Collaboration'] = ALL_DELIVERABLES['Collaboration'];
  }
  
  // Low Change (< 60%) → Focus on Test & Launch deliverables
  if (analysis.scores.change < 0.6) {
    recommendations['Change'] = ALL_DELIVERABLES['Change'];
  }
  
  return recommendations;
}

/**
 * Get all other deliverables (not recommended based on scores)
 */
export function getOtherDeliverables(analysis: FourCsAnalysis): Record<string, string[]> {
  const others: Record<string, string[]> = {};
  
  // Include deliverables for C's that are NOT recommended (score >= 60%)
  if (analysis.scores.criteria >= 0.6) {
    others['Criteria'] = ALL_DELIVERABLES['Criteria'];
  }
  
  if (analysis.scores.commitment >= 0.6) {
    others['Commitment'] = ALL_DELIVERABLES['Commitment'];
  }
  
  if (analysis.scores.collaboration >= 0.6) {
    others['Collaboration'] = ALL_DELIVERABLES['Collaboration'];
  }
  
  if (analysis.scores.change >= 0.6) {
    others['Change'] = ALL_DELIVERABLES['Change'];
  }
  
  return others;
}

/**
 * Get recommended deliverables based on training type and 4 C's priorities
 */
export function getRecommendedDeliverablesByTraining(
  analysis: FourCsAnalysis,
  trainingType: 'half-day' | 'full-day' | 'month-long' | 'not-sure'
): Record<string, string[]> {
  // Get all C's with gaps (score < 60%), sorted by priority
  const priorities = get4CsPriorities(analysis).filter(p => p.score < 0.6);
  
  // Determine how many priorities to show based on training type
  let countToShow: number;
  switch (trainingType) {
    case 'half-day':
      countToShow = 1;
      break;
    case 'full-day':
      countToShow = 2;
      break;
    case 'month-long':
    case 'not-sure':
      countToShow = priorities.length; // Show all
      break;
    default:
      countToShow = priorities.length;
  }
  
  // Build recommended deliverables from top N priorities
  const recommended: Record<string, string[]> = {};
  const topPriorities = priorities.slice(0, countToShow);
  
  for (const priority of topPriorities) {
    recommended[priority.name] = ALL_DELIVERABLES[priority.name];
  }
  
  return recommended;
}

/**
 * Get other deliverables (not in recommended) based on training type
 */
export function getOtherDeliverablesByTraining(
  analysis: FourCsAnalysis,
  trainingType: 'half-day' | 'full-day' | 'month-long' | 'not-sure'
): Record<string, string[]> {
  // Get all C's with gaps (score < 60%), sorted by priority
  const priorities = get4CsPriorities(analysis).filter(p => p.score < 0.6);
  
  // Determine how many priorities are in recommended
  let countInRecommended: number;
  switch (trainingType) {
    case 'half-day':
      countInRecommended = 1;
      break;
    case 'full-day':
      countInRecommended = 2;
      break;
    case 'month-long':
    case 'not-sure':
      countInRecommended = priorities.length; // All are recommended
      break;
    default:
      countInRecommended = priorities.length;
  }
  
  const others: Record<string, string[]> = {};
  
  // Add C's with gaps that are NOT in recommended (lower priorities)
  const lowerPriorities = priorities.slice(countInRecommended);
  for (const priority of lowerPriorities) {
    others[priority.name] = ALL_DELIVERABLES[priority.name];
  }
  
  // Add C's without gaps (score >= 60%)
  const allCs = ['Criteria', 'Commitment', 'Collaboration', 'Change'];
  for (const c of allCs) {
    const score = analysis.scores[c.toLowerCase() as keyof FourCsScores];
    if (score >= 0.6) {
      others[c] = ALL_DELIVERABLES[c];
    }
  }
  
  return others;
}
