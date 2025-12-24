# BDD Specification: Action Priority Matrix Redesign

**Document Version:** 1.0  
**Created:** December 24, 2024  
**Author:** Manus AI  
**Status:** Draft for Review

---

## Executive Summary

This specification defines the redesigned Action Priority Matrix feature that plots the 7 team effectiveness drivers on a 2x2 matrix based on two research-grounded dimensions: **Team Performance Impact** and **Business Value If Fixed**. The matrix uses industry-specific weights derived from meta-analysis data to provide contextually relevant prioritization recommendations.

---

## Research Foundation

The weight calculations are grounded in peer-reviewed meta-analyses of team effectiveness research:

| Driver | Correlation (r) | Source | Sample Size |
|--------|----------------|--------|-------------|
| Team Cognition | 0.35 | DeChurch & Mesmer-Magnus (2010) | 65 studies |
| Trust | 0.33 | Costa & Anderson (2011) | 112 studies |
| Communication Quality | 0.31 | Marlow et al. (2018) | 150 studies |
| Coordination | 0.29 | LePine et al. (2008) | 138 studies |
| Goal Clarity | 0.28 | Mathieu et al. (2008) | Meta-analysis |
| Psychological Safety | 0.27 | Frazier et al. (2017) | 117 samples |
| Transactive Memory | 0.26 | DeChurch & Mesmer-Magnus (2010) | 65 studies |

---

## Weight Configuration

### Team Performance Impact Weights (Constant Across Industries)

These weights reflect how much a driver deficiency affects daily team operations including delivery times, rework, iteration velocity, conflict, motivation, and psychological wellbeing.

| Driver | Weight | Normalized from r |
|--------|--------|-------------------|
| Team Cognition | 1.00 | r = 0.35 (highest) |
| Trust | 0.94 | r = 0.33 |
| Communication Quality | 0.89 | r = 0.31 |
| Coordination | 0.83 | r = 0.29 |
| Goal Clarity | 0.80 | r = 0.28 |
| Psychological Safety | 0.77 | r = 0.27 |
| Transactive Memory | 0.74 | r = 0.26 |

### Business Value Weights by Industry

These weights reflect how much fixing a driver deficiency impacts business outcomes including launch success, support tickets, customer loyalty, and financial returns.

| Driver | Software | Healthcare | Financial | Government | Hospitality | Manufacturing | Prof Services |
|--------|----------|------------|-----------|------------|-------------|---------------|---------------|
| Trust | 0.94 | 1.00 | 0.94 | 0.94 | 1.00 | 0.94 | 1.00 |
| Psych Safety | 0.89 | 0.89 | 0.82 | 0.77 | 0.82 | 0.77 | 0.82 |
| Comm Quality | 1.00 | 1.00 | 1.00 | 0.94 | 0.94 | 0.89 | 1.00 |
| Goal Clarity | 0.85 | 0.85 | 0.85 | 0.92 | 0.80 | 0.85 | 0.85 |
| Coordination | 0.95 | 0.88 | 0.83 | 0.83 | 0.83 | 0.95 | 0.88 |
| TMS | 0.79 | 0.79 | 0.74 | 0.74 | 0.69 | 0.85 | 0.85 |
| Team Cognition | 1.00 | 1.00 | 1.00 | 0.90 | 0.85 | 0.90 | 1.00 |

---

## Calculation Formula

### Step 1: Calculate Gap
```
Gap = 7 - Score
```
Where Score is the driver's assessment result (1-7 scale).

### Step 2: Calculate Weighted Scores
```
Team Impact Score = Gap × Team Performance Weight
Business Value Score = Gap × Business Value Weight (industry-specific)
```

### Step 3: Determine Quadrant
Using threshold of **2.5**:

| Quadrant | Team Impact | Business Value |
|----------|-------------|----------------|
| CRITICAL | ≥ 2.5 | ≥ 2.5 |
| HIGH | < 2.5 | ≥ 2.5 |
| MEDIUM | ≥ 2.5 | < 2.5 |
| LOW | < 2.5 | < 2.5 |

---

## Feature: Industry Detection

### Scenario 1: Successful Website Classification
```gherkin
Given a user enters company website "https://acme-software.com"
And the website contains text about "cloud platform, SaaS, API integrations"
When the assessment is submitted
Then the system should call the LLM classifier
And detect industry as "Software & Technology"
And store the industry in the assessments table
And display "Detected Industry: Software & Technology" on the Results page
```

### Scenario 2: Unreachable Website Fallback
```gherkin
Given a user enters company website "https://invalid-domain-xyz.com"
When the assessment is submitted
And the website cannot be reached
Then the system should default to "Professional Services"
And store "Professional Services" in the assessments table
And display "Detected Industry: Professional Services" on the Results page
```

