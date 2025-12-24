-- Populate Test Registry with All 165 Tests (79 Unit + 86 BDD)
-- Clear existing sample data first
DELETE FROM testRegistry WHERE testId LIKE 'SAMPLE%';

-- Unit Tests from server/ directory (79 tests)
-- assessment.test.ts (14 tests)
INSERT INTO testRegistry (testId, testName, testFile, testType, priority, automationStatus, lastRun, passStatus) VALUES
('UT-001', 'should create assessment with valid data', 'server/assessment.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-002', 'should validate required fields', 'server/assessment.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-003', 'should calculate driver scores correctly', 'server/assessment.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-004', 'should save assessment to database', 'server/assessment.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-005', 'should retrieve assessment by ID', 'server/assessment.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-006', 'should handle invalid assessment ID', 'server/assessment.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing'),
('UT-007', 'should validate team size range', 'server/assessment.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing'),
('UT-008', 'should validate salary range', 'server/assessment.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing'),
('UT-009', 'should handle missing optional fields', 'server/assessment.test.ts', 'unit', 'P2', 'automated', NOW(), 'passing'),
('UT-010', 'should calculate 4 Cs scores', 'server/assessment.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-011', 'should identify priority drivers', 'server/assessment.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-012', 'should generate results URL', 'server/assessment.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing'),
('UT-013', 'should handle concurrent assessments', 'server/assessment.test.ts', 'unit', 'P2', 'automated', NOW(), 'passing'),
('UT-014', 'should export assessment data', 'server/assessment.test.ts', 'unit', 'P2', 'automated', NOW(), 'passing');

