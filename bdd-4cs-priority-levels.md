# BDD: 4 C's Priority Level Calculation

## Feature: Calculate Priority Levels for 4 C's Based on Driver Scores

**As a** user viewing assessment results  
**I want** the 4 C's priority levels to accurately reflect the average scores of their constituent drivers  
**So that** I can quickly identify which areas need the most urgent attention

---

## Business Rules

### Priority Level Thresholds
- **Critical Risk**: Score 1.0 - 2.5
- **High Risk**: Score 2.51 - 4.0  
- **Medium Risk**: Score 4.01 - 5.5
- **Low Risk**: Score 5.51 - 7.0

### 4 C's Composition
1. **Criteria** = average of (Communication Quality, Goal Clarity, Coordination)
2. **Commitment** = average of (Communication Quality, Trust, Goal Clarity)
3. **Change** = average of (Goal Clarity, Coordination)
4. **Collaboration** = average of (Transactive Memory, Trust, Psychological Safety, Coordination, Team Cognition)

### Calculation Method
- Each C's score is the arithmetic mean of its constituent driver scores
- Priority level is determined by which threshold range the score falls into
- Boundary values follow "less than or equal to" logic (e.g., 2.5 is Critical, 2.51 is High)

---

## Scenario 1: All Drivers Score 1.0 (All Critical)

**Given** all 7 drivers have a score of 1.0  
**When** the system calculates the 4 C's scores  
**Then** the following scores and priority levels should be displayed:

| C | Constituent Drivers | Calculated Score | Expected Priority Level |
|---|---|---|---|
| Criteria | Comm Quality (1.0), Goal Clarity (1.0), Coordination (1.0) | 1.0 | Critical Risk |
| Commitment | Comm Quality (1.0), Trust (1.0), Goal Clarity (1.0) | 1.0 | Critical Risk |
| Change | Goal Clarity (1.0), Coordination (1.0) | 1.0 | Critical Risk |
| Collaboration | TMS (1.0), Trust (1.0), Psych Safety (1.0), Coordination (1.0), Team Cognition (1.0) | 1.0 | Critical Risk |

**And** all 4 C's should display a red "Critical Risk" badge  
**And** all 4 C's should appear in the "Priority Focus Areas" section

---

## Scenario 2: Boundary Value - Exactly 2.5 (Critical)

**Given** a C has a calculated score of exactly 2.5  
**When** the system determines the priority level  
**Then** it should be classified as "Critical Risk"  
**And** display a red badge

---

## Scenario 3: Boundary Value - Exactly 2.51 (High)

**Given** a C has a calculated score of exactly 2.51  
**When** the system determines the priority level  
**Then** it should be classified as "High Risk"  
**And** display an orange badge

---

## Scenario 4: Boundary Value - Exactly 4.0 (High)

**Given** a C has a calculated score of exactly 4.0  
**When** the system determines the priority level  
**Then** it should be classified as "High Risk"  
**And** display an orange badge

---

## Scenario 5: Boundary Value - Exactly 4.01 (Medium)

**Given** a C has a calculated score of exactly 4.01  
**When** the system determines the priority level  
**Then** it should be classified as "Medium Risk"  
**And** display a yellow badge

---

## Scenario 6: Boundary Value - Exactly 5.5 (Medium)

**Given** a C has a calculated score of exactly 5.5  
**When** the system determines the priority level  
**Then** it should be classified as "Medium Risk"  
**And** display a yellow badge

---

## Scenario 7: Boundary Value - Exactly 5.51 (Low)

**Given** a C has a calculated score of exactly 5.51  
**When** the system determines the priority level  
**Then** it should be classified as "Low Risk"  
**And** display a green badge

---

## Scenario 8: Mixed Scores Across Different Risk Levels

**Given** the following driver scores:
- Communication Quality: 2.0 (Critical)
- Goal Clarity: 3.5 (High)
- Coordination: 5.0 (Medium)
- Trust: 1.5 (Critical)
- Psychological Safety: 4.5 (Medium)
- Transactive Memory: 6.0 (Low)
- Team Cognition: 6.5 (Low)

