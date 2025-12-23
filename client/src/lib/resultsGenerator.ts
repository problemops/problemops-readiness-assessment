// Question database for reasoning generation
const QUESTIONS_BY_DRIVER: Record<string, { id: number; text: string }[]> = {
  trust: [
    { id: 1, text: "Your team struggles with reliability—members don't consistently complete work on time or to expected quality" },
    { id: 2, text: "There's a lack of openness about challenges and setbacks" },
    { id: 3, text: "Team members don't feel comfortable being vulnerable about mistakes or weaknesses" },
    { id: 4, text: "Concern for each other's well-being is limited to work contributions only" },
    { id: 5, text: "There's doubt about whether teammates have each other's best interests at heart" },
  ],
  psych_safety: [
    { id: 6, text: "Taking risks or proposing new ideas feels unsafe" },
    { id: 7, text: "There's concern that some team members may deliberately undermine others' efforts" },
    { id: 8, text: "Problems and tough issues are difficult to bring up" },
    { id: 9, text: "Mistakes are held against team members" },
    { id: 10, text: "Not all team members feel accepted and respected" },
  ],
  tms: [
    { id: 11, text: "There's limited understanding of 'who knows what' on the team" },
    { id: 12, text: "It's unclear who to ask for information on specific topics" },
    { id: 13, text: "The team doesn't effectively use each member's unique knowledge and skills" },
    { id: 14, text: "There's no shared understanding of each other's areas of expertise" },
    { id: 15, text: "Team members don't trust specialized knowledge they don't personally understand" },
  ],
  comm_quality: [
    { id: 16, text: "Communication is often unclear or difficult to understand" },
    { id: 17, text: "Jargon and specialized language create barriers to understanding" },
    { id: 18, text: "Communication focuses on transmitting information rather than achieving mutual understanding" },
    { id: 19, text: "Communication is not consistently timely or accurate" },
    { id: 20, text: "Listening to each other's perspectives needs improvement" },
  ],
  goal_clarity: [
    { id: 21, text: "Team members lack a clear understanding of primary goals and objectives" },
    { id: 22, text: "Goals are not well-defined or measurable" },
    { id: 23, text: "There's no shared understanding of what success looks like" },
    { id: 24, text: "Individual work doesn't clearly contribute to team goals" },
    { id: 25, text: "Priorities are unclear or inconsistent" },
  ],
  coordination: [
    { id: 26, text: "Workflows are not smooth or efficient" },
    { id: 27, text: "Managing handoffs and dependencies between team members is challenging" },
    { id: 28, text: "The team struggles to adapt plans and processes when circumstances change" },
    { id: 29, text: "Roles and responsibilities are unclear" },
    { id: 30, text: "Synchronizing efforts to achieve goals is difficult" },
  ],
  team_cognition: [
    { id: 31, text: "The team struggles to identify root causes of complex problems" },
    { id: 32, text: "Generating creative and viable solutions to challenges is difficult" },
    { id: 33, text: "There's no structured approach to making important decisions" },
    { id: 34, text: "The team repeats mistakes rather than learning from them" },
    { id: 35, text: "Anticipating future problems before they arise is challenging" },
  ],
};

const DRIVER_NAMES: Record<string, string> = {
  trust: "Trust",
  psych_safety: "Psychological Safety",
  tms: "Transactive Memory Systems",
  comm_quality: "Communication Quality",
  goal_clarity: "Goal Clarity",
  coordination: "Coordination",
  team_cognition: "Team Cognition",
};

export function generateDriverReasoning(
  driverId: string,
  score: number,
  answers: Record<number, number>
): { summary: string; issues: string[] } {
  const questions = QUESTIONS_BY_DRIVER[driverId] || [];
  const driverName = DRIVER_NAMES[driverId] || driverId;
  
  // Identify low-scoring questions (< 4 = below neutral)
  const issues = questions
    .filter(q => answers[q.id] && answers[q.id] < 4)
    .map(q => q.text);
  
  // Generate summary based on score
  let summary = "";
  if (score >= 6) {
    summary = `Your team demonstrates strong ${driverName}. This is a significant strength that supports overall effectiveness.`;
  } else if (score >= 5) {
    summary = `Your team shows good ${driverName}, though there's room for improvement to reach optimal performance.`;
  } else if (score >= 4) {
    summary = `Your team's ${driverName} is at a functional baseline, but addressing gaps could unlock significant performance gains.`;
  } else if (score >= 3) {
    summary = `Your team's ${driverName} has notable gaps that are likely impacting effectiveness and should be prioritized for improvement.`;
  } else {
    summary = `Your team's ${driverName} is critically low and represents a major barrier to effectiveness. Immediate attention is needed.`;
  }
  
  return { summary, issues };
}

export function generateTeamNarrative(
  drivers: Record<string, { name: string; score: number }>,
  readinessScore: number
): string {
  // Sort drivers by score to identify strengths and weaknesses
  const sortedDrivers = Object.entries(drivers).sort((a, b) => b[1].score - a[1].score);
  const strongest = sortedDrivers.slice(0, 2).map(([_, d]) => d.name);
  const weakest = sortedDrivers.slice(-2).map(([_, d]) => d.name);
  
  let narrative = "";
  
  // Opening based on overall readiness
  if (readinessScore >= 0.85) {
    narrative = "Your team is operating at a high level of effectiveness. ";
  } else if (readinessScore >= 0.70) {
    narrative = "Your team demonstrates functional capabilities but has clear opportunities for growth. ";
  } else if (readinessScore >= 0.50) {
    narrative = "Your team is experiencing significant dysfunction that is impacting performance and morale. ";
  } else {
    narrative = "Your team is in a critical state, with fundamental breakdowns in multiple areas that require immediate intervention. ";
  }
  
  // Strengths
  if (strongest.length > 0) {
    narrative += `Your strongest areas are ${strongest.join(" and ")}, which provide a foundation to build upon. `;
  }
  
  // Weaknesses
  if (weakest.length > 0) {
    narrative += `However, ${weakest.join(" and ")} represent significant challenges that are holding the team back. `;
  }
  
  // Closing with forward-looking statement
  if (readinessScore < 0.85) {
    narrative += "By addressing these gaps systematically through the ProblemOps framework, your team can unlock substantial performance improvements and create a more effective, collaborative environment. ";
  } else {
    narrative += "Continued focus on maintaining these high standards while addressing minor gaps will help your team sustain excellence. ";
  }
  
  narrative += "The recommended training plan below provides a structured path forward based on your specific assessment results.";
  
  return narrative;
}

// Driver clustering for training plan
export const DRIVER_CLUSTERS = [
  {
    id: "foundation",
    name: "Foundation: Trust & Safety",
    drivers: ["trust", "psych_safety"],
    description: "Building the interpersonal foundation that enables all other team capabilities",
  },
  {
    id: "knowledge",
    name: "Knowledge Systems: TMS & Communication",
    drivers: ["tms", "comm_quality"],
    description: "Establishing shared understanding and effective information flow",
  },
  {
    id: "execution",
    name: "Execution: Goals & Coordination",
    drivers: ["goal_clarity", "coordination"],
    description: "Aligning on objectives and synchronizing work effectively",
  },
  {
    id: "learning",
    name: "Continuous Learning: Team Cognition",
    drivers: ["team_cognition"],
    description: "Building collective problem-solving and decision-making capabilities",
  },
];
