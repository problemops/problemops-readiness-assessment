/**
 * Driver Impact Content Utility
 * 
 * Research-backed narratives showing how each driver's score impacts team waste
 * or contributes to team efficiency. Based on meta-analyses and academic literature.
 */

export type SeverityLevel = 'critical' | 'high' | 'moderate' | 'low' | 'strength';

export interface WasteOutcome {
  category: string;
  description: string;
  icon: 'bug' | 'ticket' | 'rework' | 'clock' | 'chart' | 'debt' | 'check';
}

export interface AcademicCitation {
  authors: string;
  year: number;
  finding: string;
  correlation?: number;
  varianceExplained?: number;
}

export interface DriverImpactNarrative {
  driverName: string;
  driverKey: string;
  score: number;
  severityLevel: SeverityLevel;
  severityLabel: string;
  behavioralConsequences: string[];
  wasteOutcomes: WasteOutcome[];
  citation: AcademicCitation;
  summaryStatement: string;
}

/**
 * Get severity level based on score
 */
export function getSeverityLevel(score: number): SeverityLevel {
  if (score <= 2) return 'critical';
  if (score <= 4) return 'high';
  if (score <= 5) return 'moderate';
  if (score < 6) return 'low';
  return 'strength';
}

/**
 * Get severity label for display
 */
export function getSeverityLabel(severity: SeverityLevel): string {
  switch (severity) {
    case 'critical': return 'Critical Dysfunction';
    case 'high': return 'High Risk';
    case 'moderate': return 'Moderate Concern';
    case 'low': return 'Low Risk';
    case 'strength': return 'Team Strength';
    default: return 'Unknown';
  }
}

/**
 * Academic citations for each driver
 */
const CITATIONS: Record<string, AcademicCitation> = {
  trust: {
    authors: 'Morrissette & Kisamore',
    year: 2020,
    finding: 'Trust is the strongest predictor of team performance',
    correlation: 0.48,
    varianceExplained: 23
  },
  communication: {
    authors: 'Marlow et al.',
    year: 2018,
    finding: 'Communication quality is 89% more powerful than frequency',
    correlation: 0.36
  },
  goalAlignment: {
    authors: 'Yin et al.',
    year: 2023,
    finding: 'Unclear business objectives are the #1 barrier to cross-functional collaboration',
    correlation: 0.40
  },
  psychologicalSafety: {
    authors: 'Kim et al.',
    year: 2020,
    finding: 'Psychological safety enables learning behavior which drives team efficacy'
  },
  conflictResolution: {
    authors: 'De Dreu & Weingart',
    year: 2003,
    finding: 'Both task and relationship conflict negatively impact team performance',
    correlation: -0.23
  },
  roleClarity: {
    authors: 'DeChurch & Mesmer-Magnus',
    year: 2010,
    finding: 'Transactive Memory Systems (knowing who knows what) strongly predict performance',
    correlation: 0.44,
    varianceExplained: 19.4
  },
  decisionMaking: {
    authors: 'Han et al.',
    year: 2018,
    finding: 'Leadership effectiveness is fully mediated through coordination and knowledge sharing'
  }
};

/**
 * Negative impact content for low scores (1-4)
 */