**When** the system calculates the 4 C's scores  
**Then** the following should be displayed:

| C | Calculation | Score | Expected Priority Level |
|---|---|---|---|
| Criteria | (2.0 + 3.5 + 5.0) / 3 | 3.5 | High Risk (orange) |
| Commitment | (2.0 + 1.5 + 3.5) / 3 | 2.33 | Critical Risk (red) |
| Change | (3.5 + 5.0) / 2 | 4.25 | Medium Risk (yellow) |
| Collaboration | (6.0 + 1.5 + 4.5 + 5.0 + 6.5) / 5 | 4.7 | Medium Risk (yellow) |

---

## Scenario 9: Current Bug - All 1's Shows Only One Critical

### Bug Report
**Location:** "Priority Focus Areas" section on Results page  
**Observed Behavior:** When all 7 drivers score 1.0, only "Criteria" shows as "Critical Risk" while the other 3 C's (Commitment, Change, Collaboration) incorrectly show as "Medium Risk"  
**Expected Behavior:** All 4 C's should show "Critical Risk" since their calculated scores are all 1.0

### Priority Level Thresholds (Expected)
| Score Range | Priority Level | Badge Color |
|---|---|---|
| 1.0 - 2.5 | Critical Risk | Red |
| 2.51 - 4.0 | High Risk | Orange |
| 4.01 - 5.5 | Medium Risk | Yellow |
| 5.51 - 7.0 | Low Risk | Green |

**Given** this is the CURRENT BUGGY BEHAVIOR  
**And** all 7 drivers have a score of 1.0  
**When** the system calculates the 4 C's scores  
**Then** INCORRECTLY only "Criteria" shows as "Critical Risk"  
**And** INCORRECTLY the other 3 C's show as "Medium Risk"  
**But** EXPECTED behavior is all 4 C's should show "Critical Risk"

**Root Cause Hypothesis:**  
The priority level calculation logic is using percentage-based thresholds (0-1 scale) instead of the raw driver score thresholds (1-7 scale), or the thresholds are incorrectly defined.

---

## Acceptance Criteria

✅ All 4 C's with score ≤ 2.5 display "Critical Risk" with red badge  
✅ All 4 C's with score 2.51-4.0 display "High Risk" with orange badge  
✅ All 4 C's with score 4.01-5.5 display "Medium Risk" with yellow badge  
✅ All 4 C's with score ≥ 5.51 display "Low Risk" with green badge  
✅ Boundary values are handled correctly (2.5, 2.51, 4.0, 4.01, 5.5, 5.51)  
✅ Priority levels match the driver severity level thresholds  
✅ All automated tests pass for all scenarios  
✅ Browser testing with all 1's shows all 4 C's as Critical

---

## Test Data

### Test Case 1: All Critical (Score = 1.0)
```json
{
  "drivers": {
    "communicationQuality": 1.0,
    "goalClarity": 1.0,
    "coordination": 1.0,
    "trust": 1.0,
    "psychologicalSafety": 1.0,
    "transactiveMemory": 1.0,
    "teamCognition": 1.0
  },
  "expected4Cs": {
    "criteria": { "score": 1.0, "level": "Critical Risk" },
    "commitment": { "score": 1.0, "level": "Critical Risk" },
    "change": { "score": 1.0, "level": "Critical Risk" },
    "collaboration": { "score": 1.0, "level": "Critical Risk" }
  }
}
```

### Test Case 2: All Boundaries
```json
{
  "testCases": [
    { "score": 2.5, "expected": "Critical Risk" },
    { "score": 2.51, "expected": "High Risk" },
    { "score": 4.0, "expected": "High Risk" },
    { "score": 4.01, "expected": "Medium Risk" },
    { "score": 5.5, "expected": "Medium Risk" },
    { "score": 5.51, "expected": "Low Risk" }
  ]
}
```

---

## Priority: P0 (Critical Bug)

This bug causes incorrect risk assessment display, potentially misleading users about which areas need urgent attention. Must be fixed before next release.
