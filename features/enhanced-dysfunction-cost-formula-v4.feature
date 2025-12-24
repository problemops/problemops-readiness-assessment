Feature: Enhanced Dysfunction Cost Formula v4.0 - Vulnerability Protections
  As a system administrator
  I want the dysfunction cost formula to be mathematically rigorous and gaming-resistant
  So that organizations receive accurate, defensible cost estimates

  Background:
    Given the Enhanced Dysfunction Cost Formula v4.0 is implemented
    And mathematical precision libraries are loaded
    And all driver scores are on a 1-7 scale

  # ============================================================================
  # CRITICAL VULNERABILITIES
  # ============================================================================

  @critical @v1
  Scenario: V1 - Division by zero protection
    Given I am calculating dysfunction cost
    When I provide a team size of 0
    Then the system should reject the input with error "Team size must be at least 1"
    And the calculation should not proceed
    And no division by zero error should occur

  @critical @v1
  Scenario: V1 - Minimum team size validation
    Given I am calculating dysfunction cost
    When I provide a team size of 1
    Then the system should accept the input
    And the calculation should proceed successfully
    And the average salary should equal the total payroll

  @critical @v3
  Scenario: V3 - Driver scores below valid range are clamped
    Given I am calculating dysfunction cost
    When I provide driver scores with values [-1, 0, 0.5]
    Then all scores should be clamped to minimum value 1
    And the dysfunction calculation should use clamped values
    And the result should be mathematically valid

  @critical @v3
  Scenario: V3 - Driver scores above valid range are clamped
    Given I am calculating dysfunction cost
    When I provide driver scores with values [8, 9, 10, 7.5]
    Then all scores above 7 should be clamped to maximum value 7
    And the dysfunction calculation should use clamped values
    And the result should be mathematically valid

  @critical @v3
  Scenario: V3 - All drivers within valid range pass through unchanged
    Given I am calculating dysfunction cost
    When I provide all driver scores between 1 and 7
    Then no clamping should occur
    And all original scores should be used in calculations

  @critical @v7
  Scenario: V7 - Understaffed teams incur penalty
    Given I am calculating dysfunction cost for a team with payroll $500,000
    When the team size is 3 members (understaffed, N < 5)
    Then the team size factor η should be 1.2
    And the dysfunction cost should be amplified by 20%
    And this prevents gaming by firing people

  @critical @v7
  Scenario: V7 - Optimal team size has no penalty
    Given I am calculating dysfunction cost for a team with payroll $1,000,000
    When the team size is between 5 and 12 members
    Then the team size factor η should be 1.0
    And no amplification or reduction should occur

  @critical @v7
  Scenario: V7 - Overstaffed teams incur increasing penalty
    Given I am calculating dysfunction cost for a team with payroll $2,000,000
    When the team size is 20 members (overstaffed, N > 12)
    Then the team size factor η should be 1.16
    And the dysfunction cost should be amplified by 16%
    And the penalty should increase with team size

  # ============================================================================
  # HIGH SEVERITY VULNERABILITIES
  # ============================================================================

  @high @v4
  Scenario: V4 - Engagement function is continuous (no jumps)
    Given I am calculating disengagement cost C₆
    When the engagement score changes from 5.49 to 5.51
    Then the cost change should be smooth and gradual
    And there should be no discontinuous jump
    And the sigmoid function should be used

  @high @v4
  Scenario: V4 - Engagement score at boundary 5.5 (engaged threshold)
    Given I am calculating disengagement cost C₆
    And Trust score is 5.5 and Psychological Safety score is 5.5
    When the engagement score is exactly 5.5
    Then the engagement coefficient should be calculated via sigmoid
    And the result should be approximately 0.0045
    And no step function should be used

  @high @v4
  Scenario: V4 - Engagement score at boundary 3.5 (disengaged threshold)
    Given I am calculating disengagement cost C₆
    And Trust score is 3.5 and Psychological Safety score is 3.5
    When the engagement score is exactly 3.5
    Then the engagement coefficient should be calculated via sigmoid
    And the result should be approximately 0.0474
    And no step function should be used

  @high @v6
  Scenario: V6 - Single driver gaming detected (Trust inflated)
    Given I am calculating dysfunction cost
    And Trust score is 7.0 (perfect)
    And Psychological Safety score is 2.0 (very low)
    When the correlation check runs
    Then an anomaly should be detected
    And the anomaly score should be > 1.5
    And the gaming penalty G should be > 1.0
    And the total cost should be increased

  @high @v6
  Scenario: V6 - Correlated drivers within tolerance (no gaming)
    Given I am calculating dysfunction cost
    And Trust score is 5.0
    And Psychological Safety score is 4.8
    When the correlation check runs
    Then no anomaly should be detected
    And the anomaly score should be < 1.5
    And the gaming penalty G should be 1.0
    And no penalty should be applied

  @high @v6
  Scenario: V6 - Multiple driver gaming detected
    Given I am calculating dysfunction cost
    And Communication score is 7.0 but Coordination score is 2.0
    And Goal Clarity score is 7.0 but Team Cognition score is 2.0
    When the correlation check runs
    Then multiple anomalies should be detected
    And the total anomaly score should be high
    And the gaming penalty G should approach 1.5 (maximum)

  @high @v9
  Scenario: V9 - Business Value ratio below minimum is clamped
    Given I am calculating opportunity cost C₄
    When revenue is $500,000 and payroll is $1,000,000
    Then the BV ratio would be 0.5 (below minimum)
    And the BV ratio should be clamped to 1.0
    And opportunity cost should use BV = 1.0

  @high @v9
  Scenario: V9 - Business Value ratio above maximum is clamped
    Given I am calculating opportunity cost C₄
    When revenue is $15,000,000 and payroll is $1,000,000
    Then the BV ratio would be 15.0 (above maximum)
    And the BV ratio should be clamped to 10.0
    And opportunity cost should use BV = 10.0

  @high @v9
  Scenario: V9 - Business Value ratio within bounds passes through
    Given I am calculating opportunity cost C₄
    When revenue is $3,000,000 and payroll is $1,000,000
    Then the BV ratio is 3.0 (within bounds)
    And no clamping should occur
    And opportunity cost should use BV = 3.0

  @high @v11
  Scenario: V11 - Overlap discount prevents double-counting
    Given I am calculating total dysfunction cost
    And the sum of all six cost components is $1,000,000
    When the overlap discount is applied
    Then the subtotal should be $880,000
    And this represents a 12% reduction
    And double-counting is prevented

  @high @v11
  Scenario: V11 - Overlap discount is applied before multipliers
    Given I am calculating total dysfunction cost
    And the sum of C₁ through C₆ is $1,000,000
    When multipliers M₄C, φ, η, G are applied
    Then the overlap discount should be applied first
    And multipliers should be applied to the discounted subtotal
    And the order of operations should be: (ΣCᵢ × 0.88) × M₄C × φ × η × G

  # ============================================================================
  # MEDIUM SEVERITY VULNERABILITIES
  # ============================================================================

  @medium @v2
  Scenario: V2 - Negative payroll is rejected
    Given I am calculating dysfunction cost
    When I provide a payroll of -$100,000
    Then the system should reject the input with error "Payroll must be greater than 0"
    And the calculation should not proceed

  @medium @v2
  Scenario: V2 - Zero payroll is rejected
    Given I am calculating dysfunction cost
    When I provide a payroll of $0
    Then the system should reject the input with error "Payroll must be greater than 0"
    And the calculation should not proceed

  @medium @v2
  Scenario: V2 - Positive payroll is accepted
    Given I am calculating dysfunction cost
    When I provide a payroll of $1,000,000
    Then the system should accept the input
    And the calculation should proceed successfully

  @medium @v8
  Scenario: V8 - Industry factor lookup for Technology
    Given I am calculating dysfunction cost
    When the industry is "Technology"
    Then the industry factor φ should be 1.20
    And the turnover rate multiplier ρ should be 1.15

  @medium @v8
  Scenario: V8 - Industry factor lookup for Healthcare
    Given I am calculating dysfunction cost
    When the industry is "Healthcare"
    Then the industry factor φ should be 1.30
    And the turnover rate multiplier ρ should be 1.25

  @medium @v8
  Scenario: V8 - Industry factor lookup for Government
    Given I am calculating dysfunction cost
    When the industry is "Government"
    Then the industry factor φ should be 0.85
    And the turnover rate multiplier ρ should be 0.90

  @medium @v8
  Scenario: V8 - Invalid industry defaults to Manufacturing baseline
    Given I am calculating dysfunction cost
    When the industry is "UnknownIndustry"
    Then the industry factor φ should default to 1.00
    And the turnover rate multiplier ρ should default to 1.00

  @medium @v10
  Scenario: V10 - Assessment timestamp is recorded
    Given I am submitting an assessment
    When the assessment is saved
    Then the timestamp should be recorded
    And the timestamp should be in ISO 8601 format
    And the timestamp should reflect the submission time

  @medium @v12
  Scenario: V12 - Audit trail captures all inputs
    Given I am calculating dysfunction cost
    When the calculation completes
    Then all input values should be logged
    And the log should include: payroll, team size, all driver scores, industry, revenue
    And the log should include: timestamp, user ID, calculation version

  @medium @v12
  Scenario: V12 - Audit trail captures all outputs
    Given I am calculating dysfunction cost
    When the calculation completes
    Then all output values should be logged
    And the log should include: TCD, all cost components (C₁-C₆), all multipliers (M₄C, φ, η, G)
    And the log should include: engagement score, anomaly score

  @medium @v13
  Scenario: V13 - Confidence interval is calculated
    Given I am calculating dysfunction cost
    When the calculation completes
    Then a 95% confidence interval should be provided
    And the lower bound should be approximately 0.75× the point estimate
    And the upper bound should be approximately 1.30× the point estimate

  @medium @v14
  Scenario: V14 - Multi-currency handling with USD
    Given I am calculating dysfunction cost
    When the currency is USD
    Then no conversion should be applied
    And the payroll should be used as-is

  @medium @v14
  Scenario: V14 - Multi-currency handling with non-USD
    Given I am calculating dysfunction cost
    When the currency is EUR
    Then the system should require a USD conversion rate
    And the payroll should be converted to USD before calculation
    And the result should be converted back to EUR for display

  # ============================================================================
  # LOW SEVERITY VULNERABILITIES
  # ============================================================================

  @low @v5
  Scenario: V5 - Numerical precision for large payrolls
    Given I am calculating dysfunction cost
    When the payroll is $100,000,000 (100 million)
    Then all calculations should maintain precision to 2 decimal places
    And no floating-point errors should occur
    And the result should be accurate to the cent

  @low @v5
  Scenario: V5 - Numerical precision for small payrolls
    Given I am calculating dysfunction cost
    When the payroll is $50,000
    Then all calculations should maintain precision to 2 decimal places
    And no floating-point errors should occur
    And the result should be accurate to the cent

  @low @v15
  Scenario: V15 - Materiality threshold for small teams
    Given I am calculating dysfunction cost
    When the team size is 3 and payroll is $300,000
    Then the confidence interval should be wider
    And a materiality warning should be displayed
    And the warning should indicate "Small sample size - results less reliable"

  # ============================================================================
  # MATHEMATICAL PROPERTIES
  # ============================================================================

  @property @boundedness
  Scenario: Property - Lower bound (TCD ≥ 0)
    Given I am calculating dysfunction cost
    When I provide any valid inputs
    Then the Total Dysfunction Cost should be ≥ 0
    And negative costs should never occur

  @property @boundedness
  Scenario: Property - Upper bound (TCD ≤ 3.5P)
    Given I am calculating dysfunction cost with payroll $1,000,000
    When I provide the worst possible driver scores (all 1.0)
    Then the Total Dysfunction Cost should be ≤ $3,500,000
    And the hard cap of 350% should be enforced

  @property @perfect-team
  Scenario: Property - Perfect team has zero cost
    Given I am calculating dysfunction cost
    When all driver scores are 7.0 (perfect)
    Then the Total Dysfunction Cost should be $0
    And all cost components should be $0

  @property @monotonicity
  Scenario: Property - Improving Trust reduces TCD
    Given I am calculating dysfunction cost with Trust = 3.0
    And the initial TCD is recorded
    When I increase Trust to 4.0
    Then the new TCD should be less than the initial TCD
    And the reduction should be measurable

  @property @monotonicity
  Scenario: Property - Improving any driver reduces TCD
    Given I am calculating dysfunction cost
    And the initial TCD is recorded
    When I improve any single driver score by 1 point
    Then the new TCD should be less than the initial TCD
    And this should be true for all 7 drivers

  @property @proportionality
  Scenario: Property - TCD scales linearly with payroll
    Given I am calculating dysfunction cost with payroll $1,000,000
    And the TCD is $600,000
    When I double the payroll to $2,000,000
    Then the TCD should double to $1,200,000
    And the ratio TCD/Payroll should remain constant

  @property @continuity
  Scenario: Property - Small input changes produce small output changes
    Given I am calculating dysfunction cost
    And the initial TCD is recorded
    When I change any driver score by 0.01
    Then the TCD change should be small and proportional
    And no discontinuous jumps should occur

  # ============================================================================
  # INTEGRATION SCENARIOS
  # ============================================================================

  @integration
  Scenario: Real-world scenario - Technology company with moderate dysfunction
    Given I am calculating dysfunction cost
    And the industry is "Technology"
    And the payroll is $1,800,000
    And the team size is 15
    And the revenue is $5,400,000
    And driver scores are:
      | Driver                | Score |
      | Communication         | 4.2   |
      | Trust                 | 5.1   |
      | Psychological Safety  | 4.8   |
      | Goal Clarity          | 3.9   |
      | Coordination          | 4.5   |
      | TMS                   | 4.0   |
      | Team Cognition        | 4.3   |
    When the calculation runs
    Then the Total Dysfunction Cost should be approximately $1,228,747
    And the cost as % of payroll should be approximately 68.3%
    And the 95% CI should be [$921,560, $1,597,371]
    And the engagement score should be 4.95 (Not Engaged)

  @integration
  Scenario: Real-world scenario - Healthcare team with high dysfunction
    Given I am calculating dysfunction cost
    And the industry is "Healthcare"
    And the payroll is $2,000,000
    And the team size is 20
    And the revenue is $4,000,000
    And all driver scores are 2.5 (high dysfunction)
    When the calculation runs
    Then the Total Dysfunction Cost should be > $1,500,000
    And the cost as % of payroll should be > 75%
    And the industry factor should amplify costs by 30%
    And the team size factor should penalize overstaffing

  @integration
  Scenario: Real-world scenario - Small startup with excellent teamwork
    Given I am calculating dysfunction cost
    And the industry is "Technology"
    And the payroll is $400,000
    And the team size is 4
    And the revenue is $800,000
    And all driver scores are 6.5 (excellent)
    When the calculation runs
    Then the Total Dysfunction Cost should be < $100,000
    And the cost as % of payroll should be < 25%
    And the understaffing penalty should apply (η = 1.2)

  # ============================================================================
  # EDGE CASES
  # ============================================================================

  @edge-case
  Scenario: Edge case - All drivers at minimum (1.0)
    Given I am calculating dysfunction cost
    When all driver scores are 1.0
    Then the calculation should complete without errors
    And the TCD should be at or near the maximum
    And the upper bound cap should be enforced

  @edge-case
  Scenario: Edge case - Mixed extreme scores
    Given I am calculating dysfunction cost
    When some drivers are 1.0 and others are 7.0
    Then gaming detection should trigger
    And the gaming penalty should be applied
    And the TCD should reflect the penalty

  @edge-case
  Scenario: Edge case - Very large team (N = 100)
    Given I am calculating dysfunction cost
    When the team size is 100
    Then the team size factor η should be 2.76
    And the dysfunction cost should be heavily amplified
    And the calculation should complete without overflow

  @edge-case
  Scenario: Edge case - Single-person team (N = 1)
    Given I am calculating dysfunction cost
    When the team size is 1
    Then the calculation should complete
    And turnover cost should be calculated correctly
    And average salary should equal total payroll