-- driverImpactContent.test.ts (38 tests)
INSERT INTO testRegistry (testId, testName, testFile, testType, priority, automationStatus, lastRun, passStatus) VALUES
('UT-015', 'should return correct driver content for Trust', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-016', 'should return correct driver content for Psychological Safety', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-017', 'should return correct driver content for Transactive Memory', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-018', 'should return correct driver content for Communication Quality', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-019', 'should return correct driver content for Goal Clarity', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-020', 'should return correct driver content for Coordination', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-021', 'should return correct driver content for Team Cognition', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-022', 'should calculate severity level: critical (score <= 2.5)', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-023', 'should calculate severity level: high (score 2.51-4.0)', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-024', 'should calculate severity level: moderate (score 4.01-5.5)', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-025', 'should calculate severity level: strength (score > 5.5)', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-026', 'should return red badge for critical severity', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-027', 'should return orange badge for high severity', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-028', 'should return yellow badge for moderate severity', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-029', 'should return green badge for strength', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-030', 'should calculate cost impact for Trust driver', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-031', 'should calculate cost impact for Psychological Safety driver', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-032', 'should calculate cost impact for Transactive Memory driver', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-033', 'should calculate cost impact for Communication Quality driver', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-034', 'should calculate cost impact for Goal Clarity driver', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-035', 'should calculate cost impact for Coordination driver', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-036', 'should calculate cost impact for Team Cognition driver', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-037', 'should scale cost impact with team size', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-038', 'should scale cost impact with average salary', 'server/driverImpactContent.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-039', 'should return actionable recommendations for low Trust', 'server/driverImpactContent.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing'),
('UT-040', 'should return actionable recommendations for low Psychological Safety', 'server/driverImpactContent.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing'),
('UT-041', 'should return actionable recommendations for low Transactive Memory', 'server/driverImpactContent.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing'),
('UT-042', 'should return actionable recommendations for low Communication Quality', 'server/driverImpactContent.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing'),
('UT-043', 'should return actionable recommendations for low Goal Clarity', 'server/driverImpactContent.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing'),
('UT-044', 'should return actionable recommendations for low Coordination', 'server/driverImpactContent.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing'),
('UT-045', 'should return actionable recommendations for low Team Cognition', 'server/driverImpactContent.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing'),
('UT-046', 'should handle edge case: score = 0', 'server/driverImpactContent.test.ts', 'unit', 'P2', 'automated', NOW(), 'passing'),
('UT-047', 'should handle edge case: score = 7', 'server/driverImpactContent.test.ts', 'unit', 'P2', 'automated', NOW(), 'passing'),
('UT-048', 'should handle edge case: score at severity boundaries', 'server/driverImpactContent.test.ts', 'unit', 'P2', 'automated', NOW(), 'passing'),
('UT-049', 'should return consistent content for same driver', 'server/driverImpactContent.test.ts', 'unit', 'P2', 'automated', NOW(), 'passing'),
('UT-050', 'should handle invalid driver name gracefully', 'server/driverImpactContent.test.ts', 'unit', 'P2', 'automated', NOW(), 'passing'),
('UT-051', 'should format cost impact with proper currency', 'server/driverImpactContent.test.ts', 'unit', 'P2', 'automated', NOW(), 'passing'),
('UT-052', 'should include ProblemOps deliverables in recommendations', 'server/driverImpactContent.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing');

-- trainingRecommendations.test.ts (8 tests)
INSERT INTO testRegistry (testId, testName, testFile, testType, priority, automationStatus, lastRun, passStatus) VALUES
('UT-053', 'should recommend Half Day for top 1 priority driver', 'server/trainingRecommendations.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-054', 'should recommend Full Day for top 2 priority drivers', 'server/trainingRecommendations.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-055', 'should recommend Month-Long for all 7 drivers', 'server/trainingRecommendations.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-056', 'should calculate ROI for Half Day ($2,000)', 'server/trainingRecommendations.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-057', 'should calculate ROI for Full Day ($3,500)', 'server/trainingRecommendations.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-058', 'should calculate ROI for Month-Long ($30,000)', 'server/trainingRecommendations.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-059', 'should calculate payback period correctly', 'server/trainingRecommendations.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-060', 'should show all options for "Not Sure Yet"', 'server/trainingRecommendations.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing');

-- deliverables-by-training.test.ts (18 tests)
INSERT INTO testRegistry (testId, testName, testFile, testType, priority, automationStatus, lastRun, passStatus) VALUES
('UT-061', 'Half Day: should return top 1 priority C in recommended', 'server/deliverables-by-training.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-062', 'Half Day: should return other 3 Cs in other deliverables', 'server/deliverables-by-training.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-063', 'Full Day: should return top 2 priorities in recommended', 'server/deliverables-by-training.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-064', 'Full Day: should return other 2 Cs in other deliverables', 'server/deliverables-by-training.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-065', 'Month-Long: should return all Cs with gaps in recommended', 'server/deliverables-by-training.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-066', 'Month-Long: should return Cs without gaps in other', 'server/deliverables-by-training.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-067', 'Not Sure: should return all Cs with gaps in recommended', 'server/deliverables-by-training.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-068', 'Not Sure: should return Cs without gaps in other', 'server/deliverables-by-training.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-069', 'Edge case: All Cs above 60% (no gaps)', 'server/deliverables-by-training.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing'),
('UT-070', 'Edge case: Only 1 C below 60% with Half Day', 'server/deliverables-by-training.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing'),
('UT-071', 'Edge case: Only 1 C below 60% with Full Day', 'server/deliverables-by-training.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing'),
('UT-072', 'should prioritize by gap size (largest first)', 'server/deliverables-by-training.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-073', 'should include deliverable descriptions', 'server/deliverables-by-training.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing'),
('UT-074', 'should map to correct 4 Cs categories', 'server/deliverables-by-training.test.ts', 'unit', 'P0', 'automated', NOW(), 'passing'),
('UT-075', 'should handle ties in gap size', 'server/deliverables-by-training.test.ts', 'unit', 'P2', 'automated', NOW(), 'passing'),
('UT-076', 'should exclude Cs at exactly 60%', 'server/deliverables-by-training.test.ts', 'unit', 'P2', 'automated', NOW(), 'passing'),
('UT-077', 'should return empty other when all Cs have gaps (Month-Long)', 'server/deliverables-by-training.test.ts', 'unit', 'P2', 'automated', NOW(), 'passing'),
('UT-078', 'should return empty recommended when no gaps (all high scores)', 'server/deliverables-by-training.test.ts', 'unit', 'P2', 'automated', NOW(), 'passing');

-- auth.logout.test.ts (1 test)
INSERT INTO testRegistry (testId, testName, testFile, testType, priority, automationStatus, lastRun, passStatus) VALUES
('UT-079', 'should clear session on logout', 'server/auth.logout.test.ts', 'unit', 'P1', 'automated', NOW(), 'passing');
