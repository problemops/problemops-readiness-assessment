Feature: ROI and ROI Timeframe Display and Calculation
  As a user who completed the assessment
  I want to see accurate ROI and ROI Timeframe calculations
  So that I can understand the financial benefits of training

  Background:
    Given I have completed the 35-question assessment
    And my team has the following characteristics:
      | Attribute           | Value      |
      | Team Size           | 15         |
      | Average Salary      | $120,000   |
      | Total Payroll       | $1,800,000 |
    And my driver scores result in:
      | Metric                     | Value      |
      | Total Cost of Dysfunction  | $514,286   |
      | Readiness Score            | 71.4%      |

  # ============================================
  # TRAINING TYPE: HALF DAY WORKSHOP
  # ============================================

  Scenario: Half Day Workshop - ROI and ROI Timeframe display
    Given I selected "Half Day Workshop" as my training type
    And the training cost is $2,000
    And my #1 priority driver is Trust with cost $92,571
    When I view the Results page
    Then I should see the following ROI metrics:
      | Metric                  | Value                    |
      | Projected Annual Savings| $78,686 (92,571 × 0.85)  |
      | Return on Investment    | 3,834%                   |
      | ROI Timeframe           | 3.3 months               |
    And the "How It Works" button should be visible on both ROI cards
    And clicking "How It Works" should explain the calculation methodology

  Scenario: Half Day Workshop - ROI calculation formula
    Given I selected "Half Day Workshop" as my training type
    And Projected Annual Savings (S) = $78,686
    And Training Cost (C) = $2,000
    When the ROI is calculated
    Then ROI should equal (S - C) ÷ C × 100%
    And ROI should equal ($78,686 - $2,000) ÷ $2,000 × 100%
    And ROI should equal $76,686 ÷ $2,000 × 100%
    And ROI should equal 3,834%

  Scenario: Half Day Workshop - ROI Timeframe calculation formula
    Given I selected "Half Day Workshop" as my training type
    And Training Cost (C) = $2,000
    And Projected Annual Savings (S) = $78,686
    When the ROI Timeframe is calculated
    Then ROI Timeframe should equal (C ÷ S × 12) + 3
    And ROI Timeframe should equal ($2,000 ÷ $78,686 × 12) + 3
    And ROI Timeframe should equal 0.305 + 3
    And ROI Timeframe should equal 3.3 months

  # ============================================
  # TRAINING TYPE: FULL DAY WORKSHOP
  # ============================================

  Scenario: Full Day Workshop - ROI and ROI Timeframe display
    Given I selected "Full Day Workshop" as my training type
    And the training cost is $3,500
    And my top 2 priority drivers are:
      | Driver               | Cost      |
      | Trust                | $92,571   |
      | Psychological Safety | $87,429   |
    And total cost for top 2 drivers is $180,000
    When I view the Results page
    Then I should see the following ROI metrics:
      | Metric                  | Value                    |
      | Projected Annual Savings| $153,000 (180,000 × 0.85)|
      | Return on Investment    | 4,271%                   |
      | ROI Timeframe           | 3.3 months               |
    And the "How It Works" button should be visible on both ROI cards

  Scenario: Full Day Workshop - ROI calculation formula
    Given I selected "Full Day Workshop" as my training type
    And Projected Annual Savings (S) = $153,000
    And Training Cost (C) = $3,500
    When the ROI is calculated
    Then ROI should equal (S - C) ÷ C × 100%
    And ROI should equal ($153,000 - $3,500) ÷ $3,500 × 100%
    And ROI should equal $149,500 ÷ $3,500 × 100%
    And ROI should equal 4,271%

  Scenario: Full Day Workshop - ROI Timeframe calculation formula
    Given I selected "Full Day Workshop" as my training type
    And Training Cost (C) = $3,500
    And Projected Annual Savings (S) = $153,000
    When the ROI Timeframe is calculated
    Then ROI Timeframe should equal (C ÷ S × 12) + 3
    And ROI Timeframe should equal ($3,500 ÷ $153,000 × 12) + 3
    And ROI Timeframe should equal 0.274 + 3
    And ROI Timeframe should equal 3.3 months

  # ============================================
  # TRAINING TYPE: MONTH-LONG ENGAGEMENT
  # ============================================

  Scenario: Month-Long Engagement - ROI and ROI Timeframe display
    Given I selected "Month-Long Engagement" as my training type
    And the training cost is $30,000
    And all 7 drivers are addressed
    And total cost for all 7 drivers equals Total Cost of Dysfunction ($514,286)
    When I view the Results page
    Then I should see the following ROI metrics:
      | Metric                  | Value                        |
      | Projected Annual Savings| $437,143 (514,286 × 0.85)    |
      | Return on Investment    | 1,357%                       |
      | ROI Timeframe           | 3.8 months                   |
    And the "How It Works" button should be visible on both ROI cards

  Scenario: Month-Long Engagement - ROI calculation formula
    Given I selected "Month-Long Engagement" as my training type
    And Projected Annual Savings (S) = $437,143
    And Training Cost (C) = $30,000
    When the ROI is calculated
    Then ROI should equal (S - C) ÷ C × 100%
    And ROI should equal ($437,143 - $30,000) ÷ $30,000 × 100%
    And ROI should equal $407,143 ÷ $30,000 × 100%
    And ROI should equal 1,357%

  Scenario: Month-Long Engagement - ROI Timeframe calculation formula
    Given I selected "Month-Long Engagement" as my training type
    And Training Cost (C) = $30,000
    And Projected Annual Savings (S) = $437,143
    When the ROI Timeframe is calculated
    Then ROI Timeframe should equal (C ÷ S × 12) + 3
    And ROI Timeframe should equal ($30,000 ÷ $437,143 × 12) + 3
    And ROI Timeframe should equal 0.823 + 3
    And ROI Timeframe should equal 3.8 months

  # ============================================
  # TRAINING TYPE: NOT SURE YET (COMPARISON TABLE)
  # ============================================

  Scenario: Not Sure Yet - Comparison table with all three options
    Given I selected "I'm Not Sure Yet" as my training type
    When I view the Results page
    Then I should NOT see individual ROI metric cards
    But I should see a comparison table with columns:
      | Column         | Description                              |
      | Option         | Training option name                     |
      | Investment     | Training cost                            |
      | Focus Areas    | Number of drivers addressed              |
      | ROI If Fixed   | Projected annual savings                 |
      | Return Rate    | ROI percentage                           |
      | ROI Timeframe  | Months to recover investment             |
    And the table should show all three training options:
      | Option       | Investment | Focus Areas | ROI If Fixed | Return Rate | ROI Timeframe |
      | Half Day     | $2,000     | Top 1       | $78,686      | 3,834%      | 3.3 mo        |
      | Full Day     | $3,500     | Top 2       | $153,000     | 4,271%      | 3.3 mo        |
      | Month-Long   | $30,000    | All 7       | $437,143     | 1,357%      | 3.8 mo        |
    And the "How It Works" button should NOT be visible in this view

  Scenario: Not Sure Yet - No individual ROI cards displayed
    Given I selected "I'm Not Sure Yet" as my training type
    When I view the Results page
    Then I should NOT see a "Projected Annual Savings" card
    And I should NOT see a "Return on Investment" card
    And I should NOT see a "ROI Timeframe" card
    But I should see a "Training Options Comparison" section

  # ============================================
  # HOW IT WORKS BUTTON FUNCTIONALITY
  # ============================================

  Scenario: How It Works button - Opens modal with ROI explanation
    Given I selected "Half Day Workshop" as my training type
    And I am viewing the ROI metric cards
    When I click the "How It Works" button on the "Return on Investment" card
    Then a modal should open with title "ROI Calculation"
    And the modal should explain the 4-step calculation process:
      | Step | Title                | Description                                    |
      | 1    | Priority Ranking     | How drivers are ranked by priority score       |
      | 2    | Scoped Savings       | How savings are calculated based on training   |
      | 3    | ROI Percentage       | Formula: (S - C) ÷ C × 100%                    |
      | 4    | ROI Timeframe        | Formula: (C ÷ S × 12) + 3                      |
    And the modal should include example calculations
    And the modal should use "ROI Timeframe" terminology (not "Payback Period")

  Scenario: How It Works button - Opens modal with ROI Timeframe explanation
    Given I selected "Full Day Workshop" as my training type
    And I am viewing the ROI metric cards
    When I click the "How It Works" button on the "ROI Timeframe" card
    Then a modal should open with title "ROI Calculation"
    And the modal should explain the ROI Timeframe formula
    And the formula should show: ROI Timeframe = (C ÷ S × 12) + 3
    And the explanation should clarify:
      | Component | Meaning                                        |
      | C         | Training cost ($)                              |
      | S         | Projected annual savings ($)                   |
      | 12        | Months in a year                               |
      | 3         | Implementation buffer (months for adoption)    |

  Scenario: How It Works button - Close modal
    Given the "How It Works" modal is open
    When I click the close button
    Or I press the Escape key
    Then the modal should close
    And I should return to the Results page

  Scenario: How It Works button - Keyboard accessibility
    Given I selected "Month-Long Engagement" as my training type
    And I am viewing the ROI metric cards
    When I press TAB to focus the "How It Works" button
    And I press ENTER or SPACE
    Then the modal should open
    And focus should move to the modal
    When I press Escape
    Then the modal should close
    And focus should return to the "How It Works" button

  # ============================================
  # TERMINOLOGY CONSISTENCY
  # ============================================

  Scenario: ROI Timeframe label consistency across all views
    Given I selected any training option except "Not Sure Yet"
    When I view the Results page
    Then all references to payback period should use "ROI Timeframe"
    And the card title should say "ROI Timeframe"
    And the table header should say "ROI Timeframe"
    And the How It Works modal should say "ROI Timeframe"
    And there should be NO instances of "Payback Period" anywhere

  Scenario: ROI Timeframe in comparison table
    Given I selected "I'm Not Sure Yet" as my training type
    When I view the comparison table
    Then the column header should say "ROI Timeframe" (not "Payback")
    And each row should display timeframe in months format (e.g., "3.3 mo")

  # ============================================
  # EDGE CASES
  # ============================================

  Scenario: Very low dysfunction cost - High ROI
    Given my Total Cost of Dysfunction is $50,000
    And I selected "Half Day Workshop" ($2,000)
    And my #1 priority driver cost is $9,000
    When the ROI is calculated
    Then Projected Annual Savings should be $7,650 (9,000 × 0.85)
    And ROI should be 283% ((7,650 - 2,000) ÷ 2,000 × 100%)
    And ROI Timeframe should be 6.1 months ((2,000 ÷ 7,650 × 12) + 3)

  Scenario: Very high dysfunction cost - Very high ROI
    Given my Total Cost of Dysfunction is $5,000,000
    And I selected "Full Day Workshop" ($3,500)
    And my top 2 priority drivers total $1,800,000
    When the ROI is calculated
    Then Projected Annual Savings should be $1,530,000 (1,800,000 × 0.85)
    And ROI should be 43,614% ((1,530,000 - 3,500) ÷ 3,500 × 100%)
    And ROI Timeframe should be 3.0 months ((3,500 ÷ 1,530,000 × 12) + 3)

  Scenario: Month-Long with perfect scores - Zero savings
    Given all my driver scores are 7.0 (perfect)
    And my Total Cost of Dysfunction is $0
    And I selected "Month-Long Engagement" ($30,000)
    When the ROI is calculated
    Then Projected Annual Savings should be $0
    And ROI should be -100% ((0 - 30,000) ÷ 30,000 × 100%)
    And ROI Timeframe should be undefined or infinite
    And the system should display a message: "Your team is already highly effective!"

  Scenario: Switching training types updates ROI metrics
    Given I completed the assessment with "Half Day Workshop"
    And I am viewing the Results page with Half Day ROI metrics
    When I navigate back to the Assessment page
    And I change my training type to "Full Day Workshop"
    And I resubmit the assessment
    Then the Results page should update to show Full Day ROI metrics
    And Projected Annual Savings should increase (top 2 vs top 1)
    And ROI percentage should change accordingly
    And ROI Timeframe should recalculate

  # ============================================
  # VISUAL CONSISTENCY
  # ============================================

  Scenario: How It Works button matches other buttons
    Given I am viewing the Results page with ROI cards
    When I compare the "How It Works" button on ROI cards to other "How It Works" buttons
    Then the button should have the same visual style:
      | Property        | Value                                |
      | Text Color      | #64563A (dark) / #D4C5A0 (light)     |
      | Background      | #64563A/10 (dark) / #64563A/20 (light)|
      | Hover BG        | #64563A/20 (dark) / #64563A/30 (light)|
      | Border Radius   | rounded-lg                           |
      | Icon            | HelpCircle (lucide-react)            |
      | Font Size       | text-sm                              |
      | Font Weight     | font-medium                          |

  Scenario: ROI cards maintain visual hierarchy
    Given I selected a specific training option (not "Not Sure Yet")
    When I view the ROI metric cards
    Then the cards should be displayed in a 3-column grid
    And each card should have:
      | Element           | Style                              |
      | Left Border       | 4px colored border (primary/green/amber) |
      | Title             | Small, muted foreground color      |
      | Value             | 4xl, bold, colored text            |
      | Subtitle          | Small, muted foreground color      |
      | How It Works btn  | Top-right corner of card header    |
