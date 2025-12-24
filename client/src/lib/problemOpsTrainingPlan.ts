// ProblemOps Training Plan Generator
// Based on the 4 C's framework and continuous problem-solving operations

import type { FourCsAnalysis } from './fourCsScoring';

export interface TrainingModule {
  title: string;
  description: string;
  exercises: string[];
  deliverables: string[];
  duration: string;
}

export interface TrainingPlan {
  criteria: TrainingModule;
  commitment: TrainingModule;
  collaboration: TrainingModule;
  change: TrainingModule;
  priorities: string[];
}

/**
 * Generate a comprehensive ProblemOps training plan based on 4 C's scores
 */
export function generateTrainingPlan(analysis: FourCsAnalysis): TrainingPlan {
  // Determine priorities based on gaps
  const priorities: string[] = [];
  if (analysis.gaps.criteria > 0.2) priorities.push('Criteria');
  if (analysis.gaps.commitment > 0.2) priorities.push('Commitment');
  if (analysis.gaps.collaboration > 0.2) priorities.push('Collaboration');
  if (analysis.gaps.change > 0.2) priorities.push('Change');
  
  return {
    criteria: {
      title: 'Building Shared Language (Criteria)',
      description: 'Develop a common understanding of problems, goals, and success criteria across your team. This foundation ensures everyone speaks the same language when discussing change.',
      exercises: [
        'Scenario Mapping Workshop: Gather the team to identify and document current scenarios that need to change. Use real examples from your daily work.',
        'Goals Alignment Session: Define what outcomes your team wants to achieve and what outcomes the business expects. Make sure everyone agrees.',
        'Success Criteria Definition: As a team, answer "How will we know when we\'ve succeeded?" Create measurable indicators.',
        'Expectations Mapping: List what team members and stakeholders expect to be in place to achieve goals. Compare and align expectations.',
        'Language Audit: Review your team\'s communication and identify words or concepts that mean different things to different people. Create a shared glossary.',
        'Problem Statement Practice: Write scenario-based problem statements together using the format: "When [scenario], [audience] experiences [problem] because [root cause]."',
      ],
      deliverables: [
        'Scenario-based problem statements',
        'Research insights document',
        'Current experience maps',
        'Positioning statements',
        'Shared glossary of terms',
        'Success measurement framework',
      ],
      duration: '2-3 weeks',
    },
    commitment: {
      title: 'Committing to Change (Commitment)',
      description: 'Unite your team around the most important work to tackle first. Build agreement on vision, scope, and priorities so everyone moves in the same direction.',
      exercises: [
        'Priority Voting: Present all identified problems. Have each team member vote on which scenarios to solve first and why.',
        'Vision Board Creation: Build a visual representation of what success looks like after the change. Include images, quotes, and key outcomes.',
        'Scope Definition Workshop: Define what\'s in scope for the first release and what comes later. Get explicit agreement from all stakeholders.',
        'Value Articulation: For each committed change, answer "Why is this meaningful?" Connect it to business goals and user needs.',
        'Use Case Development: Write detailed use cases for the scenarios you\'re committing to support after the change.',
        'Release Planning: Break the vision into releases. Define what you\'ll deliver in each release and when.',
      ],
      deliverables: [
        'Vision boards',
        'Release-level scope documents',
        'Strategy definition',
        'Success metrics dashboard',
        'Use case library',
        'Team agreements document',
      ],
      duration: '1-2 weeks',
    },
    collaboration: {
      title: 'Working Together (Collaboration)',
      description: 'Build systems for your team to collaborate effectively while implementing change. Show progress, track work, and iterate together.',
      exercises: [
        'Daily Standups: Meet for 15 minutes each day. Each person shares: What did I do? What will I do? What\'s blocking me?',
        'User Story Mapping: Break down the work into user stories. Map them on a wall or board so everyone sees the full picture.',
        'Task Flow Visualization: Draw how work flows through your team. Identify bottlenecks and handoff points.',
        'Backlog Grooming: Review and prioritize the backlog together weekly. Add detail to upcoming work.',
        'Show and Tell Sessions: Every week, demo working prototypes or code to the team. Get feedback early and often.',
        'Retrospectives: After each release, gather to discuss: What went well? What didn\'t? What should we change?',
      ],
      deliverables: [
        'User stories with acceptance criteria',
        'Task flows and process maps',
        'Prioritized backlogs',
        'Working prototypes',
        'Code and content',
        'Release tracking dashboard',
      ],
      duration: 'Ongoing (continuous)',
    },
    change: {
      title: 'Delivering and Measuring Change',
      description: 'Implement changes, measure their impact, and use what you learn to define the next round of improvements. Close the loop on continuous problem-solving.',
      exercises: [
        'Impact Measurement Planning: Before launching, define exactly what metrics you\'ll track to measure success.',
        'Testing Protocol Development: Create a plan for how you\'ll test the change before full launch. Include user testing and technical testing.',
        'Feedback Loop Setup: Build systems to collect feedback from users and stakeholders after launch. Make it easy for people to share.',
        'Post-Launch Review: One week after launch, gather data on impact. Compare actual results to expected results.',
        'End-to-End Experience Mapping: Map how the change affects the overall user experience. Identify new problems that emerged.',
        'Next Priorities Workshop: Use impact data to decide what to work on next. Start the cycle again with new criteria.',
      ],
      deliverables: [
        'Testing plans and results',
        'Feedback loops and surveys',
        'Impact measurement reports',
        'Iteration strategies',
        'Continuous improvement roadmap',
        'Lessons learned document',
      ],
      duration: '1-2 weeks per cycle',
    },
    priorities,
  };
}

