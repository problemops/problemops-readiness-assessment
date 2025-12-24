# BDD: Deliverables Display Based on Training Type

## Feature: Dynamic Deliverables Recommendations Based on Training Selection

**As a** team leader reviewing assessment results  
**I want** to see ProblemOps deliverables organized by my selected training type  
**So that** I understand which artifacts to prioritize during my training engagement

---

## Background

Given the assessment has calculated 4 C's scores:
- Criteria: 45% (gap: 40%)
- Commitment: 55% (gap: 30%)
- Collaboration: 70% (gap: 15%)
- Change: 80% (gap: 5%)

And the priority order is:
1. Criteria (40% gap) - CRITICAL
2. Commitment (30% gap) - HIGH PRIORITY
3. Collaboration (15% gap) - MEDIUM PRIORITY
4. Change (5% gap) - LOW PRIORITY

---

## Scenario 1: Half Day Workshop - Top Priority Only

**Given** the user selected "Half Day Workshop" ($2,000)  
**When** they view the Results page  
**Then** the "Recommended ProblemOps Deliverables" section should display:
- **Section heading:** "Recommended ProblemOps Deliverables"
- **Description:** "Based on your 4 C's scores, these are the specific ProblemOps artifacts your team should focus on creating during your training:"
- **Recommended (Priority 1 only):**
  - **Criteria** (40% gap):
    - Scenario-based problem statements
    - Research insights
    - Current experience maps
    - Positioning statements
    - Unique value propositions

**And** the "The Other Deliverables For the 4 C's of ProblemOps" section should display:
- **Section heading:** "The Other Deliverables For the 4 C's of ProblemOps"
- **Description:** "For your reference, here are the other ProblemOps deliverables you may consider after addressing your top priority:"
- **Other Deliverables (Priorities 2, 3, 4):**
  - **Commitment** (30% gap):
    - Vision boards
    - Release-level scope of outcomes
    - Strategy definition
    - Success metrics
    - Team agreements
  - **Collaboration** (15% gap):
    - User stories
    - Acceptance criteria
    - Task flows
    - Backlogs
    - Prototypes and working code
  - **Change** (5% gap):
    - Testing plans
    - Feedback loops
    - Impact measurements
    - Iteration strategies
    - Continuous improvement cycles

---

## Scenario 2: Full Day Workshop - Top 2 Priorities

**Given** the user selected "Full Day Workshop" ($3,500)  
**When** they view the Results page  
**Then** the "Recommended ProblemOps Deliverables" section should display:
- **Recommended (Priorities 1 & 2):**
  - **Criteria** (40% gap):
    - Scenario-based problem statements
    - Research insights
    - Current experience maps
    - Positioning statements
    - Unique value propositions
  - **Commitment** (30% gap):
    - Vision boards
    - Release-level scope of outcomes
    - Strategy definition
    - Success metrics
    - Team agreements

**And** the "The Other Deliverables For the 4 C's of ProblemOps" section should display:
- **Other Deliverables (Priorities 3, 4):**
  - **Collaboration** (15% gap):
    - User stories
    - Acceptance criteria
    - Task flows
    - Backlogs
    - Prototypes and working code
  - **Change** (5% gap):
    - Testing plans
    - Feedback loops
    - Impact measurements
    - Iteration strategies
    - Continuous improvement cycles

---

## Scenario 3: Month-Long Engagement - All Priorities

