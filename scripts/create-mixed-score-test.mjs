import { appRouter } from '../server/routers.js';

// Mixed scores: some critical, some strengths
const mixedAnswers = {
  // Trust (critical) - all 1s
  1: 1, 2: 1, 3: 1, 4: 1, 5: 1,
  // Psych Safety (high) - all 3s
  6: 3, 7: 3, 8: 3, 9: 3, 10: 3,
  // TMS (medium) - all 4s
  11: 4, 12: 4, 13: 4, 14: 4, 15: 4,
  // Comm Quality (strength) - all 6s
  16: 6, 17: 6, 18: 6, 19: 6, 20: 6,
  // Goal Clarity (strength) - all 7s
  21: 7, 22: 7, 23: 7, 24: 7, 25: 7,
  // Coordination (strength) - all 6s
  26: 6, 27: 6, 28: 6, 29: 6, 30: 6,
  // Team Cognition (strength) - all 7s
  31: 7, 32: 7, 33: 7, 34: 7, 35: 7,
};

const mixedScores = {
  trust: 1.0,              // Critical → Red
  psych_safety: 3.0,       // High → Orange
  tms: 4.0,                // Medium → Yellow
  comm_quality: 6.0,       // Strength → Green
  goal_clarity: 7.0,       // Strength → Green
  coordination: 6.0,       // Strength → Green
  team_cognition: 7.0,     // Strength → Green
};

const testAssessment = {
  companyInfo: {
    name: 'BDD Test: Mixed Scores (All Fixes Verification)',
    email: '',
    website: 'https://bdd-test-mixed.com',
    team: 'BDD Test Team',
    teamSize: '10',
    avgSalary: '100000',
    trainingType: 'not-sure',
  },
  scores: mixedScores,
  answers: mixedAnswers,
};

async function main() {
  console.log('Creating mixed-score test assessment for comprehensive verification...\n');

  const caller = appRouter.createCaller({
    req: {},
    res: {},
    user: null,
  });

  try {
    const result = await caller.assessment.create(testAssessment);
    console.log(`✓ Created: ${testAssessment.companyInfo.name}`);
    console.log(`  ID: ${result.assessmentId}`);
    console.log(`  URL: /results/${result.assessmentId}\n`);
    console.log('\n=== Verification Checklist ===\n');
    console.log('1. ✓ Payback Period: Should show ~3.X months (not 0.X)');
    console.log('2. ✓ Markdown Bold: "However, there are significant concerns" should be bold');
    console.log('3. ✓ Training Options: Should show comparison table (not blank)');
    console.log('4. ✓ Badge Colors:');
    console.log('   - Trust (1.0) → RED badge "Critical Dysfunction"');
    console.log('   - Psych Safety (3.0) → ORANGE badge');
    console.log('   - TMS (4.0) → YELLOW badge');
    console.log('   - Comm Quality (6.0) → GREEN badge "Team Strength"');
    console.log('   - Goal Clarity (7.0) → GREEN badge "Team Strength"');
    console.log('   - Coordination (6.0) → GREEN badge "Team Strength"');
    console.log('   - Team Cognition (7.0) → GREEN badge "Team Strength"');
  } catch (error) {
    console.error(`✗ Failed to create assessment:`);
    console.error(error.message);
  }
}

main().catch(console.error);