/**
 * Convert normalized score (0-1) back to raw score (1-7)
 */
function denormalizeScore(normalizedScore: number): number {
  return normalizedScore * 6 + 1;
}

/**
 * Get urgency level based on raw score (1-7 scale)
 * - 1.0 - 2.5: Critical Risk
 * - 2.51 - 4.0: High Risk
 * - 4.01 - 5.5: Medium Risk
 * - 5.51 - 7.0: Low Risk
 */
function getUrgencyFromScore(normalizedScore: number): 'critical' | 'high' | 'medium' | 'low' {
  const rawScore = denormalizeScore(normalizedScore);
  if (rawScore <= 2.5) return 'critical';
  if (rawScore <= 4.0) return 'high';
  if (rawScore <= 5.5) return 'medium';
  return 'low';
}

/**
 * Get recommended focus areas based on 4 C's scores
 * Urgency is determined by the raw score thresholds:
 * - Critical Risk: 1.0 - 2.5
 * - High Risk: 2.51 - 4.0
 * - Medium Risk: 4.01 - 5.5
 * - Low Risk: 5.51 - 7.0
 */
export function getTrainingPriorities(analysis: FourCsAnalysis): Array<{ area: string; reason: string; urgency: 'critical' | 'high' | 'medium' | 'low' }> {
  const priorities: Array<{ area: string; reason: string; urgency: 'critical' | 'high' | 'medium' | 'low' }> = [];
  
  // Only include areas that are below target (85%)
  if (analysis.scores.criteria < analysis.target) {
    priorities.push({
      area: 'Criteria',
      reason: 'Your team lacks a shared language. Start here to build a foundation for all other improvements.',
      urgency: getUrgencyFromScore(analysis.scores.criteria),
    });
  }
  
  if (analysis.scores.commitment < analysis.target) {
    priorities.push({
      area: 'Commitment',
      reason: 'Your team struggles to align on priorities. Focus on building agreement around vision and scope.',
      urgency: getUrgencyFromScore(analysis.scores.commitment),
    });
  }
  
  if (analysis.scores.collaboration < analysis.target) {
    priorities.push({
      area: 'Collaboration',
      reason: 'Your team needs better systems for working together. Improve communication and coordination practices.',
      urgency: getUrgencyFromScore(analysis.scores.collaboration),
    });
  }
  
  if (analysis.scores.change < analysis.target) {
    priorities.push({
      area: 'Change',
      reason: 'Your team needs to close the loop on measuring impact. Build feedback systems to learn from changes.',
      urgency: getUrgencyFromScore(analysis.scores.change),
    });
  }
  
  // Sort by urgency: critical > high > medium > low
  const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  priorities.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
  
  return priorities;
}
