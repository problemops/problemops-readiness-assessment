Feature: Driver Cost of Dysfunction Calculations
  As a user viewing assessment results
  I want to see accurate cost breakdowns for each driver
  So that I understand which areas contribute most to team dysfunction costs

  Background:
    Given the following research-backed driver weights exist:
      | Driver               | Weight | Percentage |
      | Trust                | 0.18   | 18%        |
      | Psychological Safety | 0.17   | 17%        |
      | Communication        | 0.15   | 15%        |
      | Goal Clarity         | 0.14   | 14%        |
      | Coordination         | 0.13   | 13%        |
      | Transactive Memory   | 0.12   | 12%        |
      | Team Cognition       | 0.11   | 11%        |
    And the weights sum to exactly 1.00 (100%)

  # ============================================
  # DRIVER COST CALCULATION SCENARIOS
  # ============================================

  Scenario: Calculate individual driver cost from total dysfunction cost
    Given a team with total cost of dysfunction of $500,000
    And the Trust driver has a weight of 0.18
    When I calculate the Trust driver's cost contribution
    Then the Trust cost should be $90,000 (500,000 × 0.18)

  Scenario: All driver costs sum to total dysfunction cost
    Given a team with total cost of dysfunction of $514,286
    When I calculate each driver's cost contribution using weights
    Then the sum of all driver costs should equal $514,286
    And no rounding errors should exceed $1

  Scenario: Driver cost calculation with different TCD values
    Given the following total dysfunction costs:
      | TCD        | Trust Cost | Psych Safety Cost | Communication Cost |
      | $100,000   | $18,000    | $17,000           | $15,000            |
      | $500,000   | $90,000    | $85,000           | $75,000            |
      | $1,000,000 | $180,000   | $170,000          | $150,000           |
    When I calculate driver costs for each TCD
    Then each driver cost should equal TCD × driver weight

  Scenario: Driver cost reflects gap from optimal score
    Given a team with Trust score of 4.0 out of 7.0
    And the optimal score is 7.0
    And the gap is 3.0 points (42.9% gap)
    When I calculate the Trust driver's cost
    Then the cost should reflect the gap percentage
    And a perfect score (7.0) should result in $0 cost for that driver

  Scenario: Driver with perfect score has zero cost
    Given a team with Trust score of 7.0 out of 7.0
    And total payroll of $1,000,000
    When I calculate the Trust driver's cost
    Then the Trust cost should be $0
    Because there is no gap to fix

  # ============================================
  # VALUE IF FIXED CALCULATION SCENARIOS
  # ============================================

  Scenario: Value If Fixed equals driver cost at 85% improvement
    Given a driver cost of $90,000
    And the standard improvement assumption is 85%
    When I calculate the "Value If Fixed"
    Then the value should be $76,500 (90,000 × 0.85)

  Scenario: Value If Fixed for all drivers
    Given a team with total cost of dysfunction of $500,000
    And 85% improvement assumption
    When I calculate "Value If Fixed" for each driver
    Then each driver's value should equal (TCD × weight × 0.85)
    And the values should be:
      | Driver               | Cost     | Value If Fixed |
      | Trust                | $90,000  | $76,500        |
      | Psychological Safety | $85,000  | $72,250        |
      | Communication        | $75,000  | $63,750        |
      | Goal Clarity         | $70,000  | $59,500        |
      | Coordination         | $65,000  | $55,250        |
      | Transactive Memory   | $60,000  | $51,000        |
      | Team Cognition       | $55,000  | $46,750        |

  Scenario: Sum of Value If Fixed equals total potential savings
    Given a team with total cost of dysfunction of $500,000
    And 85% improvement assumption
    When I sum all driver "Value If Fixed" amounts
    Then the total should equal $425,000 (500,000 × 0.85)

  # ============================================
  # PRIORITY-BASED VALUE IF FIXED
  # ============================================

  Scenario: Half Day Workshop focuses on top 1 priority driver
    Given a team with Trust as the #1 priority driver
    And Trust cost is $90,000
    When I select Half Day Workshop training
    Then "Value If Fixed" should show $76,500 for Trust only
    And other drivers should show $0 or be excluded

  Scenario: Full Day Workshop focuses on top 2 priority drivers
    Given a team with Trust as #1 and Psych Safety as #2 priority
    And Trust cost is $90,000 and Psych Safety cost is $85,000
    When I select Full Day Workshop training
    Then "Value If Fixed" should show:
      | Driver               | Value If Fixed |
      | Trust                | $76,500        |
      | Psychological Safety | $72,250        |
    And total value should be $148,750

  Scenario: Month-Long Engagement addresses all 7 drivers
    Given a team with total cost of dysfunction of $500,000
    When I select Month-Long Engagement training
    Then "Value If Fixed" should show values for all 7 drivers
    And total value should be $425,000 (500,000 × 0.85)

  # ============================================
  # EDGE CASES
  # ============================================

  Scenario: Zero total dysfunction cost
    Given a team with total cost of dysfunction of $0
    When I calculate driver costs
    Then all driver costs should be $0
    And all "Value If Fixed" should be $0

  Scenario: Very large dysfunction cost
    Given a team with total cost of dysfunction of $10,000,000
    When I calculate driver costs
    Then Trust cost should be $1,800,000
    And calculations should not overflow or lose precision

  Scenario: Weights are applied consistently across all views
    Given driver costs are calculated
    When I view the Priority Matrix
    And I view the Training Recommendations
    And I view the PDF report
    Then all views should show the same driver cost values

Feature: RadioGroup Controlled Component Fix
  As a developer
  I want RadioGroup components to be properly controlled
  So that React does not throw console warnings

  # ============================================
  # RADIOGROUP INITIALIZATION SCENARIOS
  # ============================================

  Scenario: Training type RadioGroup initializes with default value
    Given I am on the Assessment page
    When the page loads
    Then the training type RadioGroup should have a default value of "not-sure"
    And no console warning about controlled/uncontrolled should appear

  Scenario: Rating question RadioGroup initializes correctly
    Given I am answering assessment questions
    When a new question appears
    Then the RadioGroup should initialize with value "" or undefined consistently
    And no console warning should appear

  Scenario: RadioGroup value changes do not cause warnings
    Given I am on a question with RadioGroup
    When I select a rating value
    Then the value should update correctly
    And no console warning about controlled/uncontrolled should appear

  Scenario: All RadioGroups maintain controlled state
    Given I complete the entire assessment
    When I review the console logs
    Then there should be zero "controlled to uncontrolled" warnings
    And there should be zero "uncontrolled to controlled" warnings

  # ============================================
  # SPECIFIC RADIOGROUP COMPONENTS
  # ============================================

  Scenario: Training type selector RadioGroup
    Given the training type options are:
      | Value       | Label                |
      | half-day    | Half Day Workshop    |
      | full-day    | Full Day Workshop    |
      | month-long  | Month-Long Engagement|
      | not-sure    | I'm Not Sure Yet     |
    When the component mounts
    Then value should be "not-sure" (not undefined)
    And onChange should update the controlled value

  Scenario: Question rating RadioGroup
    Given a 7-point Likert scale question
    When the question component mounts
    Then value should be "" (empty string, not undefined)
    And selecting a rating should update to "1" through "7"
