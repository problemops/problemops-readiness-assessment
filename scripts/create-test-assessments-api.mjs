#!/usr/bin/env node
/**
 * Create test assessments via API for boundary testing
 * Tests all score boundaries and mixed scenarios
 */

import mysql from 'mysql2/promise';
import { randomUUID } from 'crypto';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const testScenarios = [
  {
    name: "All 1s (Critical)",
    scores: { trust: 1, psych_safety: 1, tms: 1, comm_quality: 1, goal_clarity: 1, coordination: 1, team_cognition: 1 }
  },
  {
    name: "All 2.5 (Critical boundary)",
    scores: { trust: 2.5, psych_safety: 2.5, tms: 2.5, comm_quality: 2.5, goal_clarity: 2.5, coordination: 2.5, team_cognition: 2.5 }
  },
  {
    name: "All 2.51 (Monitor)",
    scores: { trust: 2.51, psych_safety: 2.51, tms: 2.51, comm_quality: 2.51, goal_clarity: 2.51, coordination: 2.51, team_cognition: 2.51 }
  },
  {
    name: "All 4.0 (Monitor boundary)",
    scores: { trust: 4.0, psych_safety: 4.0, tms: 4.0, comm_quality: 4.0, goal_clarity: 4.0, coordination: 4.0, team_cognition: 4.0 }
  },
  {
    name: "All 4.01 (Stable)",
    scores: { trust: 4.01, psych_safety: 4.01, tms: 4.01, comm_quality: 4.01, goal_clarity: 4.01, coordination: 4.01, team_cognition: 4.01 }
  },
  {
    name: "All 5.5 (Stable boundary)",
    scores: { trust: 5.5, psych_safety: 5.5, tms: 5.5, comm_quality: 5.5, goal_clarity: 5.5, coordination: 5.5, team_cognition: 5.5 }
  },
  {
    name: "All 5.51 (Strength)",
    scores: { trust: 5.51, psych_safety: 5.51, tms: 5.51, comm_quality: 5.51, goal_clarity: 5.51, coordination: 5.51, team_cognition: 5.51 }
  },
  {
    name: "All 7s (Strength)",
    scores: { trust: 7, psych_safety: 7, tms: 7, comm_quality: 7, goal_clarity: 7, coordination: 7, team_cognition: 7 }
  },
  {
    name: "Mixed: All Critical except one Strength",
    scores: { trust: 1.5, psych_safety: 2.0, tms: 2.5, comm_quality: 1.5, goal_clarity: 2.0, coordination: 1.5, team_cognition: 7.0 }
  },
  {
    name: "Mixed: All Strength except one Critical",
    scores: { trust: 6.0, psych_safety: 6.5, tms: 7.0, comm_quality: 6.5, goal_clarity: 6.0, coordination: 5.51, team_cognition: 1.0 }
  },
  {
    name: "Mixed: Half Critical, half Strength",
    scores: { trust: 1.5, psych_safety: 2.0, tms: 2.5, comm_quality: 6.0, goal_clarity: 6.5, coordination: 7.0, team_cognition: 5.51 }
  },
  {
    name: "Mixed: One in each category",
    scores: { trust: 1.5, psych_safety: 2.5, tms: 3.0, comm_quality: 4.0, goal_clarity: 5.0, coordination: 5.5, team_cognition: 6.5 }
  }
];

// Driver weights from research
const DRIVER_WEIGHTS = {
  trust: 0.48,
  psych_safety: 0.42,
  tms: 0.38,
  comm_quality: 0.35,
  goal_clarity: 0.32,
  coordination: 0.30,
  team_cognition: 0.28
};

function calculateReadinessScore(scores) {
  const totalWeight = Object.values(DRIVER_WEIGHTS).reduce((sum, w) => sum + w, 0);
  const weightedSum = Object.entries(scores).reduce((sum, [key, value]) => {
    return sum + (value * DRIVER_WEIGHTS[key]);
  }, 0);
  const maxWeightedSum = totalWeight * 7;
  return weightedSum / maxWeightedSum;
}

function calculateDysfunctionCost(readinessScore, teamSize, avgSalary) {
  const totalSalary = teamSize * avgSalary;
  return (1 - readinessScore) * totalSalary;
}

console.log("\n🧪 Creating Test Assessments via API");
console.log("=".repeat(80));

const results = [];

for (const scenario of testScenarios) {
  const id = randomUUID();
  const readinessScore = calculateReadinessScore(scenario.scores);
  const dysfunctionCost = calculateDysfunctionCost(readinessScore, 10, 100000);
  
  // Create dummy answers (35 questions, 5 per driver)
  const answers = {};
  let qNum = 1;
  for (const [driver, score] of Object.entries(scenario.scores)) {
    for (let i = 0; i < 5; i++) {
      answers[`q${qNum}`] = Math.round(score);
      qNum++;
    }
  }
  
  try {
    // Insert into assessments table
    await connection.execute(
      `INSERT INTO assessments (
        id, companyName, companyWebsite, teamName, teamSize, avgSalary, 
        trainingType, readinessScore, dysfunctionCost, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        id,
        `Test: ${scenario.name}`,
        'https://test.com',
        'Test Team',
        10,
        100000,
        'not-sure',
        readinessScore.toFixed(4),
        dysfunctionCost.toFixed(2)
      ]
    );
    
    // Insert into assessmentData table
    await connection.execute(
      `INSERT INTO assessmentData (
        assessmentId, answers, driverScores
      ) VALUES (?, ?, ?)`,
      [
        id,
        JSON.stringify(answers),
        JSON.stringify(scenario.scores)
      ]
    );
    
    const url = `https://3000-ikj16beicuuol26k13y4r-7969fcd6.manusvm.computer/results/${id}`;
    results.push({ name: scenario.name, id, url });
    
    console.log(`✅ ${scenario.name}`);
    console.log(`   ID: ${id}`);
    console.log(`   URL: ${url}`);
    console.log(`   Readiness: ${(readinessScore * 100).toFixed(1)}%`);
    console.log();
    
  } catch (error) {
    console.error(`❌ Failed to create ${scenario.name}:`, error.message);
  }
}

await connection.end();

console.log("=".repeat(80));
console.log(`\n✅ Created ${results.length} test assessments\n`);
console.log("Test URLs:");
results.forEach(r => {
  console.log(`- ${r.name}: ${r.url}`);
});
console.log();
