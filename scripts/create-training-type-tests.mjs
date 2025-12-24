import { appRouter } from '../server/routers.js';

// All 1's answers for consistent critical dysfunction testing
const allOnesAnswers = {};
for (let i = 1; i <= 35; i++) {
  allOnesAnswers[i] = 1;
}

// All 1's scores (critical dysfunction)
const allOnesScores = {
  trust: 1.0,
  psych_safety: 1.0,
  tms: 1.0,
  comm_quality: 1.0,
  goal_clarity: 1.0,
  coordination: 1.0,
  team_cognition: 1.0,
};

const testAssessments = [
  {
    companyInfo: {
      name: 'BDD Test: Half Day Workshop',
      email: '',
      website: 'https://bdd-test-halfday.com',
      team: 'BDD Test Team',
      teamSize: '10',
      avgSalary: '100000',
      trainingType: 'half-day',
    },
    scores: allOnesScores,
    answers: allOnesAnswers,
  },
  {
    companyInfo: {
      name: 'BDD Test: Full Day Workshop',
      email: '',
      website: 'https://bdd-test-fullday.com',
      team: 'BDD Test Team',
      teamSize: '10',
      avgSalary: '100000',
      trainingType: 'full-day',
    },
    scores: allOnesScores,
    answers: allOnesAnswers,
  },
  {
    companyInfo: {
      name: 'BDD Test: Month-Long Engagement',
      email: '',
      website: 'https://bdd-test-monthlong.com',
      team: 'BDD Test Team',
      teamSize: '10',
      avgSalary: '100000',
      trainingType: 'month-long',
    },
    scores: allOnesScores,
    answers: allOnesAnswers,
  },
];

async function main() {
  console.log('Creating BDD test assessments for all training types...\n');

  const caller = appRouter.createCaller({
    req: {},
    res: {},
    user: null,
  });

  for (const testData of testAssessments) {
    try {
      const result = await caller.assessment.create(testData);
      console.log(`✓ Created: ${testData.companyInfo.name}`);
      console.log(`  ID: ${result.assessmentId}`);
      console.log(`  URL: /results/${result.assessmentId}\n`);
    } catch (error) {
      console.error(`✗ Failed to create ${testData.companyInfo.name}:`);
      console.error(error.message);
      console.error('\n');
    }
  }

  console.log('\n=== Test URLs for Browser Verification ===\n');
  console.log('1. Half Day:    Verify "Selected Training Scope" shows "Half Day Workshop"');
  console.log('2. Full Day:    Verify "Selected Training Scope" shows "Full Day Workshop"');
  console.log('3. Month-Long:  Verify "Selected Training Scope" shows "Month-Long Engagement"');
  console.log('4. Not Sure:    Verify "Training Options Comparison" table (already tested ✓)');
}

main().catch(console.error);