### Scenario 3: Empty Website Field
```gherkin
Given a user leaves the company website field empty
When the assessment is submitted
Then the system should default to "Professional Services"
And use Professional Services business value weights
```

### Scenario 4: Healthcare Website Detection
```gherkin
Given a user enters company website "https://regional-hospital.org"
And the website contains text about "patient care, clinical services, medical staff"
When the assessment is submitted
Then the system should detect industry as "Healthcare & Medical"
And apply Healthcare business value weights to the priority matrix
```

### Scenario 5: Government Website Detection
```gherkin
Given a user enters company website "https://cityofspringfield.gov"
And the website contains text about "public services, city council, permits"
When the assessment is submitted
Then the system should detect industry as "Government & Public Sector"
And apply Government business value weights to the priority matrix
```

### Scenario 6: Manufacturing Website Detection
```gherkin
Given a user enters company website "https://precision-parts-mfg.com"
And the website contains text about "manufacturing, production, supply chain, quality control"
When the assessment is submitted
Then the system should detect industry as "Manufacturing & Industrial"
And apply Manufacturing business value weights to the priority matrix
```

### Scenario 7: Financial Services Website Detection
```gherkin
Given a user enters company website "https://capital-investments.com"
And the website contains text about "investment management, portfolio, financial advisory"
When the assessment is submitted
Then the system should detect industry as "Financial Services"
And apply Financial Services business value weights to the priority matrix
```

---

## Feature: Priority Matrix Calculation

### Scenario 8: Software Company - Mixed Scores
```gherkin
Given an assessment with the following driver scores:
  | Driver | Score |
  | Trust | 3.2 |
  | Psychological Safety | 2.8 |
  | Communication Quality | 4.5 |
  | Goal Clarity | 2.1 |
  | Coordination | 3.8 |
  | Transactive Memory | 5.2 |
  | Team Cognition | 4.0 |
And the detected industry is "Software & Technology"
When the priority matrix is calculated
Then the calculations should be:
  | Driver | Gap | Team Weight | Team Impact | Biz Weight | Biz Value | Quadrant |
  | Trust | 3.8 | 0.94 | 3.57 | 0.94 | 3.57 | CRITICAL |
  | Psych Safety | 4.2 | 0.77 | 3.23 | 0.89 | 3.74 | CRITICAL |
  | Comm Quality | 2.5 | 0.89 | 2.23 | 1.00 | 2.50 | HIGH |
  | Goal Clarity | 4.9 | 0.80 | 3.92 | 0.85 | 4.17 | CRITICAL |
  | Coordination | 3.2 | 0.83 | 2.66 | 0.95 | 3.04 | HIGH |
  | TMS | 1.8 | 0.74 | 1.33 | 0.79 | 1.42 | LOW |
  | Team Cognition | 3.0 | 1.00 | 3.00 | 1.00 | 3.00 | CRITICAL |
And the matrix should display:
  | Quadrant | Drivers |
  | CRITICAL | Trust, Psych Safety, Goal Clarity, Team Cognition |
  | HIGH | Comm Quality, Coordination |
  | MEDIUM | (none) |
  | LOW | TMS |
```

### Scenario 9: Healthcare Organization - Crisis State (All Low Scores)
```gherkin
Given an assessment with all driver scores at 1.5
And the detected industry is "Healthcare & Medical"
When the priority matrix is calculated
Then the calculations should be:
  | Driver | Gap | Team Weight | Team Impact | Biz Weight | Biz Value | Quadrant |
  | Trust | 5.5 | 0.94 | 5.17 | 1.00 | 5.50 | CRITICAL |
  | Psych Safety | 5.5 | 0.77 | 4.24 | 0.89 | 4.90 | CRITICAL |
  | Comm Quality | 5.5 | 0.89 | 4.90 | 1.00 | 5.50 | CRITICAL |
  | Goal Clarity | 5.5 | 0.80 | 4.40 | 0.85 | 4.68 | CRITICAL |
  | Coordination | 5.5 | 0.83 | 4.57 | 0.88 | 4.84 | CRITICAL |
  | TMS | 5.5 | 0.74 | 4.07 | 0.79 | 4.35 | CRITICAL |
  | Team Cognition | 5.5 | 1.00 | 5.50 | 1.00 | 5.50 | CRITICAL |
And all 7 drivers should appear in the CRITICAL quadrant
```