const NEGATIVE_CONTENT: Record<string, {
  behaviors: string[];
  wastes: WasteOutcome[];
  summary: (score: number) => string;
}> = {
  trust: {
    behaviors: [
      'Team members hoard information instead of sharing openly',
      'Problems are hidden rather than escalated early',
      'A blame culture prevents learning from mistakes',
      'People struggle alone instead of asking for help when stuck'
    ],
    wastes: [
      { category: 'Bugs', description: 'More defects reach production because problems are hidden until too late', icon: 'bug' },
      { category: 'Cycle Time', description: 'Longer development cycles as team members struggle alone instead of collaborating', icon: 'clock' },
      { category: 'Support Tickets', description: 'Higher ticket volume because issues aren\'t caught internally', icon: 'ticket' },
      { category: 'Repeated Errors', description: 'Same mistakes happen repeatedly without a learning culture', icon: 'rework' }
    ],
    summary: (score) => `With trust at ${score}/7, your team is likely experiencing significant information silos and blame dynamics that directly translate to hidden defects and extended cycle times.`
  },
  communication: {
    behaviors: [
      'Requirements are frequently misunderstood or incomplete',
      'Handoffs between team members fail or lose critical context',
      'Specifications lack the clarity needed to build correctly',
      'Important information gets lost in translation between functions'
    ],
    wastes: [
      { category: 'Rework', description: 'Extensive rebuilding required when the wrong thing gets built', icon: 'rework' },
      { category: 'Bugs', description: 'More defects from unclear or incomplete specifications', icon: 'bug' },
      { category: 'Support Tickets', description: 'Customer-facing errors from miscommunication', icon: 'ticket' },
      { category: 'Longer Development', description: 'Extended timelines from clarification cycles', icon: 'clock' }
    ],
    summary: (score) => `Communication quality at ${score}/7 means your team is likely building the wrong thing, requiring extensive rework and generating defects from unclear specifications.`
  },
  goalAlignment: {
    behaviors: [
      'Team members work on conflicting or misaligned priorities',
      'Deliverables don\'t integrate properly because they serve different objectives',
      'Scope creeps continuously without clear boundaries',
      'Features get built that don\'t actually serve business objectives'
    ],
    wastes: [
      { category: 'Wasted Effort', description: 'Significant work invested in wrong priorities', icon: 'chart' },
      { category: 'Integration Failures', description: 'Components don\'t work together, requiring rework', icon: 'rework' },
      { category: 'Extended Timeframes', description: 'Scope creep pushes deadlines further out', icon: 'clock' },
      { category: 'Feature Rebuilds', description: 'Entire features rebuilt when direction was wrong', icon: 'rework' }
    ],
    summary: (score) => `With goal alignment at ${score}/7, your team members are likely rowing in different directions, wasting effort on conflicting priorities and building features that miss the mark.`
  },
  psychologicalSafety: {
    behaviors: [
      'Problems are hidden instead of raised early when they\'re easier to fix',
      'Concerns about quality or technical risks go unspoken',
      'Mistakes are covered up rather than learned from',
      'Difficult but necessary conversations are avoided'
    ],
    wastes: [
      { category: 'Production Bugs', description: 'Defects reach customers because no one felt safe flagging issues', icon: 'bug' },
      { category: 'Technical Debt', description: 'Concerns about shortcuts go unraised, accumulating debt', icon: 'debt' },
      { category: 'Repeated Errors', description: 'Same mistakes recur because there\'s no learning from failure', icon: 'rework' },
      { category: 'Escalating Conflicts', description: 'Avoided conversations become bigger problems', icon: 'ticket' }
    ],
    summary: (score) => `Psychological safety at ${score}/7 means your team is likely hiding problems until they become crises, allowing bugs to reach production and technical debt to accumulate unchecked.`
  },
  conflictResolution: {
    behaviors: [
      'The team fragments into competing factions or cliques',
      'Defensive behaviors replace genuine collaboration',
      'Information is withheld between subgroups',
      'Decisions are delayed or avoided to prevent confrontation'
    ],
    wastes: [
      { category: 'Coordination Failures', description: 'Fragmented team can\'t coordinate effectively', icon: 'rework' },
      { category: 'Quality Issues', description: 'Defensive work produces lower quality code', icon: 'bug' },
      { category: 'Extended Cycle Times', description: 'Decision paralysis slows everything down', icon: 'clock' },
      { category: 'Information Gaps', description: 'Withheld information creates defects', icon: 'ticket' }
    ],
    summary: (score) => `With conflict resolution at ${score}/7, your team is likely fragmenting into factions, with information silos and defensive behaviors that undermine quality and coordination.`
  },
  roleClarity: {
    behaviors: [
      'Questions go to the wrong people, causing delays',
      'Work gets duplicated because ownership is unclear',
      'Expertise isn\'t leveraged effectively across the team',
      'Tasks fall through cracks with no clear owner'
    ],
    wastes: [
      { category: 'Delays', description: 'Time lost routing questions to wrong people', icon: 'clock' },
      { category: 'Duplicated Work', description: 'Multiple people doing the same work unknowingly', icon: 'rework' },
      { category: 'Reinvented Solutions', description: 'Expertise not found, so solutions are recreated', icon: 'chart' },
      { category: 'Dropped Tasks', description: 'Work falls through cracks, creating defects', icon: 'bug' }
    ],
    summary: (score) => `Role clarity at ${score}/7 means your team doesn\'t know who knows what, leading to duplicated effort, misdirected questions, and tasks falling through the cracks.`
  },
  decisionMaking: {
    behaviors: [
      'Decisions take too long or simply don\'t get made',
      'Decision authority is unclear, causing confusion',
      'Past decisions are relitigated repeatedly in meetings',
      'Wrong decisions get made without proper input from the right people'
    ],
    wastes: [
      { category: 'Rework', description: 'Wrong direction requires complete rebuilds', icon: 'rework' },
      { category: 'Blocked Work', description: 'Teams wait idle for decisions that don\'t come', icon: 'clock' },
      { category: 'Missed Deadlines', description: 'Decision paralysis causes schedule slips', icon: 'chart' },
      { category: 'Wasted Meeting Time', description: 'Same debates happen repeatedly', icon: 'clock' }
    ],
    summary: (score) => `Decision making at ${score}/7 means your team is likely stuck in decision paralysis, with blocked work, missed deadlines, and endless relitigating of past choices.`
  }
};

