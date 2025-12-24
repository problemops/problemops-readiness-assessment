import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { assessments, assessmentData } from '../drizzle/schema.ts';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString);
const db = drizzle(client);

// All 1's scores for consistent testing
const allOnesScores = {};
for (let i = 1; i <= 35; i++) {
  allOnesScores[i] = 1;
}

const testAssessments = [
  {
    id: 'test-half-day-00000000001',
    companyName: 'Test: Half Day Workshop',
    companyWebsite: 'https://test-halfday.com',
    teamDepartment: 'Test Team',
    teamSize: 10,
    avgSalary: 100000,
    trainingType: 'half-day',
    answers: allOnesScores
  },
  {
    id: 'test-full-day-00000000001',
    companyName: 'Test: Full Day Workshop',
    companyWebsite: 'https://test-fullday.com',
    teamDepartment: 'Test Team',
    teamSize: 10,
    avgSalary: 100000,
    trainingType: 'full-day',
    answers: allOnesScores
  },
  {
    id: 'test-month-long-0000000001',
    companyName: 'Test: Month-Long Engagement',
    companyWebsite: 'https://test-monthlong.com',
    teamDepartment: 'Test Team',
    teamSize: 10,
    avgSalary: 100000,
    trainingType: 'month-long',
    answers: allOnesScores
  },
  {
    id: 'test-not-sure-000000000001',
    companyName: 'Test: Not Sure Yet',
    companyWebsite: 'https://test-notsure.com',
    teamDepartment: 'Test Team',
    teamSize: 10,
    avgSalary: 100000,
    trainingType: 'not-sure',
    answers: allOnesScores
  }
];

async function main() {
  console.log('Creating test assessments for all 4 training types...\n');

  for (const test of testAssessments) {
    try {
      // Insert assessment
      await db.insert(assessments).values({
        id: test.id,
        companyName: test.companyName,
        companyWebsite: test.companyWebsite,
        teamDepartment: test.teamDepartment,
        teamSize: test.teamSize,
        avgSalary: test.avgSalary,
        trainingType: test.trainingType
      });

      // Insert assessment data
      await db.insert(assessmentData).values({
        assessmentId: test.id,
        answers: test.answers
      });

      console.log(`✓ Created: ${test.companyName} (${test.id})`);
      console.log(`  URL: /results/${test.id}\n`);
    } catch (error) {
      console.error(`✗ Failed to create ${test.companyName}:`, error.message);
    }
  }

  console.log('\nTest assessments created successfully!');
  console.log('\nTest URLs:');
  console.log('1. Half Day:    /results/test-half-day-00000000001');
  console.log('2. Full Day:    /results/test-full-day-00000000001');
  console.log('3. Month-Long:  /results/test-month-long-0000000001');
  console.log('4. Not Sure:    /results/test-not-sure-000000000001');
  
  await client.end();
}

main().catch(console.error);