### Scenario 10: High-Performing Hospitality Team
```gherkin
Given an assessment with the following driver scores:
  | Driver | Score |
  | Trust | 6.2 |
  | Psychological Safety | 5.8 |
  | Communication Quality | 6.5 |
  | Goal Clarity | 5.5 |
  | Coordination | 6.0 |
  | Transactive Memory | 4.8 |
  | Team Cognition | 5.2 |
And the detected industry is "Hospitality & Service"
When the priority matrix is calculated
Then the calculations should be:
  | Driver | Gap | Team Weight | Team Impact | Biz Weight | Biz Value | Quadrant |
  | Trust | 0.8 | 0.94 | 0.75 | 1.00 | 0.80 | LOW |
  | Psych Safety | 1.2 | 0.77 | 0.92 | 0.82 | 0.98 | LOW |
  | Comm Quality | 0.5 | 0.89 | 0.45 | 0.94 | 0.47 | LOW |
  | Goal Clarity | 1.5 | 0.80 | 1.20 | 0.80 | 1.20 | LOW |
  | Coordination | 1.0 | 0.83 | 0.83 | 0.83 | 0.83 | LOW |
  | TMS | 2.2 | 0.74 | 1.63 | 0.69 | 1.52 | LOW |
  | Team Cognition | 1.8 | 1.00 | 1.80 | 0.85 | 1.53 | LOW |
And all 7 drivers should appear in the LOW quadrant
And the matrix should indicate "Team is performing well"
```

### Scenario 11: Government Agency - Goal Clarity Crisis
```gherkin
Given an assessment with the following driver scores:
  | Driver | Score |
  | Trust | 5.0 |
  | Psychological Safety | 4.5 |
  | Communication Quality | 4.0 |
  | Goal Clarity | 1.5 |
  | Coordination | 4.2 |
  | Transactive Memory | 4.8 |
  | Team Cognition | 4.5 |
And the detected industry is "Government & Public Sector"
When the priority matrix is calculated
Then Goal Clarity should be in CRITICAL quadrant
And Trust should be in LOW quadrant
And the matrix should highlight Goal Clarity as the primary focus area
```

### Scenario 12: Manufacturing - Coordination Focus
```gherkin
Given an assessment with the following driver scores:
  | Driver | Score |
  | Trust | 5.5 |
  | Psychological Safety | 5.0 |
  | Communication Quality | 4.5 |
  | Goal Clarity | 5.0 |
  | Coordination | 2.0 |
  | Transactive Memory | 3.5 |
  | Team Cognition | 4.5 |
And the detected industry is "Manufacturing & Industrial"
When the priority matrix is calculated
Then Coordination should be in CRITICAL quadrant (Gap=5.0, Team=4.15, Biz=4.75)
And TMS should be in CRITICAL quadrant (Gap=3.5, Team=2.59, Biz=2.98)
And other drivers should be in LOW or HIGH quadrants
```

### Scenario 13: Financial Services - Risk Management Focus
```gherkin
Given an assessment with the following driver scores:
  | Driver | Score |
  | Trust | 4.0 |
  | Psychological Safety | 3.0 |
  | Communication Quality | 3.5 |
  | Goal Clarity | 4.0 |
  | Coordination | 5.0 |
  | Transactive Memory | 4.5 |
  | Team Cognition | 2.5 |
And the detected industry is "Financial Services"
When the priority matrix is calculated
Then Team Cognition should be in CRITICAL quadrant (Gap=4.5, Team=4.50, Biz=4.50)
And Psych Safety should be in CRITICAL quadrant (Gap=4.0, Team=3.08, Biz=3.28)
And Comm Quality should be in CRITICAL quadrant (Gap=3.5, Team=3.12, Biz=3.50)
```

### Scenario 14: Professional Services - Client Relationship Focus
```gherkin
Given an assessment with the following driver scores:
  | Driver | Score |
  | Trust | 2.5 |
  | Psychological Safety | 4.0 |
  | Communication Quality | 3.0 |
  | Goal Clarity | 4.5 |
  | Coordination | 4.0 |
  | Transactive Memory | 3.0 |
  | Team Cognition | 3.5 |
And the detected industry is "Professional Services"
When the priority matrix is calculated
Then Trust should be in CRITICAL quadrant (Gap=4.5, Team=4.23, Biz=4.50)
And Comm Quality should be in CRITICAL quadrant (Gap=4.0, Team=3.56, Biz=4.00)
And TMS should be in CRITICAL quadrant (Gap=4.0, Team=2.96, Biz=3.40)
And Team Cognition should be in CRITICAL quadrant (Gap=3.5, Team=3.50, Biz=3.50)
```

---

## Feature: Boundary Conditions