/**
 * Positive impact content for high scores (6-7)
 */
const POSITIVE_CONTENT: Record<string, {
  behaviors: string[];
  outcomes: WasteOutcome[];
  summary: (score: number) => string;
}> = {
  trust: {
    behaviors: [
      'Team members share information openly and proactively',
      'Problems are escalated early before they become crises',
      'A learning culture means mistakes become improvement opportunities',
      'Team members ask for help freely, accelerating problem resolution'
    ],
    outcomes: [
      { category: 'Early Detection', description: 'Fewer bugs reach production because issues are raised early', icon: 'check' },
      { category: 'Faster Cycles', description: 'Collaborative problem-solving reduces cycle times', icon: 'clock' },
      { category: 'Quality Built In', description: 'Lower support ticket volume from proactive quality', icon: 'check' },
      { category: 'Continuous Improvement', description: 'Team learns and improves from every experience', icon: 'chart' }
    ],
    summary: (score) => `With trust at ${score}/7, your team shares openly, escalates early, and learns continuously—this is a significant strength that reduces defects and accelerates delivery.`
  },
  communication: {
    behaviors: [
      'Your team speaks the same language across functions',
      'Requirements are clearly understood by everyone involved',
      'Handoffs between team members are smooth and complete',
      'Specifications are detailed enough to build right the first time'
    ],
    outcomes: [
      { category: 'First-Time Quality', description: 'Work is done right the first time, minimal rework', icon: 'check' },
      { category: 'Higher Throughput', description: 'More work completed per iteration', icon: 'chart' },
      { category: 'On-Time Delivery', description: 'Results delivered when expected', icon: 'clock' },
      { category: 'Lower Defects', description: 'Clear specs mean fewer bugs', icon: 'check' }
    ],
    summary: (score) => `Communication quality at ${score}/7 means your team speaks the same language, builds right the first time, and achieves higher throughput—a major competitive advantage.`
  },
  goalAlignment: {
    behaviors: [
      'Everyone is rowing in the same direction toward shared objectives',
      'Priorities are clear and consistently understood across the team',
      'Deliverables integrate smoothly because they serve the same goals',
      'Scope is well-defined with clear, respected boundaries'
    ],
    outcomes: [
      { category: 'Focused Effort', description: 'All work contributes to the right priorities', icon: 'check' },
      { category: 'Smooth Integration', description: 'Components work together seamlessly', icon: 'chart' },
      { category: 'Predictable Timelines', description: 'No scope creep, deadlines are met', icon: 'clock' },
      { category: 'Business Value', description: 'Features directly serve business objectives', icon: 'check' }
    ],
    summary: (score) => `With goal alignment at ${score}/7, your team is unified in direction, delivering focused work that integrates smoothly and directly serves business objectives.`
  },
  psychologicalSafety: {
    behaviors: [
      'Problems are raised early and openly when they\'re easiest to fix',
      'Team members voice concerns about quality without fear',
      'Mistakes become learning opportunities, not blame events',
      'Difficult conversations happen constructively'
    ],
    outcomes: [
      { category: 'Early Bug Detection', description: 'Issues caught before reaching production', icon: 'check' },
      { category: 'Managed Tech Debt', description: 'Concerns raised and addressed proactively', icon: 'chart' },
      { category: 'Learning Culture', description: 'Errors don\'t repeat because team learns', icon: 'check' },
      { category: 'Healthy Debate', description: 'Constructive disagreement improves solutions', icon: 'check' }
    ],
    summary: (score) => `Psychological safety at ${score}/7 means your team catches problems early, learns from mistakes, and engages in healthy debate—creating a foundation for continuous improvement.`
  },
  conflictResolution: {
    behaviors: [
      'Disagreements become productive discussions that improve outcomes',
      'The team stays unified even when perspectives differ',
      'Information flows freely without factional barriers',
      'Decisions are made efficiently with healthy input from all'
    ],
    outcomes: [
      { category: 'Strong Coordination', description: 'Unified team coordinates effectively', icon: 'check' },
      { category: 'High Quality', description: 'Collaborative work produces better code', icon: 'chart' },
      { category: 'Fast Decisions', description: 'No paralysis, decisions happen efficiently', icon: 'clock' },
      { category: 'Open Information', description: 'Free information flow prevents defects', icon: 'check' }
    ],
    summary: (score) => `With conflict resolution at ${score}/7, your team transforms disagreements into better solutions, maintaining unity and coordination even through challenging discussions.`
  },
  roleClarity: {
    behaviors: [
      'Everyone knows who does what and who knows what',
      'Questions go directly to the right expert immediately',
      'No duplicated effort—each person owns their domain clearly',
      'Expertise is leveraged effectively across the entire team'
    ],
    outcomes: [
      { category: 'Fast Resolution', description: 'Direct expert access speeds everything up', icon: 'clock' },
      { category: 'No Duplication', description: 'Clear ownership eliminates redundant work', icon: 'check' },
      { category: 'Best Solutions', description: 'Right expertise applied to right problems', icon: 'chart' },
      { category: 'Nothing Dropped', description: 'Clear ownership means nothing falls through', icon: 'check' }
    ],
    summary: (score) => `Role clarity at ${score}/7 means your team knows exactly who knows what, eliminating duplicated effort and ensuring the right expertise is applied to every challenge.`
  },
  decisionMaking: {
    behaviors: [
      'Decisions happen quickly with the right input from the right people',
      'Decision authority is clear—no ambiguity about who decides what',
      'Past decisions are documented, respected, and not relitigated',
      'The right people are consulted efficiently without bottlenecks'
    ],
    outcomes: [
      { category: 'Unblocked Work', description: 'No waiting for decisions, work flows smoothly', icon: 'clock' },
      { category: 'Met Deadlines', description: 'Efficient decisions keep schedules on track', icon: 'check' },
      { category: 'No Relitigation', description: 'Decisions stick, no wasted debate time', icon: 'check' },
      { category: 'Quality Decisions', description: 'Right input leads to right choices', icon: 'chart' }
    ],
    summary: (score) => `Decision making at ${score}/7 means your team makes quality decisions quickly with clear authority, keeping work flowing and deadlines on track.`
  }
};

