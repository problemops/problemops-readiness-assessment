import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import fs from 'fs';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

const db = drizzle(connection, { schema, mode: 'default' });

console.log('🚀 Populating complete test registry...\n');

// Clear existing data
await connection.query('DELETE FROM testRegistry');
console.log('✓ Cleared existing test registry data\n');

// ============================================================================
// PART 1: INSERT ALL 79 UNIT TESTS
// ============================================================================

console.log('📝 Inserting 79 unit tests...');

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
  
  // driverImpactContent.test.ts (38 tests)
  { testId: 'unit-driver-001', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should classify score ≤2.5 as critical', description: 'Tests critical severity threshold', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-002', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should classify score 2.51-4.0 as high', description: 'Tests high severity threshold', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-003', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should classify score 4.01-5.5 as moderate', description: 'Tests moderate severity threshold', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-004', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should classify score >5.5 as strength', description: 'Tests strength threshold', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-005', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should return red badge for critical', description: 'Tests critical badge color', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-006', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should return orange badge for high', description: 'Tests high badge color', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-007', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should return yellow badge for moderate', description: 'Tests moderate badge color (bug fix)', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-008', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should return green badge for strength', description: 'Tests strength badge color', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-009', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate team story with correct structure', description: 'Tests team story generation', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-010', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should identify strengths correctly', description: 'Tests strength identification logic', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-011', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should identify concerns correctly', description: 'Tests concern identification logic', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-012', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should calculate overall severity', description: 'Tests overall severity calculation', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-013', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate narrative for all drivers', description: 'Tests narrative generation for all 7 drivers', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-014', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should handle edge case: all perfect scores', description: 'Tests all drivers at 7.0', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-015', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should handle edge case: all critical scores', description: 'Tests all drivers at 1.0', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-016', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate trust driver content', description: 'Tests trust-specific content generation', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-017', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate psychological safety content', description: 'Tests psych safety content generation', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-018', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate transactive memory content', description: 'Tests TMS content generation', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-019', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate communication quality content', description: 'Tests comm quality content generation', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-020', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate goal clarity content', description: 'Tests goal clarity content generation', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-021', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate coordination content', description: 'Tests coordination content generation', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-022', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate team cognition content', description: 'Tests team cognition content generation', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-023', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should calculate cost impact for each driver', description: 'Tests individual driver cost calculation', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-024', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should prioritize drivers by cost impact', description: 'Tests driver prioritization logic', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-025', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate actionable recommendations', description: 'Tests recommendation generation', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-026', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should handle missing driver data gracefully', description: 'Tests error handling for missing drivers', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-027', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should validate driver score range (1-7)', description: 'Tests score validation', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-028', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate severity labels correctly', description: 'Tests severity label generation', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-029', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate severity colors correctly', description: 'Tests severity color mapping', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-030', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate severity text colors correctly', description: 'Tests severity text color mapping', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-031', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should handle boundary case: score exactly 2.5', description: 'Tests critical/high boundary', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-032', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should handle boundary case: score exactly 4.0', description: 'Tests high/moderate boundary', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-033', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should handle boundary case: score exactly 5.5', description: 'Tests moderate/strength boundary', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-034', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate impact narrative for critical drivers', description: 'Tests critical driver narrative', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-035', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate impact narrative for high risk drivers', description: 'Tests high risk driver narrative', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-036', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate impact narrative for moderate drivers', description: 'Tests moderate driver narrative', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-037', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should generate impact narrative for strength drivers', description: 'Tests strength driver narrative', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-driver-038', testType: 'unit', testCategory: 'driver-scoring', testSuite: 'driverImpactContent.test.ts', testName: 'should sort drivers by severity in team story', description: 'Tests driver sorting logic', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/driverImpactContent.test.ts', implementationLocation: '/client/src/lib/driverImpactContent.ts', testCoverageMethod: 'vitest unit test' },
  
  // trainingRecommendations.test.ts (8 tests)
  { testId: 'unit-training-001', testType: 'unit', testCategory: 'roi-calculation', testSuite: 'trainingRecommendations.test.ts', testName: 'should calculate individual driver costs correctly', description: 'Tests driver cost calculation formula', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/trainingRecommendations.test.ts', implementationLocation: '/client/src/lib/trainingRecommendations.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-training-002', testType: 'unit', testCategory: 'roi-calculation', testSuite: 'trainingRecommendations.test.ts', testName: 'should handle all drivers at same score', description: 'Tests uniform score scenario', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/trainingRecommendations.test.ts', implementationLocation: '/client/src/lib/trainingRecommendations.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-training-003', testType: 'unit', testCategory: 'roi-calculation', testSuite: 'trainingRecommendations.test.ts', testName: 'Half Day: should use ONLY top 1 priority driver cost', description: 'Tests Half Day scoped ROI calculation', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/trainingRecommendations.test.ts', implementationLocation: '/client/src/lib/trainingRecommendations.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-training-004', testType: 'unit', testCategory: 'roi-calculation', testSuite: 'trainingRecommendations.test.ts', testName: 'Full Day: should use ONLY top 2 priority drivers cost', description: 'Tests Full Day scoped ROI calculation', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/trainingRecommendations.test.ts', implementationLocation: '/client/src/lib/trainingRecommendations.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-training-005', testType: 'unit', testCategory: 'roi-calculation', testSuite: 'trainingRecommendations.test.ts', testName: 'Month-Long: should use ALL 7 drivers cost', description: 'Tests Month-Long comprehensive ROI calculation', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/trainingRecommendations.test.ts', implementationLocation: '/client/src/lib/trainingRecommendations.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-training-006', testType: 'unit', testCategory: 'roi-calculation', testSuite: 'trainingRecommendations.test.ts', testName: 'should show decreasing ROI % as training cost increases', description: 'Tests ROI percentage trends', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/trainingRecommendations.test.ts', implementationLocation: '/client/src/lib/trainingRecommendations.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-training-007', testType: 'unit', testCategory: 'roi-calculation', testSuite: 'trainingRecommendations.test.ts', testName: 'should produce realistic payback periods', description: 'Tests payback calculation realism', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/trainingRecommendations.test.ts', implementationLocation: '/client/src/lib/trainingRecommendations.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-training-008', testType: 'unit', testCategory: 'roi-calculation', testSuite: 'trainingRecommendations.test.ts', testName: 'should handle edge case: perfect scores (no dysfunction)', description: 'Tests zero dysfunction scenario', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/trainingRecommendations.test.ts', implementationLocation: '/client/src/lib/trainingRecommendations.ts', testCoverageMethod: 'vitest unit test' },
  
  // deliverables-by-training.test.ts (18 tests)
  { testId: 'unit-deliverables-001', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'Half Day: should show top 1 priority in recommended', description: 'Tests Half Day deliverables filtering', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-002', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'Half Day: should show other 3 C\'s in other section', description: 'Tests Half Day other deliverables', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-003', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'Full Day: should show top 2 priorities in recommended', description: 'Tests Full Day deliverables filtering', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-004', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'Full Day: should show other 2 C\'s in other section', description: 'Tests Full Day other deliverables', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-005', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'Month-Long: should show all priorities in recommended', description: 'Tests Month-Long comprehensive deliverables', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-006', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'Month-Long: should show non-gaps in other section', description: 'Tests Month-Long other deliverables', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-007', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'Not Sure: should show all priorities in recommended', description: 'Tests Not Sure comprehensive view', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-008', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'Not Sure: should show non-gaps in other section', description: 'Tests Not Sure other deliverables', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-009', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'should prioritize by gap size (largest first)', description: 'Tests deliverables prioritization logic', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-010', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'should only recommend C\'s with score < 60%', description: 'Tests 60% threshold for recommendations', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-011', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'Edge case: All C\'s above 60% (no gaps)', description: 'Tests scenario with no recommendations', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-012', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'Edge case: Only 1 C below 60% with Half Day', description: 'Tests single gap with Half Day', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-013', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'Edge case: Only 1 C below 60% with Full Day', description: 'Tests single gap with Full Day', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-014', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'should include deliverable details for each C', description: 'Tests deliverable content structure', priority: 'P1', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-015', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'should calculate gap correctly (85% - current%)', description: 'Tests gap calculation formula', priority: 'P0', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-016', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'should handle ties in gap size', description: 'Tests tie-breaking in prioritization', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-017', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'should return empty arrays when no data', description: 'Tests error handling for missing data', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
  { testId: 'unit-deliverables-018', testType: 'unit', testCategory: 'training-options', testSuite: 'deliverables-by-training.test.ts', testName: 'should maintain deliverable order within each C', description: 'Tests deliverable ordering consistency', priority: 'P2', status: 'ACTIVE', isAutomated: 1, filePath: '/server/deliverables-by-training.test.ts', implementationLocation: '/client/src/lib/fourCsScoring.ts', testCoverageMethod: 'vitest unit test' },
];

// Insert unit tests in batches
const batchSize = 20;
for (let i = 0; i < unitTests.length; i += batchSize) {
  const batch = unitTests.slice(i, i + batchSize);
  const values = batch.map(t => [
    t.testId, t.testType, t.testCategory, t.testSuite, t.testName, 
    t.description, null, null, null, null,
    t.priority, t.status, t.isAutomated, t.filePath, 
    t.implementationLocation, t.testCoverageMethod, null
  ]);
  
  await connection.query(
    `INSERT INTO testRegistry (testId, testType, testCategory, testSuite, testName, description, givenContext, whenAction, thenOutcome, additionalExpectations, priority, status, isAutomated, filePath, implementationLocation, testCoverageMethod, notes) VALUES ?`,
    [values]
  );
  console.log(`  ✓ Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(unitTests.length / batchSize)}`);
}

console.log(`✅ Inserted ${unitTests.length} unit tests\n`);

// ============================================================================
// PART 2: PARSE AND INSERT ALL 86 BDD SCENARIOS
// ============================================================================

console.log('📝 Parsing and inserting 86 BDD scenarios...');

const bddContent = fs.readFileSync('./tests/bdd-test-database.md', 'utf-8');

// Simple parser for BDD scenarios
const scenarios = [];
const lines = bddContent.split('\n');
let currentScenario = null;
let currentEpic = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Track current epic
  if (line.startsWith('### Epic ')) {
    currentEpic = line.replace('### ', '');
    continue;
  }
  
  // New scenario
  if (line.startsWith('#### Scenario ')) {
    if (currentScenario) {
      scenarios.push(currentScenario);
    }
    
    const match = line.match(/#### Scenario ([\d.]+): (.+)/);
    if (match) {
      currentScenario = {
        testId: `bdd-scenario-${match[1].replace(/\./g, '-')}`,
        testName: match[2],
        testSuite: currentEpic,
        givenContext: '',
        whenAction: '',
        thenOutcome: '',
        additionalExpectations: '',
        description: '',
        implementationLocation: '',
        testCoverageMethod: '',
        status: 'ACTIVE',
        isAutomated: 0,
      };
    }
    continue;
  }
  
  if (!currentScenario) continue;
  
  // Parse Given/When/Then
  if (line.startsWith('**Given**')) {
    currentScenario.givenContext = line.replace('**Given**', '').trim();
  } else if (line.startsWith('**When**')) {
    currentScenario.whenAction = line.replace('**When**', '').trim();
  } else if (line.startsWith('**Then**')) {
    currentScenario.thenOutcome = line.replace('**Then**', '').trim();
  } else if (line.startsWith('**And**')) {
    if (currentScenario.additionalExpectations) {
      currentScenario.additionalExpectations += ' AND ' + line.replace('**And**', '').trim();
    } else {
      currentScenario.additionalExpectations = line.replace('**And**', '').trim();
    }
  } else if (line.startsWith('**Implementation:**')) {
    currentScenario.implementationLocation = line.replace('**Implementation:**', '').trim();
  } else if (line.startsWith('**Test Coverage:**')) {
    currentScenario.testCoverageMethod = line.replace('**Test Coverage:**', '').trim();
  } else if (line.startsWith('**Status:**')) {
    const status = line.toLowerCase();
    if (status.includes('automated') || status.includes('vitest')) {
      currentScenario.isAutomated = 1;
    }
  }
}

// Push last scenario
if (currentScenario) {
  scenarios.push(currentScenario);
}

// Categorize scenarios
scenarios.forEach(s => {
  const suite = s.testSuite.toLowerCase();
  if (suite.includes('accessibility') || suite.includes('wcag')) {
    s.testCategory = 'accessibility';
    s.priority = 'P0';
  } else if (suite.includes('training') || suite.includes('roi')) {
    s.testCategory = 'training-options';
    s.priority = 'P0';
  } else if (suite.includes('calculation') || suite.includes('results')) {
    s.testCategory = 'roi-calculation';
    s.priority = 'P0';
  } else if (suite.includes('data flow') || suite.includes('integration')) {
    s.testCategory = 'data-flow';
    s.priority = 'P0';
  } else if (suite.includes('ui') || suite.includes('ux') || suite.includes('navigation')) {
    s.testCategory = 'ui';
    s.priority = 'P1';
  } else if (suite.includes('dark mode')) {
    s.testCategory = 'ui';
    s.priority = 'P1';
  } else if (suite.includes('edge case') || suite.includes('error')) {
    s.testCategory = 'logic';
    s.priority = 'P2';
  } else {
    s.testCategory = 'logic';
    s.priority = 'P2';
  }
  
  s.testType = 'bdd';
  s.description = `${s.testName} - BDD scenario from ${s.testSuite}`;
});

// Insert BDD scenarios in batches
for (let i = 0; i < scenarios.length; i += batchSize) {
  const batch = scenarios.slice(i, i + batchSize);
  const values = batch.map(s => [
    s.testId, s.testType, s.testCategory, s.testSuite, s.testName,
    s.description, s.givenContext, s.whenAction, s.thenOutcome, s.additionalExpectations,
    s.priority, s.status, s.isAutomated, null,
    s.implementationLocation, s.testCoverageMethod, null
  ]);
  
  await connection.query(
    `INSERT INTO testRegistry (testId, testType, testCategory, testSuite, testName, description, givenContext, whenAction, thenOutcome, additionalExpectations, priority, status, isAutomated, filePath, implementationLocation, testCoverageMethod, notes) VALUES ?`,
    [values]
  );
  console.log(`  ✓ Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(scenarios.length / batchSize)}`);
}

console.log(`✅ Inserted ${scenarios.length} BDD scenarios\n`);

// ============================================================================
// SUMMARY
// ============================================================================

const [totalRows] = await connection.query('SELECT COUNT(*) as count FROM testRegistry');
const [byType] = await connection.query('SELECT testType, COUNT(*) as count FROM testRegistry GROUP BY testType');
const [byPriority] = await connection.query('SELECT priority, COUNT(*) as count FROM testRegistry GROUP BY priority ORDER BY priority');
const [byAutomation] = await connection.query('SELECT isAutomated, COUNT(*) as count FROM testRegistry GROUP BY isAutomated');

console.log('═══════════════════════════════════════════════════════');
console.log('📊 TEST REGISTRY POPULATION COMPLETE');
console.log('═══════════════════════════════════════════════════════\n');

console.log(`Total tests in registry: ${totalRows[0].count}\n`);

console.log('By Type:');
byType.forEach(row => console.log(`  ${row.testType}: ${row.count}`));

console.log('\nBy Priority:');
byPriority.forEach(row => console.log(`  ${row.priority}: ${row.count}`));

console.log('\nBy Automation Status:');
byAutomation.forEach(row => console.log(`  ${row.isAutomated ? 'Automated' : 'Manual'}: ${row.count}`));

console.log('\n✅ Done!');

await connection.end();
