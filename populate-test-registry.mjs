import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

const db = drizzle(connection, { schema, mode: 'default' });

console.log('Populating test registry...');

// Clear existing data
await connection.query('DELETE FROM testRegistry');
console.log('Cleared existing test registry data');

// Define all unit tests
const unitTests = [
  // assessment.test.ts (14 tests)
  { testId: 'unit-assessment-001', testType: 'unit', testCategory: 'data-flow', testSuite: 'assessment.test.ts', testName: 'should create assessment with valid data', description: 'Validates assessment creation with all required fields', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/assessment.test.ts', implementationLocation: '/server/assessment.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-assessment-002', testType: 'unit', testCategory: 'data-flow', testSuite: 'assessment.test.ts', testName: 'should calculate readiness score correctly', description: 'Verifies readiness score calculation formula', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/assessment.test.ts', implementationLocation: '/server/assessment.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-assessment-003', testType: 'unit', testCategory: 'data-flow', testSuite: 'assessment.test.ts', testName: 'should calculate dysfunction cost correctly', description: 'Verifies dysfunction cost calculation', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/assessment.test.ts', implementationLocation: '/server/assessment.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-assessment-004', testType: 'unit', testCategory: 'data-flow', testSuite: 'assessment.test.ts', testName: 'should retrieve assessment by ID', description: 'Tests assessment retrieval by UUID', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/assessment.test.ts', implementationLocation: '/server/assessment.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-assessment-005', testType: 'unit', testCategory: 'data-flow', testSuite: 'assessment.test.ts', testName: 'should throw error for non-existent ID', description: 'Validates error handling for missing assessment', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/assessment.test.ts', implementationLocation: '/server/assessment.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-assessment-006', testType: 'unit', testCategory: 'data-flow', testSuite: 'assessment.test.ts', testName: 'should validate team size is positive', description: 'Ensures team size validation', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/assessment.test.ts', implementationLocation: '/server/assessment.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-assessment-007', testType: 'unit', testCategory: 'data-flow', testSuite: 'assessment.test.ts', testName: 'should validate average salary is positive', description: 'Ensures salary validation', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/assessment.test.ts', implementationLocation: '/server/assessment.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-assessment-008', testType: 'unit', testCategory: 'data-flow', testSuite: 'assessment.test.ts', testName: 'should handle all training types', description: 'Tests all training type options', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/assessment.test.ts', implementationLocation: '/server/assessment.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-assessment-009', testType: 'unit', testCategory: 'data-flow', testSuite: 'assessment.test.ts', testName: 'should calculate driver scores from answers', description: 'Verifies driver score calculation from raw answers', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/assessment.test.ts', implementationLocation: '/server/assessment.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-assessment-010', testType: 'unit', testCategory: 'data-flow', testSuite: 'assessment.test.ts', testName: 'should handle missing optional fields', description: 'Tests graceful handling of optional fields', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/assessment.test.ts', implementationLocation: '/server/assessment.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-assessment-011', testType: 'unit', testCategory: 'data-flow', testSuite: 'assessment.test.ts', testName: 'should store assessment in database', description: 'Verifies database persistence', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/assessment.test.ts', implementationLocation: '/server/assessment.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-assessment-012', testType: 'unit', testCategory: 'data-flow', testSuite: 'assessment.test.ts', testName: 'should generate valid UUID for assessment ID', description: 'Tests UUID generation', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/assessment.test.ts', implementationLocation: '/server/assessment.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-assessment-013', testType: 'unit', testCategory: 'roi-calculation', testSuite: 'assessment.test.ts', testName: 'should calculate dysfunction cost within realistic range', description: 'Validates dysfunction cost is reasonable', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/assessment.test.ts', implementationLocation: '/server/assessment.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-assessment-014', testType: 'unit', testCategory: 'data-flow', testSuite: 'assessment.test.ts', testName: 'should handle concurrent assessment creation', description: 'Tests race condition handling', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/assessment.test.ts', implementationLocation: '/server/assessment.ts', testCoverageMethod: 'vitest unit test' },
  
  // auth.logout.test.ts (1 test)
  { testId: 'unit-auth-001', testType: 'unit', testCategory: 'api', testSuite: 'auth.logout.test.ts', testName: 'should clear session cookie on logout', description: 'Verifies logout clears authentication session', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/auth.logout.test.ts', implementationLocation: '/server/auth.ts', testCoverageMethod: 'vitest unit test' },
];

// Insert in batches to avoid query size limits
const batchSize = 10;
for (let i = 0; i < unitTests.length; i += batchSize) {
  const batch = unitTests.slice(i, i + batchSize);
  await connection.query(
    `INSERT INTO testRegistry (testId, testType, testCategory, testSuite, testName, description, priority, status, isAutomated, filePath, implementationLocation, testCoverageMethod) VALUES ?`,
    [batch.map(t => [t.testId, t.testType, t.testCategory, t.testSuite, t.testName, t.description, t.priority, t.status, t.isAutomated, t.filePath, t.implementationLocation, t.testCoverageMethod])]
  );
  console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}`);
}

// Get count
const [rows] = await connection.query('SELECT COUNT(*) as count FROM testRegistry');
console.log(`\nTotal tests in registry: ${rows[0].count}`);

await connection.end();
console.log('Done!');
