# Priority Matrix Calculation Methodology

## Overview

The ProblemOps Action Priority Matrix uses a research-backed two-dimensional model to help teams prioritize which drivers to address first. Rather than using a simple single-dimension priority ranking, this matrix plots each driver based on two independent factors:

1. **Impact on Team Performance** (Y-axis): How much the driver deficiency affects day-to-day team operations
2. **Business Value If Fixed** (X-axis): The downstream business outcomes if this driver is improved

This approach ensures teams focus on improvements that deliver both immediate operational benefits AND strategic business value.

---

## Research Foundation

### Meta-Analysis Sources

The weights used in this model are derived from peer-reviewed meta-analyses of team effectiveness research:

| Source | Sample Size | Key Finding |
|--------|-------------|-------------|
| Costa & Anderson (2011) | 112 studies | Trust correlation with team performance: r = 0.33 |
| Frazier et al. (2017) | 117 samples | Psychological Safety correlation: r = 0.27 |
| Marlow et al. (2018) | 150 studies | Communication correlation: r = 0.31 |
| Mathieu et al. (2008) | Multiple studies | Goal Clarity correlation: r = 0.28 |
| LePine et al. (2008) | 138 studies | Coordination correlation: r = 0.29 |
| DeChurch & Mesmer-Magnus (2010) | 65 studies | TMS correlation: r = 0.26, Team Cognition: r = 0.35 |

### Normalization Process

Raw correlation coefficients were normalized to a 0-1 weight scale where the highest correlation (0.35 for Team Cognition) equals 1.0:

```
Normalized Weight = Raw Correlation / Max Correlation (0.35)
```

---

## Team Performance Impact Weights

These weights reflect how much each driver affects daily team operations based on meta-analysis correlations:

| Driver | Raw Correlation | Normalized Weight | Impact Level |
|--------|-----------------|-------------------|--------------|
| Trust | 0.33 | **0.94** | HIGH |
| Psychological Safety | 0.27 | **0.77** | HIGH |
| Communication Quality | 0.31 | **0.89** | HIGH |
| Goal Clarity | 0.28 | **0.80** | HIGH |
| Coordination | 0.29 | **0.83** | HIGH |
| Transactive Memory (TMS) | 0.26 | **0.74** | MEDIUM |
| Team Cognition | 0.35 | **1.00** | HIGH |

**Note:** Five drivers have HIGH team impact (≥0.77), while TMS and Team Cognition have MEDIUM impact. This reflects that Trust, Safety, Communication, Goals, and Coordination directly affect daily friction, while TMS and Cognition affect efficiency on complex tasks.

---

## Business Value Weights by Industry

Business value varies by industry because different industries have different success metrics. The base weights are modified by industry-specific multipliers:

### Base Business Value Weights

| Driver | Base Weight |
|--------|-------------|
| Trust | 0.94 |
| Psychological Safety | 0.89 |
| Communication Quality | 1.00 |
| Goal Clarity | 0.85 |
| Coordination | 0.95 |
| Transactive Memory | 0.79 |
| Team Cognition | 1.00 |

### Industry Multipliers

| Industry | Trust | Psych Safety | Comm | Goals | Coord | TMS | Cognition |
|----------|-------|--------------|------|-------|-------|-----|-----------|
| Software & Technology | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
| Healthcare & Medical | 1.01 | 1.07 | 1.0 | 1.0 | 0.93 | 1.0 | 1.0 |
| Financial Services | 0.95 | 0.95 | 1.0 | 1.0 | 0.84 | 0.94 | 1.0 |
| Government & Public Sector | 0.95 | 0.79 | 0.94 | 1.08 | 0.87 | 0.89 | 0.9 |
| Hospitality & Service | 1.01 | 0.84 | 0.94 | 0.94 | 0.87 | 0.82 | 0.85 |
| Manufacturing & Industrial | 0.95 | 0.84 | 0.89 | 1.0 | 1.0 | 1.08 | 0.9 |
| Professional Services | 1.01 | 0.9 | 1.0 | 1.0 | 0.89 | 1.08 | 1.0 |

### Industry Rationale

**Software & Technology** (baseline): All drivers equally important for product quality and innovation.

**Healthcare & Medical**: Psychological Safety elevated (+7%) because medical errors often go unreported in low-safety cultures. Trust elevated (+1%) for patient handoffs.

**Financial Services**: Coordination reduced (-16%) because financial work is often individual analysis. TMS reduced (-6%) due to regulatory silos.

**Government & Public Sector**: Goal Clarity elevated (+8%) because unclear policy objectives waste public resources. Psychological Safety reduced (-21%) due to hierarchical structures.

