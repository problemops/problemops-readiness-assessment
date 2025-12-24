# Master Test Registry Schema

## Purpose
Centralized database table to store metadata for all tests in the project, enabling:
- Quick retrieval of full test suite
- Test coverage tracking
- Regression test planning
- Test categorization and filtering

## Schema Design

```sql
CREATE TABLE test_registry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- Test Identification
  test_id TEXT NOT NULL UNIQUE,           -- Unique identifier (e.g., "unit-assessment-001", "bdd-epic1-scenario1.1")
  test_type TEXT NOT NULL,                -- "unit", "integration", "bdd", "browser", "api"
  test_category TEXT NOT NULL,            -- "logic", "ui", "accessibility", "data-flow", "roi-calculation"
  
  -- Test Details
  test_suite TEXT NOT NULL,               -- File or epic name (e.g., "assessment.test.ts", "Epic 1: Color Contrast")
  test_name TEXT NOT NULL,                -- Test or scenario title
  description TEXT,                       -- What the test validates
  
  -- BDD Structure (for BDD scenarios)
  given_context TEXT,                     -- Given clause
  when_action TEXT,                       -- When clause
  then_outcome TEXT,                      -- Then clause
  additional_expectations TEXT,           -- Additional expectations
  
  -- Test Metadata
  priority TEXT NOT NULL DEFAULT 'P2',   -- P0 (critical), P1 (high), P2 (medium), P3 (low)
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PENDING, SKIPPED, DEPRECATED
  is_automated BOOLEAN NOT NULL DEFAULT 0, -- 0 = manual/BDD doc, 1 = automated test
  
  -- Implementation Details
  file_path TEXT,                         -- Path to test file (for automated tests)
  implementation_location TEXT,           -- Where the feature is implemented
  test_coverage_method TEXT,              -- How it's tested (e.g., "vitest unit test", "manual inspection")
  
  -- Tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_run_at TIMESTAMP,
  last_run_status TEXT,                   -- PASS, FAIL, SKIPPED
  
  -- Notes
  notes TEXT
);

CREATE INDEX idx_test_type ON test_registry(test_type);
CREATE INDEX idx_test_category ON test_registry(test_category);
CREATE INDEX idx_priority ON test_registry(priority);
CREATE INDEX idx_status ON test_registry(status);
CREATE INDEX idx_is_automated ON test_registry(is_automated);
```

## Test Types

1. **unit**: Unit tests (vitest)
2. **integration**: Integration tests
3. **bdd**: BDD scenarios (documented or automated)
4. **browser**: Browser automation tests
5. **api**: API endpoint tests

## Test Categories

1. **logic**: Business logic, calculations, algorithms
2. **ui**: User interface, components, interactions
3. **accessibility**: WCAG compliance, keyboard navigation
4. **data-flow**: Data validation, state management
5. **roi-calculation**: ROI formulas, financial calculations
6. **training-options**: Training type logic, deliverables
7. **driver-scoring**: Driver scoring, severity levels

## Priority Levels

- **P0**: Critical functionality, must never break
- **P1**: High priority, core features
- **P2**: Medium priority, important but not critical
- **P3**: Low priority, nice-to-have

## Example Records

### Unit Test Example
```sql
INSERT INTO test_registry (
  test_id, test_type, test_category, test_suite, test_name, description,
  priority, status, is_automated, file_path, implementation_location,
  test_coverage_method
) VALUES (
  'unit-assessment-create-001',
  'unit',
  'data-flow',
  'assessment.test.ts',
  'should create assessment with valid data',
  'Validates that assessment creation works with all required fields',
  'P0',
  'ACTIVE',
  1,
  '/server/assessment.test.ts',
  '/server/assessment.ts',
  'vitest unit test'
);
```

### BDD Scenario Example
```sql
INSERT INTO test_registry (
  test_id, test_type, test_category, test_suite, test_name, description,
  given_context, when_action, then_outcome, additional_expectations,
  priority, status, is_automated, implementation_location,
  test_coverage_method
) VALUES (
  'bdd-epic1-scenario1.1',
  'bdd',
  'accessibility',
  'Epic 1: Color Contrast Compliance',
  'Training type descriptions meet 4.5:1 contrast ratio',
  'Ensures training option text is readable',
  'a user views the training options on the assessment page',
  'they read the training type descriptions',
  'the text should have a contrast ratio of at least 4.5:1 against the background',
  'the text should be readable in both light and dark modes',
  'P0',
  'ACTIVE',
  0,
  '/client/src/index.css',
  'Manual visual inspection + color contrast analyzer'
);
```

## Query Examples

### Get all automated tests
```sql
SELECT * FROM test_registry WHERE is_automated = 1;
```

### Get all P0 tests
```sql
SELECT * FROM test_registry WHERE priority = 'P0' ORDER BY test_suite, test_name;
```

### Get test coverage by category
```sql
SELECT 
  test_category,
  COUNT(*) as total_tests,
  SUM(CASE WHEN is_automated = 1 THEN 1 ELSE 0 END) as automated_tests,
  SUM(CASE WHEN is_automated = 0 THEN 1 ELSE 0 END) as manual_tests
FROM test_registry
GROUP BY test_category;
```

### Get full regression test suite
```sql
SELECT 
  test_id,
  test_type,
  test_category,
  test_suite,
  test_name,
  priority,
  is_automated,
  test_coverage_method
FROM test_registry
WHERE status = 'ACTIVE'
ORDER BY priority, test_suite, test_name;
```