/**
 * Moderate impact content for score of 5
 */
const MODERATE_CONTENT: Record<string, {
  summary: (score: number) => string;
}> = {
  trust: {
    summary: (score) => `Trust at ${score}/7 shows room for improvement. Some information sharing may be inconsistent, and team members might occasionally hesitate to ask for help. With focused effort, this could become a strength.`
  },
  communication: {
    summary: (score) => `Communication quality at ${score}/7 indicates some miscommunication is occurring, though not critically. Requirements may sometimes need clarification. Targeted improvement here could significantly boost throughput.`
  },
  goalAlignment: {
    summary: (score) => `Goal alignment at ${score}/7 suggests priorities are mostly clear but may occasionally conflict. Some scope creep might occur. Strengthening alignment could reduce wasted effort.`
  },
  psychologicalSafety: {
    summary: (score) => `Psychological safety at ${score}/7 means team members sometimes hesitate to raise concerns. Some problems may go unreported longer than ideal. Building more safety could catch issues earlier.`
  },
  conflictResolution: {
    summary: (score) => `Conflict resolution at ${score}/7 indicates disagreements are sometimes handled well, sometimes not. Some tension may linger unresolved. Improving this could strengthen team coordination.`
  },
  roleClarity: {
    summary: (score) => `Role clarity at ${score}/7 shows some ambiguity about who owns what. Questions occasionally go to wrong people. Clarifying roles could eliminate duplicated effort.`
  },
  decisionMaking: {
    summary: (score) => `Decision making at ${score}/7 suggests decisions sometimes take longer than needed. Some ambiguity about authority may exist. Streamlining decisions could accelerate delivery.`
  }
};