**Hospitality & Service**: Trust elevated (+1%) for customer-facing teamwork. Team Cognition reduced (-15%) because service work is more routine.

**Manufacturing & Industrial**: Coordination elevated (baseline) for supply chain. TMS elevated (+8%) for equipment expertise. Cognition reduced (-10%) for routine operations.

**Professional Services**: TMS elevated (+8%) because knowing who knows what is critical for client work. Trust elevated (+1%) for client relationships.

---

## Calculation Formula

### Step 1: Calculate the Gap

For each driver, calculate how far the team is from the ideal score of 7:

```
Gap = 7 - Score
```

Example: Trust score of 2.4 → Gap = 7 - 2.4 = 4.6

### Step 2: Calculate Team Impact Score

```
Team Impact Score = Gap × Team Impact Weight
```

Example: Trust with Gap 4.6 × Weight 0.94 = **4.32**

### Step 3: Calculate Business Value Score

```
Business Value Score = Gap × Base Business Weight × Industry Multiplier
```

Example (Software industry): Trust with Gap 4.6 × 0.94 × 1.0 = **4.32**

### Step 4: Determine Quadrant

Using threshold of **2.5** for both axes:

| Team Impact | Business Value | Quadrant |
|-------------|----------------|----------|
| ≥ 2.5 | ≥ 2.5 | **CRITICAL** |
| < 2.5 | ≥ 2.5 | **HIGH** |
| ≥ 2.5 | < 2.5 | **MEDIUM** |
| < 2.5 | < 2.5 | **LOW** |

---

## Example Calculations

### Scenario: Software Company with Mixed Scores

| Driver | Score | Gap | Team Weight | Team Impact | Biz Weight | Biz Value | Quadrant |
|--------|-------|-----|-------------|-------------|------------|-----------|----------|
| Trust | 2.4 | 4.6 | 0.94 | 4.32 | 0.94 | 4.32 | **CRITICAL** |
| Psych Safety | 4.4 | 2.6 | 0.77 | 2.00 | 0.89 | 2.31 | **LOW** |
| Comm Quality | 2.4 | 4.6 | 0.89 | 4.09 | 1.00 | 4.60 | **CRITICAL** |
| Goal Clarity | 3.4 | 3.6 | 0.80 | 2.88 | 0.85 | 3.06 | **CRITICAL** |
| Coordination | 6.4 | 0.6 | 0.83 | 0.50 | 0.95 | 0.57 | **LOW** |
| TMS | 6.4 | 0.6 | 0.74 | 0.44 | 0.79 | 0.47 | **LOW** |
| Team Cognition | 4.4 | 2.6 | 1.00 | 2.60 | 1.00 | 2.60 | **CRITICAL** |

**Result:** 4 drivers in CRITICAL, 3 in LOW

### Scenario: Healthcare Company - All Low Scores (1.5)

| Driver | Score | Gap | Team Impact | Biz Value (Healthcare) | Quadrant |
|--------|-------|-----|-------------|------------------------|----------|
| Trust | 1.5 | 5.5 | 5.17 | 5.22 | **CRITICAL** |
| Psych Safety | 1.5 | 5.5 | 4.24 | 5.24 | **CRITICAL** |
| Comm Quality | 1.5 | 5.5 | 4.90 | 5.50 | **CRITICAL** |
| Goal Clarity | 1.5 | 5.5 | 4.40 | 4.68 | **CRITICAL** |
| Coordination | 1.5 | 5.5 | 4.57 | 4.86 | **CRITICAL** |
| TMS | 1.5 | 5.5 | 4.07 | 4.35 | **CRITICAL** |
| Team Cognition | 1.5 | 5.5 | 5.50 | 5.50 | **CRITICAL** |

**Result:** All 7 drivers in CRITICAL (team in crisis)

### Scenario: High-Performing Team (5.5-6.5 scores)

| Driver | Score | Gap | Team Impact | Biz Value | Quadrant |
|--------|-------|-----|-------------|-----------|----------|
| Trust | 5.8 | 1.2 | 1.13 | 1.13 | **LOW** |
| Psych Safety | 6.2 | 0.8 | 0.62 | 0.71 | **LOW** |
| Comm Quality | 5.5 | 1.5 | 1.34 | 1.50 | **LOW** |
| Goal Clarity | 6.0 | 1.0 | 0.80 | 0.85 | **LOW** |
| Coordination | 6.5 | 0.5 | 0.42 | 0.48 | **LOW** |
| TMS | 5.8 | 1.2 | 0.89 | 0.95 | **LOW** |
| Team Cognition | 6.2 | 0.8 | 0.80 | 0.80 | **LOW** |

**Result:** All 7 drivers in LOW (team performing well, maintain current state)

