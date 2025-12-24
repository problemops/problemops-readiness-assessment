import { generateTeamStory, getSeverityLevel } from '../client/src/lib/driverImpactContent.js';

/**
 * Test driver score display across various score combinations
 */

const TEST_CASES = [
  {
    name: 'All 1s (Critical)',
    scores: {
      trust: 1,
      psych_safety: 1,
      tms: 1,
      comm_quality: 1,
      goal_clarity: 1,
      coordination: 1,
      team_cognition: 1
    },
    expectedSeverity: 'critical'
  },
  {
    name: 'All 2s (Critical)',
    scores: {
      trust: 2,
      psych_safety: 2,
      tms: 2,
      comm_quality: 2,
      goal_clarity: 2,
      coordination: 2,
      team_cognition: 2
    },
    expectedSeverity: 'critical'
  },
  {
    name: 'All 3s (High Risk)',
    scores: {
      trust: 3,
      psych_safety: 3,
      tms: 3,
      comm_quality: 3,
      goal_clarity: 3,
      coordination: 3,
      team_cognition: 3
    },
    expectedSeverity: 'high'
  },
  {
    name: 'All 4s (High Risk)',
    scores: {
      trust: 4,
      psych_safety: 4,
      tms: 4,
      comm_quality: 4,
      goal_clarity: 4,
      coordination: 4,
      team_cognition: 4
    },
    expectedSeverity: 'high'
  },
  {
    name: 'All 5s (Moderate)',
    scores: {
      trust: 5,
      psych_safety: 5,
      tms: 5,
      comm_quality: 5,
      goal_clarity: 5,
      coordination: 5,
      team_cognition: 5
    },
    expectedSeverity: 'moderate'
  },
  {
    name: 'All 6s (Strength)',
    scores: {
      trust: 6,
      psych_safety: 6,
      tms: 6,
      comm_quality: 6,
      goal_clarity: 6,
      coordination: 6,
      team_cognition: 6
    },
    expectedSeverity: 'strength'
  },
  {
    name: 'All 7s (Strength)',
    scores: {
      trust: 7,
      psych_safety: 7,
      tms: 7,
      comm_quality: 7,
      goal_clarity: 7,
      coordination: 7,
      team_cognition: 7
    },
    expectedSeverity: 'strength'
  },
  {
    name: 'Mixed: Low trust (1), High others (6-7)',
    scores: {
      trust: 1,
      psych_safety: 6,
      tms: 7,
      comm_quality: 6,
      goal_clarity: 7,
      coordination: 6,
      team_cognition: 7
    },
    expectedSeverity: 'critical' // One critical driver makes overall critical
  },
  {
    name: 'Mixed: Varied scores (2, 3, 5, 6)',
    scores: {
      trust: 2,
      psych_safety: 3,
      tms: 5,
      comm_quality: 6,
      goal_clarity: 3,
      coordination: 5,
      team_cognition: 6
    },
    expectedSeverity: 'critical' // Has critical (trust=2)
  },
  {
    name: 'Mixed: All moderate to high (4-6)',
    scores: {
      trust: 4,
      psych_safety: 5,
      tms: 5,
      comm_quality: 6,
      goal_clarity: 4,
      coordination: 5,
      team_cognition: 6
    },
    expectedSeverity: 'high' // Has high risk (trust=4, goal_clarity=4)
  },
  {
    name: 'Edge case: Mix of 1 and 7',
    scores: {
      trust: 1,
      psych_safety: 7,
      tms: 1,
      comm_quality: 7,
      goal_clarity: 1,
      coordination: 7,
      team_cognition: 7
    },
    expectedSeverity: 'critical'
  }
];

function runTests() {
  console.log('='.repeat(80));
  console.log('DRIVER SCORE DISPLAY TEST SUITE');
  console.log('='.repeat(80));
  console.log('');
  
  let passed = 0;
  let failed = 0;
  const failures = [];
  
  TEST_CASES.forEach((testCase, index) => {
    console.log(`\nTest ${index + 1}: ${testCase.name}`);
    console.log('-'.repeat(80));
    
    try {
      const result = generateTeamStory(testCase.scores);
      
      // Verify each driver score is correctly reflected
      console.log('Driver Impacts:');
      result.driverImpacts.forEach(impact => {
        const dbKey = Object.keys(testCase.scores).find(key => {
          // Map content keys back to DB keys
          const mapping = {
            'trust': 'trust',
            'psychologicalSafety': 'psych_safety',
            'roleClarity': 'tms',
            'communication': 'comm_quality',
            'goalAlignment': 'goal_clarity',
            'conflictResolution': 'coordination',
            'decisionMaking': 'team_cognition'
          };
          return mapping[impact.driverKey] === key;
        });
        
        const expectedScore = dbKey ? testCase.scores[dbKey] : null;
        const actualScore = impact.score;
        const match = expectedScore === actualScore ? '✓' : '✗';
        
        console.log(`  ${match} ${impact.driverName}: ${actualScore}/7 (expected: ${expectedScore}/7) - ${impact.severityLabel}`);
        
        if (expectedScore !== actualScore) {
          failures.push({
            test: testCase.name,
            driver: impact.driverName,
            expected: expectedScore,
            actual: actualScore
          });
          failed++;
        } else {
          passed++;
        }
      });
      
      // Verify overall severity
      const severityMatch = result.overallSeverity === testCase.expectedSeverity ? '✓' : '✗';
      console.log(`\n  ${severityMatch} Overall Severity: ${result.overallSeverity} (expected: ${testCase.expectedSeverity})`);
      
      if (result.overallSeverity !== testCase.expectedSeverity) {
        failures.push({
          test: testCase.name,
          driver: 'Overall',
          expected: testCase.expectedSeverity,
          actual: result.overallSeverity
        });
        failed++;
      } else {
        passed++;
      }
      
      // Show strengths and concerns count
      console.log(`  Strengths: ${result.strengths.length}`);
      console.log(`  Concerns: ${result.concerns.length}`);
      
    } catch (error) {
      console.error(`  ✗ ERROR: ${error.message}`);
      failures.push({
        test: testCase.name,
        error: error.message
      });
      failed++;
    }
  });
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${TEST_CASES.length}`);
  console.log(`Assertions Passed: ${passed}`);
  console.log(`Assertions Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failures.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('FAILURES:');
    console.log('='.repeat(80));
    failures.forEach(f => {
      if (f.error) {
        console.log(`✗ ${f.test}: ${f.error}`);
      } else {
        console.log(`✗ ${f.test} - ${f.driver}: Expected ${f.expected}, got ${f.actual}`);
      }
    });
  }
  
  console.log('\n' + '='.repeat(80));
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
