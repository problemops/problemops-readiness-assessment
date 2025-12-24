import { DRIVER_CLUSTERS } from "./resultsGenerator";

export type TrainingModule = {
  phase: string;
  title: string;
  description: string;
  activities: string[];
  outcomes: string[];
  duration: string;
};

export type ClusterPlan = {
  clusterId: string;
  clusterName: string;
  clusterDescription: string;
  priority: "high" | "medium" | "low";
  averageScore: number;
  modules: TrainingModule[];
};

// The 4 C's of ProblemOps training modules
const FOUR_CS_MODULES = {
  criterion: {
    phase: "1. Criterion",
    title: "Develop Shared Language",
    description: "Build common understanding of current scenarios, desired outcomes, and success criteria",
    activities: [
      "Facilitate scenario mapping workshops where team members describe current pain points in their own words",
      "Create a shared glossary of terms specific to your team's work context",
      "Define expected outcomes using concrete, observable criteria",
      "Identify consequences the team is trying to avoid",
      "Establish how success will be measured for each outcome",
    ],
    outcomes: [
      "Team speaks a common language about problems and solutions",
      "Clear, shared understanding of what needs to change",
      "Defined success metrics everyone agrees on",
    ],
    duration: "2-3 weeks",
  },
  commit: {
    phase: "2. Commit",
    title: "Agree to Work Together",
    description: "Build consensus on which problems to tackle first and commit to collaborative action",
    activities: [
      "Prioritize scenario-based problems using impact/effort matrix",
      "Create explicit agreements about which outcomes to pursue now vs. later",
      "Define scope of work and boundaries for the intervention",
      "Establish team working agreements and decision-making protocols",
      "Secure commitment from all stakeholders to participate actively",
    ],
    outcomes: [
      "Clear prioritization of what to address first",
      "Explicit commitments from all team members",
      "Shared ownership of the change process",
    ],
    duration: "1-2 weeks",
  },
  collaborate: {
    phase: "3. Collaborate",
    title: "Work Together with Visibility",
    description: "Unite the team and provide transparency into progress, involving everyone in the work",
    activities: [
      "Establish regular check-ins with visible progress tracking",
      "Use 'show, don't tell' methods—demos, prototypes, working sessions",
      "Involve business stakeholders in the work, not just status updates",
      "Create feedback loops that allow course correction",
      "Build cross-functional pairing or collaboration rituals",
    ],
    outcomes: [
      "High visibility into work and progress",
      "Active involvement from all functions",
      "Rapid feedback and adaptation",
    ],
    duration: "4-6 weeks (ongoing)",
  },
  change: {
    phase: "4. Change",
    title: "Implement and Learn",
    description: "Measure impact, learn from results, and define the next cycle of improvement",
    activities: [
      "Define what you're trying to learn from each change",
      "Measure outcomes against success criteria from Criterion phase",
      "Collect qualitative feedback on what worked and what didn't",
      "Use retrospectives to extract lessons and insights",
      "Define next round of changes based on data and learning",
    ],
    outcomes: [
      "Clear understanding of impact made",
      "Data-driven insights for next iteration",
      "Continuous improvement mindset established",
    ],
    duration: "2-3 weeks (per cycle)",
  },
};

// Cluster-specific focus areas
const CLUSTER_FOCUS = {
  foundation: {
    criterion: "Define what trust and psychological safety look like in your specific context. What behaviors demonstrate trust? What makes it safe to speak up?",
    commit: "Commit to vulnerability-based trust exercises and creating explicit psychological safety norms.",
    collaborate: "Practice giving and receiving feedback, share personal working styles, conduct trust-building activities.",
    change: "Measure trust levels through pulse surveys, track instances of speaking up, celebrate vulnerability.",
  },
  knowledge: {
    criterion: "Map who knows what on your team. Define what 'good communication' means—clarity, timeliness, shared understanding.",
    commit: "Commit to creating a team expertise directory and establishing communication protocols.",
    collaborate: "Build shared mental models through collaborative documentation, knowledge-sharing sessions, and communication workshops.",
    change: "Measure communication effectiveness, track knowledge gaps, assess whether shared understanding is improving.",
  },
  execution: {
    criterion: "Clarify team goals, success metrics, roles, and workflows. Define what 'good coordination' looks like.",
    commit: "Commit to explicit goal-setting, role clarification, and workflow optimization.",
    collaborate: "Co-create goal frameworks, map dependencies, establish coordination rituals (standups, planning sessions).",
    change: "Measure goal clarity through surveys, track coordination breakdowns, assess workflow efficiency.",
  },
  learning: {
    criterion: "Define what effective problem-solving and decision-making look like. What's your current process?",
    commit: "Commit to structured decision-making frameworks and problem-solving methodologies.",
    collaborate: "Practice collaborative problem-solving, conduct decision-making workshops, establish learning rituals.",
    change: "Measure decision quality, track problem recurrence, assess team learning velocity.",
  },
};

export function generateTrainingPlan(
  drivers: Record<string, { name: string; score: number; weight: number }>
): ClusterPlan[] {
  return DRIVER_CLUSTERS.map(cluster => {
    // Calculate average score for this cluster
    const clusterScores = cluster.drivers
      .map(driverId => drivers[driverId]?.score)
      .filter(score => score !== undefined);
    
    const averageScore = clusterScores.length > 0
      ? clusterScores.reduce((sum, score) => sum + score, 0) / clusterScores.length
      : 4;
    
    // Determine priority based on score
    // 1.0 - 3.0: High Priority
    // 3.01 - 5.0: Medium Priority
    // 5.01 - 7.0: Low Priority
    let priority: "high" | "medium" | "low";
    if (averageScore <= 3.0) {
      priority = "high";
    } else if (averageScore <= 5.0) {
      priority = "medium";
    } else {
      priority = "low";
    }
    
    // Get cluster-specific focus areas
    const focus = CLUSTER_FOCUS[cluster.id as keyof typeof CLUSTER_FOCUS];
    
    // Generate modules with cluster-specific adaptations
    const modules: TrainingModule[] = [
      {
        ...FOUR_CS_MODULES.criterion,
        description: focus?.criterion || FOUR_CS_MODULES.criterion.description,
      },
      {
        ...FOUR_CS_MODULES.commit,
        description: focus?.commit || FOUR_CS_MODULES.commit.description,
      },
      {
        ...FOUR_CS_MODULES.collaborate,
        description: focus?.collaborate || FOUR_CS_MODULES.collaborate.description,
      },
      {
        ...FOUR_CS_MODULES.change,
        description: focus?.change || FOUR_CS_MODULES.change.description,
      },
    ];
    
    return {
      clusterId: cluster.id,
      clusterName: cluster.name,
      clusterDescription: cluster.description,
      priority,
      averageScore,
      modules,
    };
  }).sort((a, b) => {
    // Sort by priority (high > medium > low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
