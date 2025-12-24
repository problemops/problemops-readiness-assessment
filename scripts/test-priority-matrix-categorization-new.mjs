#!/usr/bin/env node
/**
 * Test Priority Matrix Categorization Logic
 * Verifies that drivers are correctly categorized based on score ranges:
 * 1.0 - 2.5: Critical
 * 2.51 - 4.0: Monitor
 * 4.01 - 5.5: Stable
 * 5.51 - 7.0: Strength
 */

function getQuadrant(driver) {
  if (driver.value <= 2.5) return "critical";
  if (driver.value <= 4.0) return "monitor";
  if (driver.value <= 5.5) return "stable";
  return "strength";
}

function categorizeDrivers(drivers) {
  return drivers.map(d => ({ ...d, quadrant: getQuadrant(d) }));
}

const testScenarios = [
  {
    name: "All 1s (Critical)",
    drivers: Array(7).fill(null).map((_, i) => ({ 
      id: `driver${i}`, name: `Driver ${i}`, value: 1, weight: 0.14 
    })),
    expected: { critical: 7, monitor: 0, stable: 0, strength: 0 }
  },
  {
    name: "All 2.5 (Critical - boundary)",
    drivers: Array(7).fill(null).map((_, i) => ({ 
      id: `driver${i}`, name: `Driver ${i}`, value: 2.5, weight: 0.14 
    })),
    expected: { critical: 7, monitor: 0, stable: 0, strength: 0 }
  },
  {
    name: "All 2.51 (Monitor - just above boundary)",
    drivers: Array(7).fill(null).map((_, i) => ({ 
      id: `driver${i}`, name: `Driver ${i}`, value: 2.51, weight: 0.14 
    })),
    expected: { critical: 0, monitor: 7, stable: 0, strength: 0 }
  },
  {
    name: "All 4.0 (Monitor - boundary)",
    drivers: Array(7).fill(null).map((_, i) => ({ 
      id: `driver${i}`, name: `Driver ${i}`, value: 4.0, weight: 0.14 
    })),
    expected: { critical: 0, monitor: 7, stable: 0, strength: 0 }
  },
  {
    name: "All 4.01 (Stable - just above boundary)",
    drivers: Array(7).fill(null).map((_, i) => ({ 
      id: `driver${i}`, name: `Driver ${i}`, value: 4.01, weight: 0.14 
    })),
    expected: { critical: 0, monitor: 0, stable: 7, strength: 0 }
  },
  {
    name: "All 5.5 (Stable - boundary)",
    drivers: Array(7).fill(null).map((_, i) => ({ 
      id: `driver${i}`, name: `Driver ${i}`, value: 5.5, weight: 0.14 
    })),
    expected: { critical: 0, monitor: 0, stable: 7, strength: 0 }
  },
  {
    name: "All 5.51 (Strength - just above boundary)",
    drivers: Array(7).fill(null).map((_, i) => ({ 
      id: `driver${i}`, name: `Driver ${i}`, value: 5.51, weight: 0.14 
    })),
    expected: { critical: 0, monitor: 0, stable: 0, strength: 7 }
  },
  {
    name: "All 6.0 (Strength)",
    drivers: Array(7).fill(null).map((_, i) => ({ 
      id: `driver${i}`, name: `Driver ${i}`, value: 6.0, weight: 0.14 
    })),
    expected: { critical: 0, monitor: 0, stable: 0, strength: 7 }
  },
  {
    name: "All 7s (Strength)",
    drivers: Array(7).fill(null).map((_, i) => ({ 
      id: `driver${i}`, name: `Driver ${i}`, value: 7, weight: 0.14 
    })),
    expected: { critical: 0, monitor: 0, stable: 0, strength: 7 }
  },
  {
    name: "Mixed scores across all categories",
    drivers: [
      { id: "d1", name: "Driver 1", value: 1.5, weight: 0.14 },    // Critical
      { id: "d2", name: "Driver 2", value: 2.5, weight: 0.14 },    // Critical
      { id: "d3", name: "Driver 3", value: 3.0, weight: 0.14 },    // Monitor
      { id: "d4", name: "Driver 4", value: 4.0, weight: 0.14 },    // Monitor
      { id: "d5", name: "Driver 5", value: 5.0, weight: 0.14 },    // Stable
      { id: "d6", name: "Driver 6", value: 5.5, weight: 0.14 },    // Stable
      { id: "d7", name: "Driver 7", value: 6.5, weight: 0.14 },    // Strength
    ],
    expected: { critical: 2, monitor: 2, stable: 2, strength: 1 }
  }
];

// Run tests
let totalTests = 0;
let passedTests = 0;

console.log("\n🧪 Priority Matrix Categorization Tests");
console.log("Score Ranges: 1-2.5=Critical, 2.51-4=Monitor, 4.01-5.5=Stable, 5.51-7=Strength");
console.log("=".repeat(80));

testScenarios.forEach(scenario => {
  console.log(`\n📋 ${scenario.name}`);
  console.log("-".repeat(80));
  
  const categorized = categorizeDrivers(scenario.drivers);
  const counts = {
    critical: categorized.filter(d => d.quadrant === "critical").length,
    monitor: categorized.filter(d => d.quadrant === "monitor").length,
    stable: categorized.filter(d => d.quadrant === "stable").length,
    strength: categorized.filter(d => d.quadrant === "strength").length
  };
  
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
