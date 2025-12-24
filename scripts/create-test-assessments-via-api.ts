import { appRouter } from '../server/routers';

// All 1's answers for consistent testing
const allOnesAnswers: Record<number, number> = {};
for (let i = 1; i <= 35; i++) {
  allOnesAnswers[i] = 1;
}

const testAssessments = [
  {
    companyName: 'BDD Test: Half Day Workshop',
    companyWebsite: 'https://bdd-test-halfday.com',
    teamName: 'BDD Test Team',
    teamSize: 10,
    avgSalary: 100000,
    trainingType: 'half-day' as const,
    answers: allOnesAnswers
  },
  {
    companyName: 'BDD Test: Full Day Workshop',
    companyWebsite: 'https://bdd-test-fullday.com',
    teamName: 'BDD Test Team',
    teamSize: 10,
    avgSalary: 100000,
    trainingType: 'full-day' as const,
    answers: allOnesAnswers
  },
  {
    companyName: 'BDD Test: Month-Long Engagement',
    companyWebsite: 'https://bdd-test-monthlong.com',
    teamName: 'BDD Test Team',
    teamSize: 10,
    avgSalary: 100000,
    trainingType: 'month-long' as const,
    answers: allOnesAnswers
  }
];

async function main() {
  console.log('Creating BDD test assessments via tRPC API...\n');

  const caller = appRouter.createCaller({} as any);

  for (const testData of testAssessments) {
    try {
      const result = await caller.assessment.create(testData);
      console.log(`✓ Created: ${testData.companyName}`);
      console.log(`  ID: ${result.id}`);
      console.log(`  URL: /results/${result.id}\n`);
    } catch (error) {
      console.error(`✗ Failed to create ${testData.companyName}:`, error);
    }
  }

  console.log('\nBDD Test assessments created successfully!');
  console.log('\nTest URLs for browser verification:');
  console.log('Run these in order to verify all 4 BDD scenarios:\n');
  console.log('1. Half Day:    Check for "Selected Training Scope" card');
  console.log('2. Full Day:    Check for "Selected Training Scope" card');
  console.log('3. Month-Long:  Check for "Selected Training Scope" card');
  console.log('4. Not Sure:    Check for "Training Options Comparison" table (already verified)');
}

main().catch(console.error);