/**
 * Driver display names
 */
const DRIVER_NAMES: Record<string, string> = {
  trust: 'Trust',
  communication: 'Communication Quality',
  goalAlignment: 'Goal Alignment',
  psychologicalSafety: 'Psychological Safety',
  conflictResolution: 'Conflict Resolution',
  roleClarity: 'Role Clarity',
  decisionMaking: 'Decision Making'
};

/**
 * Generate impact narrative for a single driver
 */
export function generateDriverImpact(driverKey: string, score: number): DriverImpactNarrative {
  const severity = getSeverityLevel(score);
  const severityLabel = getSeverityLabel(severity);
  const citation = CITATIONS[driverKey] || { authors: 'Research Team', year: 2024, finding: 'Team effectiveness research' };
  const driverName = DRIVER_NAMES[driverKey] || driverKey;

  // Handle unknown driver keys gracefully
  const hasContent = NEGATIVE_CONTENT[driverKey] && POSITIVE_CONTENT[driverKey];
  if (!hasContent) {
    return {
      driverName,
      driverKey,
      score,
      severityLevel: severity,
      severityLabel,
      behavioralConsequences: ['Team dynamics may be affected'],
      wasteOutcomes: [{ category: 'General', description: 'Potential impact on team performance', icon: 'chart' as const }],
      citation,
      summaryStatement: `This driver scored ${score}/7.`
    };
  }

  if (severity === 'strength') {
    const content = POSITIVE_CONTENT[driverKey];
    return {
      driverName,
      driverKey,
      score,
      severityLevel: severity,
      severityLabel,
      behavioralConsequences: content.behaviors,
      wasteOutcomes: content.outcomes,
      citation,
      summaryStatement: content.summary(score)
    };
  } else if (severity === 'low') {
    // Low risk - show minimal concerns
    const negContent = NEGATIVE_CONTENT[driverKey];
    const modContent = MODERATE_CONTENT[driverKey];
    return {
      driverName,
      driverKey,
      score,
      severityLevel: severity,
      severityLabel,
      behavioralConsequences: negContent.behaviors.slice(0, 1),
      wasteOutcomes: negContent.wastes.slice(0, 1),
      citation,
      summaryStatement: modContent?.summary(score) || `This driver at ${score}/7 shows room for improvement.`
    };
  } else if (severity === 'moderate') {
    const negContent = NEGATIVE_CONTENT[driverKey];
    const modContent = MODERATE_CONTENT[driverKey];
    return {
      driverName,
      driverKey,
      score,
      severityLevel: severity,
      severityLabel,
      behavioralConsequences: negContent.behaviors.slice(0, 2),
      wasteOutcomes: negContent.wastes.slice(0, 2),
      citation,
      summaryStatement: modContent.summary(score)
    };
  } else {
    // Critical or high severity
    const content = NEGATIVE_CONTENT[driverKey];
    return {
      driverName,
      driverKey,
      score,
      severityLevel: severity,
      severityLabel,
      behavioralConsequences: content.behaviors,
      wasteOutcomes: content.wastes,
      citation,
      summaryStatement: content.summary(score)
    };
  }
}

/**
 * Generate complete team story with all driver impacts
 */