**Given** the user selected "Month-Long Engagement" ($50,000)  
**When** they view the Results page  
**Then** the "Recommended ProblemOps Deliverables" section should display:
- **Recommended (All 4 C's with gaps, ordered by priority):**
  - **Criteria** (40% gap):
    - Scenario-based problem statements
    - Research insights
    - Current experience maps
    - Positioning statements
    - Unique value propositions
  - **Commitment** (30% gap):
    - Vision boards
    - Release-level scope of outcomes
    - Strategy definition
    - Success metrics
    - Team agreements
  - **Collaboration** (15% gap):
    - User stories
    - Acceptance criteria
    - Task flows
    - Backlogs
    - Prototypes and working code
  - **Change** (5% gap):
    - Testing plans
    - Feedback loops
    - Impact measurements
    - Iteration strategies
    - Continuous improvement cycles

**And** the "The Other Deliverables For the 4 C's of ProblemOps" section should **NOT** display
- Because all deliverables are already recommended

---

## Scenario 4: Not Sure Yet - Show All with Prioritization

**Given** the user selected "I'm Not Sure Yet"  
**When** they view the Results page  
**Then** the "Recommended ProblemOps Deliverables" section should display:
- **Recommended (All 4 C's with gaps, ordered by priority):**
  - **Criteria** (40% gap):
    - Scenario-based problem statements
    - Research insights
    - Current experience maps
    - Positioning statements
    - Unique value propositions
  - **Commitment** (30% gap):
    - Vision boards
    - Release-level scope of outcomes
    - Strategy definition
    - Success metrics
    - Team agreements
  - **Collaboration** (15% gap):
    - User stories
    - Acceptance criteria
    - Task flows
    - Backlogs
    - Prototypes and working code
  - **Change** (5% gap):
    - Testing plans
    - Feedback loops
    - Impact measurements
    - Iteration strategies
    - Continuous improvement cycles

**And** the "The Other Deliverables For the 4 C's of ProblemOps" section should **NOT** display
- Because all deliverables are already recommended

---

## Edge Case: All 4 C's Above 60% (No Gaps)

**Given** the user has high scores in all 4 C's:
- Criteria: 90% (gap: -5%)
- Commitment: 85% (gap: 0%)
- Collaboration: 88% (gap: -3%)
- Change: 92% (gap: -7%)

**And** the user selected "Half Day Workshop"  
**When** they view the Results page  
**Then** the "Recommended ProblemOps Deliverables" section should **NOT** display
- Because no C's have gaps requiring focus

**And** the "The Other Deliverables For the 4 C's of ProblemOps" section should display:
- **Section heading:** "The Other Deliverables For the 4 C's of ProblemOps"
- **Description:** "Your team is performing well across all 4 C's. For your reference, here are the ProblemOps deliverables you may consider for continuous improvement:"
- **All 4 C's deliverables** (no specific order needed since all are strengths)

---

## Edge Case: Only 1 C Below 60% - Half Day Workshop

**Given** the user has only Criteria below 60%:
- Criteria: 45% (gap: 40%)
- Commitment: 85% (gap: 0%)
- Collaboration: 88% (gap: -3%)
- Change: 92% (gap: -7%)

**And** the user selected "Half Day Workshop"  
**When** they view the Results page  
**Then** the "Recommended ProblemOps Deliverables" section should display:
- **Criteria** only (the single priority)

**And** the "The Other Deliverables For the 4 C's of ProblemOps" section should display:
- **Commitment**, **Collaboration**, **Change** (the 3 C's above 60%)

---

## Edge Case: Only 1 C Below 60% - Full Day Workshop

**Given** the user has only Criteria below 60%:
- Criteria: 45% (gap: 40%)
- Commitment: 85% (gap: 0%)
- Collaboration: 88% (gap: -3%)
- Change: 92% (gap: -7%)

**And** the user selected "Full Day Workshop" (expects top 2 priorities)  
**When** they view the Results page  
**Then** the "Recommended ProblemOps Deliverables" section should display:
- **Criteria** only (only 1 C has a gap, cannot show 2)

**And** the "The Other Deliverables For the 4 C's of ProblemOps" section should display:
- **Commitment**, **Collaboration**, **Change**

---

## Business Rules

### Priority Determination
1. Calculate gaps for each C: `gap = 0.85 - score`
2. Only include C's with `score < 0.60` (60%) in recommendations
3. Sort recommended C's by gap size (largest gap = highest priority)

### Training Type Mapping
| Training Type | Recommended C's to Show |
|--------------|------------------------|
| Half Day ($2,000) | Top 1 priority C |
| Full Day ($3,500) | Top 2 priority C's |
| Month-Long ($50,000) | All C's with gaps |
| Not Sure Yet | All C's with gaps |

### Section Display Logic
- **"Recommended ProblemOps Deliverables":**
  - Show if there are any C's with gaps (score < 60%)
  - Display C's based on training type mapping
  - Order by priority (largest gap first)
  
- **"The Other Deliverables For the 4 C's of ProblemOps":**
  - Show if there are C's NOT included in recommended section
  - Include both:
    - C's with gaps but not prioritized for selected training type
    - C's without gaps (score >= 60%)
  - Order by priority if multiple C's

### Description Text
- **Recommended section (has gaps):** "Based on your 4 C's scores, these are the specific ProblemOps artifacts your team should focus on creating during your training:"
- **Other section (mixed):** "For your reference, here are the other ProblemOps deliverables you may consider after addressing your top priority:" (for Half Day) or "...top priorities:" (for Full Day)
- **Other section (all strengths):** "Your team is performing well across all 4 C's. For your reference, here are the ProblemOps deliverables you may consider for continuous improvement:"

---

## Acceptance Criteria

✅ Half Day shows only top 1 priority C in recommended, rest in other  
✅ Full Day shows top 2 priority C's in recommended, rest in other  
✅ Month-Long shows all C's with gaps in recommended, none in other  
✅ Not Sure Yet shows all C's with gaps in recommended, none in other  
✅ C's are ordered by gap size (priority) in both sections  
✅ Section headings and descriptions are contextually appropriate  
✅ Edge case: All C's above 60% shows only "Other" section  
✅ Edge case: Fewer gaps than training type expects shows only available gaps  
✅ Visual design uses same card/list format as current implementation  
✅ Icons (CheckCircle2) are used for deliverable items