### Scenario 15: Score Exactly at Threshold (2.5 Team Impact)
```gherkin
Given a driver with Gap = 2.66 and Team Weight = 0.94
When Team Impact is calculated as 2.50 (exactly at threshold)
Then the driver should be classified as HIGH Team Impact (≥2.5)
And placed in CRITICAL or MEDIUM quadrant depending on Business Value
```

### Scenario 16: Score Just Below Threshold (2.49 Team Impact)
```gherkin
Given a driver with Gap = 2.65 and Team Weight = 0.94
When Team Impact is calculated as 2.49 (just below threshold)
Then the driver should be classified as LOW Team Impact (<2.5)
And placed in HIGH or LOW quadrant depending on Business Value
```

### Scenario 17: Maximum Gap (Score = 1)
```gherkin
Given a driver with Score = 1.0
When Gap is calculated as 6.0
And Team Weight is 1.0 (Team Cognition)
Then Team Impact should be 6.0 (maximum possible)
And the driver should definitely be in CRITICAL or MEDIUM quadrant
```

### Scenario 18: Minimum Gap (Score = 7)
```gherkin
Given a driver with Score = 7.0
When Gap is calculated as 0.0
Then Team Impact should be 0.0
And Business Value should be 0.0
And the driver should be in LOW quadrant
```

### Scenario 19: Score of 4.0 (Midpoint Assessment)
```gherkin
Given a driver with Score = 4.0 (Gap = 3.0)
And the driver is Trust (Team Weight = 0.94, Biz Weight = 0.94 for Software)
When calculations are performed
Then Team Impact = 2.82 (≥2.5, HIGH)
And Business Value = 2.82 (≥2.5, HIGH)
And the driver should be in CRITICAL quadrant
```

### Scenario 20: Low-Weight Driver with Low Score
```gherkin
Given TMS with Score = 3.0 (Gap = 4.0)
And Team Weight = 0.74, Biz Weight = 0.69 (Hospitality)
When calculations are performed
Then Team Impact = 2.96 (≥2.5, HIGH)
And Business Value = 2.76 (≥2.5, HIGH)
And TMS should be in CRITICAL quadrant despite lower weights
```

---

## Feature: Matrix Visualization

### Scenario 21: Axis Labels Display
```gherkin
Given the priority matrix is rendered
Then the Y-axis should be labeled "Impact on Team Performance"
And the Y-axis should show "High" at top and "Low" at bottom
And the X-axis should be labeled "Business Value If Fixed"
And the X-axis should show "Low" at left and "High" at right
```

### Scenario 22: Quadrant Labels and Colors
```gherkin
Given the priority matrix is rendered
Then the top-right quadrant should be labeled "CRITICAL" with red background (#FEE2E2)
And the bottom-right quadrant should be labeled "HIGH" with blue background (#DBEAFE)
And the top-left quadrant should be labeled "MEDIUM" with yellow background (#FEF3C7)
And the bottom-left quadrant should be labeled "LOW" with green background (#D1FAE5)
```

### Scenario 23: Driver Positioning Within Quadrant
```gherkin
Given a driver with Team Impact = 4.5 and Business Value = 5.0
When placed in the CRITICAL quadrant
Then the driver marker should be positioned proportionally within the quadrant
And higher values should appear further from the center
And the driver should not overlap with quadrant boundaries
```

### Scenario 24: Legend Display
```gherkin
Given the priority matrix is rendered
Then a legend should appear below the matrix
And the legend should explain:
  | Label | Description |
  | CRITICAL | High impact on daily team performance AND high business value if fixed. Address immediately. |
  | HIGH | Lower daily impact but high business value. Strategic investment opportunity. |
  | MEDIUM | High daily impact but lower business ROI. Improves team morale and efficiency. |
  | LOW | Lower impact on both dimensions. Monitor and maintain current state. |
```

### Scenario 25: Industry Display
```gherkin
Given the detected industry is "Software & Technology"
When the Results page is rendered
Then the matrix header should display "Detected Industry: Software & Technology"
And this should be read-only (not editable in current release)
```

### Scenario 26: Driver Tooltip on Hover
```gherkin
Given a driver marker in the matrix
When the user hovers over the marker
Then a tooltip should display:
  | Field | Example |
  | Driver Name | Trust |
  | Current Score | 3.2 / 7.0 |
  | Team Impact Score | 3.57 |
  | Business Value Score | 3.57 |
  | Quadrant | CRITICAL |
```

### Scenario 27: Driver Click Navigation
```gherkin
Given a driver marker in the matrix
When the user clicks on the marker
Then the page should scroll to that driver's detailed card
And the card should be highlighted briefly
```

