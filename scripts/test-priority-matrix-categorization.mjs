#!/usr/bin/env node
/**
 * Test Priority Matrix Categorization Logic
 * Verifies that drivers are correctly categorized into quadrants based on scores
 */

// Simulate the categorization logic from PriorityMatrix.tsx
function getQuadrant(driver) {
  // Pure 4-tier score-based categorization:
  // 1.0 - 2.5: Critical
  // 2.51 - 4.0: Monitor
  // 4.01 - 6.0: Stable
  // 6.01 - 7.0: Strength
  if (driver.value <= 2.5) {
    return "critical";
  } else if (driver.value <= 4.0) {
    return "monitor";
  } else if (driver.value <= 6.0) {
    return "stable";
  } else {
    return "strength";
  }
}

function categorizeDrivers(drivers) {
  return drivers.map(d => ({
    ...d,
    quadrant: getQuadrant(d)
  }));
}

// Test scenarios
const testScenarios = [
  {
    name: "All 1s (Critical Dysfunction)",
    drivers: [
      { id: "trust", name: "Trust", value: 1, weight: 0.18 },
      { id: "psych_safety", name: "Psychological Safety", value: 1, weight: 0.16 },
      { id: "tms", name: "Transactive Memory", value: 1, weight: 0.14 },
      { id: "comm_quality", name: "Communication Quality", value: 1, weight: 0.15 },
      { id: "goal_clarity", name: "Goal Clarity", value: 1, weight: 0.13 },
      { id: "coordination", name: "Coordination", value: 1, weight: 0.12 },
      { id: "team_cognition", name: "Team Cognition", value: 1, weight: 0.12 },
    ],
    expected: {
      critical: 7, // All scores <= 2.5
      monitor: 0,
      strength: 0,
      stable: 0
    }
  },
  {
    name: "All 7s (Optimal Performance)",
    drivers: [
      { id: "trust", name: "Trust", value: 7, weight: 0.18 },
      { id: "psych_safety", name: "Psychological Safety", value: 7, weight: 0.16 },
      { id: "tms", name: "Transactive Memory", value: 7, weight: 0.14 },
      { id: "comm_quality", name: "Communication Quality", value: 7, weight: 0.15 },
      { id: "goal_clarity", name: "Goal Clarity", value: 7, weight: 0.13 },
      { id: "coordination", name: "Coordination", value: 7, weight: 0.12 },
      { id: "team_cognition", name: "Team Cognition", value: 7, weight: 0.12 },
    ],
    expected: {
      critical: 0,
      monitor: 0,
      strength: 7, // All scores > 6.0
      stable: 0
    }
  },
  {
    name: "Mixed Scores (Realistic)",
    drivers: [
      { id: "trust", name: "Trust", value: 3.5, weight: 0.18 }, // Monitor (3.01-4, high impact)
      { id: "psych_safety", name: "Psychological Safety", value: 6.0, weight: 0.16 }, // Stable (4.01-6)
      { id: "tms", name: "Transactive Memory", value: 4.0, weight: 0.14 }, // Monitor (exactly 4.0, high impact)
      { id: "comm_quality", name: "Communication Quality", value: 6.5, weight: 0.15 }, // Strength (6.01-7)
      { id: "goal_clarity", name: "Goal Clarity", value: 3.0, weight: 0.13 }, // Monitor (1-3, low impact)
      { id: "coordination", name: "Coordination", value: 5.5, weight: 0.12 }, // Stable (4.01-6)
      { id: "team_cognition", name: "Team Cognition", value: 4.5, weight: 0.12 }, // Stable (4.01-6)
    ],
    expected: {
      critical: 0,
      monitor: 3,  // Trust (3.5), TMS (4.0), Goal Clarity (3.0)
      strength: 1, // Comm Quality (6.5)
      stable: 3    // Psych Safety (6.0), Coordination (5.5), Team Cognition (4.5)
    }
  },
  {
    name: "Edge Case: Score exactly 3.0",
    drivers: [
      { id: "trust", name: "Trust", value: 3.0, weight: 0.18 }, // Critical (1-3, high impact)
      { id: "psych_safety", name: "Psychological Safety", value: 3.0, weight: 0.16 },
      { id: "tms", name: "Transactive Memory", value: 3.0, weight: 0.14 },
      { id: "comm_quality", name: "Communication Quality", value: 3.0, weight: 0.15 },
      { id: "goal_clarity", name: "Goal Clarity", value: 3.0, weight: 0.13 },
      { id: "coordination", name: "Coordination", value: 3.0, weight: 0.12 },
      { id: "team_cognition", name: "Team Cognition", value: 3.0, weight: 0.12 },
    ],
    expected: {
      critical: 4, // Top 4 weights, all <= 3.0
      monitor: 3,  // Bottom 3 weights, all <= 3.0
      strength: 0,
      stable: 0
    }
  },
  {
    name: "Edge Case: Score 3.01 (just above 3.0)",
    drivers: [
      { id: "trust", name: "Trust", value: 3.01, weight: 0.18 }, // Monitor (3.01-4, high impact)
      { id: "psych_safety", name: "Psychological Safety", value: 3.01, weight: 0.16 },
      { id: "tms", name: "Transactive Memory", value: 3.01, weight: 0.14 },
      { id: "comm_quality", name: "Communication Quality", value: 3.01, weight: 0.15 },
      { id: "goal_clarity", name: "Goal Clarity", value: 3.01, weight: 0.13 },
      { id: "coordination", name: "Coordination", value: 3.01, weight: 0.12 },
      { id: "team_cognition", name: "Team Cognition", value: 3.01, weight: 0.12 },
    ],
    expected: {
      critical: 0,
      monitor: 4,  // Top 4 weights, all 3.01-4
      strength: 0,
      stable: 3    // Bottom 3 weights, all 3.01-4
    }
  },
  {
    name: "Edge Case: Score exactly 4.0",
    drivers: [
      { id: "trust", name: "Trust", value: 4.0, weight: 0.18 }, // Monitor (3.01-4, high impact)
      { id: "psych_safety", name: "Psychological Safety", value: 4.0, weight: 0.16 },
      { id: "tms", name: "Transactive Memory", value: 4.0, weight: 0.14 },
      { id: "comm_quality", name: "Communication Quality", value: 4.0, weight: 0.15 },
      { id: "goal_clarity", name: "Goal Clarity", value: 4.0, weight: 0.13 },
      { id: "coordination", name: "Coordination", value: 4.0, weight: 0.12 },
      { id: "team_cognition", name: "Team Cognition", value: 4.0, weight: 0.12 },
    ],
    expected: {
      critical: 0,
      monitor: 4,  // Top 4 weights, all <= 4.0
      strength: 0,
      stable: 3    // Bottom 3 weights, all <= 4.0
    }
  },
  {
    name: "Edge Case: Score 4.01 (just above 4.0)",
    drivers: [
      { id: "trust", name: "Trust", value: 4.01, weight: 0.18 }, // Stable (4.01-6)
      { id: "psych_safety", name: "Psychological Safety", value: 4.01, weight: 0.16 },
      { id: "tms", name: "Transactive Memory", value: 4.01, weight: 0.14 },
      { id: "comm_quality", name: "Communication Quality", value: 4.01, weight: 0.15 },
      { id: "goal_clarity", name: "Goal Clarity", value: 4.01, weight: 0.13 },
      { id: "coordination", name: "Coordination", value: 4.01, weight: 0.12 },
      { id: "team_cognition", name: "Team Cognition", value: 4.01, weight: 0.12 },
    ],
    expected: {
      critical: 0,
      monitor: 0,
      strength: 0,
      stable: 7    // All 4.01-6
    }
  },
  {
    name: "Edge Case: Score exactly 6.0",
    drivers: [
      { id: "trust", name: "Trust", value: 6.0, weight: 0.18 }, // Stable (4.01-6)
      { id: "psych_safety", name: "Psychological Safety", value: 6.0, weight: 0.16 },
      { id: "tms", name: "Transactive Memory", value: 6.0, weight: 0.14 },
      { id: "comm_quality", name: "Communication Quality", value: 6.0, weight: 0.15 },
      { id: "goal_clarity", name: "Goal Clarity", value: 6.0, weight: 0.13 },
      { id: "coordination", name: "Coordination", value: 6.0, weight: 0.12 },
      { id: "team_cognition", name: "Team Cognition", value: 6.0, weight: 0.12 },
    ],
    expected: {
      critical: 0,
      monitor: 0,
      strength: 0,
      stable: 7    // All <= 6.0
    }
  },
  {
    name: "Edge Case: Score 6.01 (just above 6.0)",
    drivers: [
      { id: "trust", name: "Trust", value: 6.01, weight: 0.18 }, // Strength (6.01-7)
      { id: "psych_safety", name: "Psychological Safety", value: 6.01, weight: 0.16 },
      { id: "tms", name: "Transactive Memory", value: 6.01, weight: 0.14 },
      { id: "comm_quality", name: "Communication Quality", value: 6.01, weight: 0.15 },
      { id: "goal_clarity", name: "Goal Clarity", value: 6.01, weight: 0.13 },
      { id: "coordination", name: "Coordination", value: 6.01, weight: 0.12 },
      { id: "team_cognition", name: "Team Cognition", value: 6.01, weight: 0.12 },
    ],
    expected: {
      critical: 0,
      monitor: 0,
      strength: 7, // All > 6.0
      stable: 0
    }
  }
];

