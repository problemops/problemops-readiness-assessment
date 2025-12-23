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
 * Get recommended focus areas based on 4 C's scores
 */
export function getTrainingPriorities(analysis: FourCsAnalysis): Array<{ area: string; reason: string; urgency: 'high' | 'medium' | 'low' }> {
  const priorities: Array<{ area: string; reason: string; urgency: 'high' | 'medium' | 'low' }> = [];
  
  if (analysis.scores.criteria < 0.6) {
    priorities.push({
      area: 'Criteria',
      reason: 'Your team lacks a shared language. Start here to build a foundation for all other improvements.',
      urgency: 'high',
    });
  }
  
  if (analysis.scores.commitment < 0.6) {
    priorities.push({
      area: 'Commitment',
      reason: 'Your team struggles to align on priorities. Focus on building agreement around vision and scope.',
      urgency: analysis.scores.criteria < 0.6 ? 'medium' : 'high',
    });
  }
  
  if (analysis.scores.collaboration < 0.6) {
    priorities.push({
      area: 'Collaboration',
      reason: 'Your team needs better systems for working together. Improve communication and coordination practices.',
      urgency: 'medium',
    });
  }
  
  if (analysis.scores.change < 0.6) {
    priorities.push({
      area: 'Change',
      reason: 'Your team needs to close the loop on measuring impact. Build feedback systems to learn from changes.',
      urgency: 'medium',
    });
  }
  
  return priorities;
}