export function generateTeamStory(drivers: Record<string, number>): {
  narrative: string;
  driverImpacts: DriverImpactNarrative[];
  strengths: DriverImpactNarrative[];
  concerns: DriverImpactNarrative[];
  overallSeverity: SeverityLevel;
} {
  // Map from database driver IDs to content driver keys
  const driverMapping: Record<string, string> = {
    'trust': 'trust',
    'psych_safety': 'psychologicalSafety',
    'tms': 'roleClarity', // Transactive Memory = knowing who knows what
    'comm_quality': 'communication',
    'goal_clarity': 'goalAlignment',
    'coordination': 'conflictResolution', // Coordination issues often stem from conflict
    'team_cognition': 'decisionMaking' // Team cognition = collective decision making
  };
  
  // Convert database driver IDs to content driver keys and generate impacts
  const impacts: DriverImpactNarrative[] = [];
  Object.entries(drivers).forEach(([dbKey, score]) => {
    const contentKey = driverMapping[dbKey];
    if (contentKey) {
      impacts.push(generateDriverImpact(contentKey, score));
    }
  });
  
  // Separate strengths and concerns
  const strengths = impacts.filter(i => i.severityLevel === 'strength');
  const concerns = impacts.filter(i => i.severityLevel !== 'strength');
  
  // Sort concerns by severity (critical first)
  concerns.sort((a, b) => {
    const severityOrder: Record<SeverityLevel, number> = { critical: 0, high: 1, moderate: 2, low: 3, strength: 4 };
    return severityOrder[a.severityLevel] - severityOrder[b.severityLevel];
  });

  // Determine overall severity
  let overallSeverity: SeverityLevel = 'strength';
  if (concerns.some(c => c.severityLevel === 'critical')) {
    overallSeverity = 'critical';
  } else if (concerns.some(c => c.severityLevel === 'high')) {
    overallSeverity = 'high';
  } else if (concerns.some(c => c.severityLevel === 'moderate')) {
    overallSeverity = 'moderate';
  } else if (concerns.some(c => c.severityLevel === 'low')) {
    overallSeverity = 'low';
  }

  // Generate narrative
  let narrative = '';
  
  if (strengths.length > 0) {
    narrative += `**Your team shows strength in ${strengths.map(s => s.driverName.toLowerCase()).join(', ')}**, which provides a solid foundation. `;
    narrative += strengths.map(s => s.summaryStatement).join(' ') + '\n\n';
  }
  
  if (concerns.length > 0) {
    const criticalConcerns = concerns.filter(c => c.severityLevel === 'critical' || c.severityLevel === 'high');
    if (criticalConcerns.length > 0) {
      narrative += `**However, there are significant concerns** that are likely contributing to waste and inefficiency. `;
      narrative += criticalConcerns.map(c => c.summaryStatement).join(' ') + '\n\n';
    }
    
    const moderateConcerns = concerns.filter(c => c.severityLevel === 'moderate');
    if (moderateConcerns.length > 0) {
      narrative += `**Areas with room for improvement:** `;
      narrative += moderateConcerns.map(c => c.summaryStatement).join(' ');
    }
  }

  return {
    narrative: narrative.trim(),
    driverImpacts: impacts,
    strengths,
    concerns,
    overallSeverity
  };
}

/**
 * Get color class for severity level
 */
export function getSeverityColorClass(severity: SeverityLevel): string {
  switch (severity) {
    case 'critical': return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
    case 'high': return 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800';
    case 'moderate': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';
    case 'low': return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
    case 'strength': return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
    default: return 'bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800';
  }
}

/**
 * Get text color class for severity level
 */
export function getSeverityTextClass(severity: SeverityLevel): string {
  switch (severity) {
    case 'critical': return 'text-red-700 dark:text-red-300';
    case 'high': return 'text-orange-700 dark:text-orange-300';
    case 'moderate': return 'text-yellow-700 dark:text-yellow-300';
    case 'low': return 'text-blue-700 dark:text-blue-300';
    case 'strength': return 'text-green-700 dark:text-green-300';
    default: return 'text-gray-700 dark:text-gray-300';
  }
}

/**
 * Get badge color class for severity level
 */
export function getSeverityBadgeClass(severity: SeverityLevel): string {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'strength': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
}
