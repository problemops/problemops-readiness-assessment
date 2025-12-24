#!/usr/bin/env node
import { getDb } from '../server/db.js';

const testScenarios = [
  { name: "All 1s (Critical)", score: 1 },
  { name: "All 2.5s (Critical boundary)", score: 2.5 },
  { name: "All 2.51s (Monitor - just above)", score: 2.51 },
  { name: "All 3s (Monitor)", score: 3 },
  { name: "All 4s (Monitor boundary)", score: 4 },
  { name: "All 4.01s (Stable - just above)", score: 4.01 },
  { name: "All 5s (Stable)", score: 5 },
  { name: "All 6s (Stable boundary)", score: 6 },
  { name: "All 6.01s (Strength - just above)", score: 6.01 },
  { name: "All 7s (Strength)", score: 7 },
];

async function createTestAssessments() {
  const db = await getDb();
  
  console.log("\n🧪 Creating Test Assessments for Score Boundary Testing\n");
  console.log("=".repeat(80));
  
  for (const scenario of testScenarios) {
    const driverScores = {
      trust: scenario.score,
      psych_safety: scenario.score,
      tms: scenario.score,
      comm_quality: scenario.score,
      goal_clarity: scenario.score,
      coordination: scenario.score,
      team_cognition: scenario.score
    };
    
    const result = await db.insert(db.schema.assessments).values({
      companyName: scenario.name,
      teamSize: 10,
      avgSalary: 100000,
      driverScores,
      createdAt: new Date().toISOString()
    }).returning();
    
    const assessment = result[0];
    console.log(`✅ ${scenario.name}`);
    console.log(`   ID: ${assessment.id}`);
    console.log(`   URL: https://3000-ikj16beicuuol26k13y4r-7969fcd6.manusvm.computer/results/${assessment.id}`);
    console.log();
  }
  
  console.log("=".repeat(80));
  console.log("\n✅ All test assessments created successfully!\n");
}

createTestAssessments().catch(console.error);