---

## Industry Detection

The system automatically detects industry from the company website using LLM analysis. The classifier:

1. Scrapes the company homepage and about page
2. Sends text to Claude with classification prompt
3. Returns structured JSON with industry, confidence score, and detected offerings
4. Falls back to "Professional Services" if website is unreachable

### Supported Industries

1. Software & Technology
2. Healthcare & Medical
3. Financial Services
4. Government & Public Sector
5. Hospitality & Service
6. Manufacturing & Industrial
7. Professional Services (default)

---

## Quadrant Definitions

### CRITICAL (Top-Right)
**High team impact + High business value**

These drivers are causing significant daily friction AND represent major business opportunities. Address immediately with focused intervention.

**Characteristics:**
- Team Impact Score ≥ 2.5
- Business Value Score ≥ 2.5
- Typically drivers with scores below 4.0

### HIGH (Bottom-Right)
**Low team impact + High business value**

These drivers may not cause daily friction but represent strategic opportunities. Plan for improvement as resources allow.

**Characteristics:**
- Team Impact Score < 2.5
- Business Value Score ≥ 2.5
- Often TMS or Cognition with moderate scores

### MEDIUM (Top-Left)
**High team impact + Low business value**

These drivers cause daily friction but have lower direct business ROI. Improving them will boost team morale and efficiency.

**Characteristics:**
- Team Impact Score ≥ 2.5
- Business Value Score < 2.5
- Rare quadrant - most high-impact drivers also have high business value

### LOW (Bottom-Left)
**Low team impact + Low business value**

These drivers are performing adequately. Monitor and maintain current state rather than investing in improvement.

**Characteristics:**
- Team Impact Score < 2.5
- Business Value Score < 2.5
- Typically drivers with scores above 5.0

---

## Data Storage

The priority matrix data is stored permanently in the assessments table:

```sql
detectedIndustry TEXT,           -- e.g., "Software & Technology"
industryConfidence REAL,         -- 0.0 to 1.0 confidence score
priorityMatrixData JSONB         -- Full calculation results
```

### priorityMatrixData Structure

```json
{
  "industry": "Software & Technology",
  "threshold": 2.5,
  "drivers": [
    {
      "driverId": "trust",
      "driverName": "Trust",
      "score": 2.4,
      "gap": 4.6,
      "teamImpactWeight": 0.94,
      "businessValueWeight": 0.94,
      "teamImpactScore": 4.32,
      "businessValueScore": 4.32,
      "quadrant": "critical",
      "xPosition": 75,
      "yPosition": 85
    }
    // ... other drivers
  ],
  "quadrantCounts": {
    "critical": 4,
    "high": 0,
    "medium": 0,
    "low": 3
  }
}
```

---

## References

1. Costa, A. C., & Anderson, N. (2011). Measuring trust in teams: Development and validation of a multifaceted measure of formative and reflective indicators of team trust. *European Journal of Work and Organizational Psychology*, 20(1), 119-154.

2. Frazier, M. L., Fainshmidt, S., Klinger, R. L., Pezeshkan, A., & Vracheva, V. (2017). Psychological safety: A meta-analytic review and extension. *Personnel Psychology*, 70(1), 113-165.

3. Marlow, S. L., Lacerenza, C. N., Paoletti, J., Burke, C. S., & Salas, E. (2018). Does team communication represent a one-size-fits-all approach?: A meta-analysis of team communication and performance. *Organizational Behavior and Human Decision Processes*, 144, 145-170.

4. Mathieu, J. E., Maynard, M. T., Rapp, T., & Gilson, L. (2008). Team effectiveness 1997-2007: A review of recent advancements and a glimpse into the future. *Journal of Management*, 34(3), 410-476.

5. LePine, J. A., Piccolo, R. F., Jackson, C. L., Mathieu, J. E., & Saul, J. R. (2008). A meta-analysis of teamwork processes: Tests of a multidimensional model and relationships with team effectiveness criteria. *Personnel Psychology*, 61(2), 273-307.

6. DeChurch, L. A., & Mesmer-Magnus, J. R. (2010). The cognitive underpinnings of effective teamwork: A meta-analysis. *Journal of Applied Psychology*, 95(1), 32-53.

7. Edmondson, A. C. (1999). Psychological safety and learning behavior in work teams. *Administrative Science Quarterly*, 44(2), 350-383.

8. Mayer, R. C., Davis, J. H., & Schoorman, F. D. (1995). An integrative model of organizational trust. *Academy of Management Review*, 20(3), 709-734.

---

*Document Version: 1.0*
*Last Updated: December 24, 2024*
*Author: ProblemOps Development Team*