---

## Feature: Edge Cases

### Scenario 28: All Drivers in Same Quadrant
```gherkin
Given all 7 drivers have scores between 1.0 and 2.5
When the priority matrix is calculated
Then all drivers should appear in the CRITICAL quadrant
And the matrix should still be readable with 7 markers
And markers should not overlap significantly
```

### Scenario 29: Drivers Split Evenly Across Quadrants
```gherkin
Given driver scores that result in:
  - 2 drivers in CRITICAL
  - 2 drivers in HIGH
  - 2 drivers in MEDIUM
  - 1 driver in LOW
When the priority matrix is rendered
Then each quadrant should display its drivers clearly
And the visual balance should be maintained
```

### Scenario 30: Single Driver Near Boundary
```gherkin
Given a driver with Team Impact = 2.51 and Business Value = 2.49
When placed on the matrix
Then the driver should appear in MEDIUM quadrant (HIGH team, LOW biz)
And the position should be clearly within MEDIUM, not on the boundary line
```

---

## Feature: Data Persistence

### Scenario 31: Store Calculated Values
```gherkin
Given an assessment is submitted
When the priority matrix is calculated
Then the following should be stored in the assessments table:
  | Field | Type |
  | detected_industry | VARCHAR(100) |
  | industry_confidence | DECIMAL(3,2) |
  | priority_matrix_data | JSON |
And priority_matrix_data should contain:
  - All 7 drivers with their weighted scores
  - Quadrant assignments
  - Calculation timestamp
```

### Scenario 32: Retrieve Stored Matrix Data
```gherkin
Given an assessment with ID "abc-123" exists in the database
And it has stored priority_matrix_data
When the Results page loads for /results/abc-123
Then the matrix should render from stored data
And no recalculation should be needed
And the display should match the original calculation
```

---

## Feature: PDF Export

### Scenario 33: Matrix in PDF Report
```gherkin
Given a completed assessment with priority matrix data
When the user clicks "Generate Report PDF"
Then the PDF should include the Action Priority Matrix
And the matrix should show all quadrants with correct colors
And all drivers should be positioned correctly
And the legend should be included
And the detected industry should be displayed
```

---

## Acceptance Criteria Summary

| Category | Scenarios | Status |
|----------|-----------|--------|
| Industry Detection | 1-7 | Pending |
| Priority Matrix Calculation | 8-14 | Pending |
| Boundary Conditions | 15-20 | Pending |
| Matrix Visualization | 21-27 | Pending |
| Edge Cases | 28-30 | Pending |
| Data Persistence | 31-32 | Pending |
| PDF Export | 33 | Pending |

**Total Scenarios:** 33

---

## Implementation Notes

1. **Industry classifier** should use `invokeLLM()` with structured JSON output
2. **Weight constants** should be stored in a separate configuration file for easy updates
3. **Matrix rendering** should use a canvas or SVG-based chart library for precise positioning
4. **Tooltip component** should be accessible (keyboard navigable, screen reader compatible)
5. **Database migration** required to add `detected_industry`, `industry_confidence`, and `priority_matrix_data` columns

---

## References

1. Costa, A. C., & Anderson, N. (2011). Measuring trust in teams: Development and validation of a multifaceted measure of formative and reflective indicators of team trust. *European Journal of Work and Organizational Psychology*, 20(1), 119-154.

2. DeChurch, L. A., & Mesmer-Magnus, J. R. (2010). The cognitive underpinnings of effective teamwork: A meta-analysis. *Journal of Applied Psychology*, 95(1), 32-53.

3. Frazier, M. L., Fainshmidt, S., Klinger, R. L., Pezeshkan, A., & Vracheva, V. (2017). Psychological safety: A meta-analytic review and extension. *Personnel Psychology*, 70(1), 113-165.

4. LePine, J. A., Piccolo, R. F., Jackson, C. L., Mathieu, J. E., & Saul, J. R. (2008). A meta-analysis of teamwork processes: Tests of a multidimensional model and relationships with team effectiveness criteria. *Personnel Psychology*, 61(2), 273-307.

5. Marlow, S. L., Lacerenza, C. N., Paoletti, J., Burke, C. S., & Salas, E. (2018). Does team communication represent a one-size-fits-all approach?: A meta-analysis of team communication and performance. *Organizational Behavior and Human Decision Processes*, 144, 145-170.

6. Mathieu, J. E., Maynard, M. T., Rapp, T., & Gilson, L. (2008). Team effectiveness 1997-2007: A review of recent advancements and a glimpse into the future. *Journal of Management*, 34(3), 410-476.