// Run tests
let totalTests = 0;
let passedTests = 0;

console.log("\n🧪 Priority Matrix Categorization Tests\n");
console.log("=" .repeat(80));

testScenarios.forEach(scenario => {
  console.log(`\n📋 ${scenario.name}`);
  console.log("-".repeat(80));
  
  const categorized = categorizeDrivers(scenario.drivers);
  
  const counts = {
    critical: categorized.filter(d => d.quadrant === "critical").length,
    monitor: categorized.filter(d => d.quadrant === "monitor").length,
    strength: categorized.filter(d => d.quadrant === "strength").length,
    stable: categorized.filter(d => d.quadrant === "stable").length
  };
  
  // Display categorization
  console.log("\nCategorization Results:");
  ["critical", "strength", "monitor", "stable"].forEach(quadrant => {
    const drivers = categorized.filter(d => d.quadrant === quadrant);
    if (drivers.length > 0) {
      console.log(`  ${quadrant.toUpperCase()}: ${drivers.map(d => `${d.name} (${d.value})`).join(", ")}`);
    }
  });
  
  // Verify counts
  console.log("\nExpected vs Actual:");
  let scenarioPassed = true;
  Object.keys(scenario.expected).forEach(quadrant => {
    const expected = scenario.expected[quadrant];
    const actual = counts[quadrant];
    const passed = expected === actual;
    scenarioPassed = scenarioPassed && passed;
    totalTests++;
    if (passed) passedTests++;
    
    const status = passed ? "✅" : "❌";
    console.log(`  ${status} ${quadrant}: expected ${expected}, got ${actual}`);
  });
  
  console.log(`\n${scenarioPassed ? "✅ PASS" : "❌ FAIL"}`);
});

console.log("\n" + "=".repeat(80));
console.log(`\n📊 Test Summary: ${passedTests}/${totalTests} tests passed (${Math.round(passedTests/totalTests*100)}%)\n`);

process.exit(passedTests === totalTests ? 0 : 1);
