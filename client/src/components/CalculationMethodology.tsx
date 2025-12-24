import React, { ReactNode } from 'react';

interface MethodologySection {
  id: string;
  title: string;
  content: ReactNode;
}

/**
 * Calculation Methodology Content
 * 
 * This component provides detailed explanations of how each calculation works
 * in the ProblemOps ROI Calculator. Content is sourced from the technical
 * methodology document.
 */

export const methodologySections: Record<string, MethodologySection> = {
  readiness: {
    id: 'readiness',
    title: 'Readiness Score Calculation',
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">How Your Readiness Score is Calculated</h3>
        
        <p>
          Your Readiness Score represents your team's overall effectiveness as a percentage from 0% to 100%.
          It is calculated using a <strong>weighted average</strong> of the 7 driver scores.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Formula:</h4>
          <p className="font-mono text-sm">
            Readiness = [Σ(D<sub>i</sub> × w<sub>i</sub>)] ÷ [Σ(w<sub>i</sub> × 7)] × 100%
          </p>
          <div className="mt-3 text-sm space-y-1">
            <p><strong>Where:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><em>Readiness</em> = overall team readiness (percentage)</li>
              <li><em>D<sub>i</sub></em> = score for driver <em>i</em> (1-7 scale)</li>
              <li><em>w<sub>i</sub></em> = weight for driver <em>i</em> (0-1 scale)</li>
              <li><em>Σ</em> = sum across all 7 drivers</li>
              <li><em>7</em> = maximum possible driver score</li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Driver Weights (Based on Research):</h4>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Driver</th>
                <th className="text-right py-2">Weight</th>
                <th className="text-left pl-4 py-2">Research Source</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Team Cognition</td>
                <td className="text-right py-2">1.00</td>
                <td className="pl-4 py-2">DeChurch & Mesmer-Magnus (2010)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Trust</td>
                <td className="text-right py-2">0.94</td>
                <td className="pl-4 py-2">Costa & Anderson (2011)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Communication Quality</td>
                <td className="text-right py-2">0.89</td>
                <td className="pl-4 py-2">Marlow et al. (2018)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Coordination</td>
                <td className="text-right py-2">0.83</td>
                <td className="pl-4 py-2">LePine et al. (2008)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Goal Clarity</td>
                <td className="text-right py-2">0.80</td>
                <td className="pl-4 py-2">Mathieu et al. (2008)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Psychological Safety</td>
                <td className="text-right py-2">0.77</td>
                <td className="pl-4 py-2">Frazier et al. (2017)</td>
              </tr>
              <tr>
                <td className="py-2">Transactive Memory (TMS)</td>
                <td className="text-right py-2">0.74</td>
                <td className="pl-4 py-2">DeChurch & Mesmer-Magnus (2010)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Example Calculation:</h4>
          <p className="text-sm">
            If your driver scores are: Trust (2.4), Psych Safety (4.4), Communication (2.4), 
            Goals (3.4), Coordination (6.4), TMS (6.4), Team Cognition (4.4)
          </p>
          <p className="text-sm mt-2">
            <strong>Numerator:</strong> (2.4×0.94) + (4.4×0.77) + (2.4×0.89) + (3.4×0.80) + (6.4×0.83) + (6.4×0.74) + (4.4×1.00) = 24.96
          </p>
          <p className="text-sm mt-1">
            <strong>Denominator:</strong> (0.94×7) + (0.77×7) + (0.89×7) + (0.80×7) + (0.83×7) + (0.74×7) + (1.00×7) = 41.79
          </p>
          <p className="text-sm mt-1">
            <strong>Readiness:</strong> 24.96 ÷ 41.79 × 100% = <strong>59.7%</strong>
          </p>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          This weighted approach ensures that drivers with stronger research evidence have more influence on your overall score.
        </p>
      </div>
    )
  },

  dysfunction: {
    id: 'dysfunction',
    title: 'Dysfunction Cost Calculation',
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">How Dysfunction Cost is Calculated</h3>
        
        <p>
          The Dysfunction Cost represents the estimated annual dollar amount your team is losing due to ineffectiveness.
          This is not money you are spending—it is money you are losing through inefficiency, rework, delays, and missed opportunities.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Formula:</h4>
          <p className="font-mono text-sm">
            Total Dysfunction Cost = (1 - R) × P
          </p>
          <div className="mt-3 text-sm space-y-1">
            <p><strong>Where:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><em>Total Dysfunction Cost</em> = annual cost of team ineffectiveness ($)</li>
              <li><em>R</em> = Readiness Score (as a decimal, not percentage)</li>
              <li><em>P</em> = total annual team payroll ($)</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Example Calculation:</h4>
          <p className="text-sm">
            <strong>Team size:</strong> 10 people<br />
            <strong>Average salary:</strong> $100,000<br />
            <strong>Total payroll (P):</strong> $1,000,000<br />
            <strong>Readiness (R):</strong> 0.597 (59.7%)
          </p>
          <p className="text-sm mt-2">
            <strong>Calculation:</strong> (1 - 0.597) × $1,000,000 = 0.403 × $1,000,000 = <strong>$403,000</strong>
          </p>
          <p className="text-sm mt-2">
            This means your team is wasting <strong>$403,000 per year</strong> (40.3% of payroll) due to teamwork problems.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Individual Driver Costs:</h4>
          <p className="text-sm mb-2">
            Each driver contributes to the total dysfunction cost based on its score and weight:
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="font-mono text-sm">
              Driver Cost = Dysfunction × w × P
            </p>
            <div className="mt-2 text-sm">
              <p><strong>Where:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><em>Dysfunction</em> = 1 - (D ÷ 7) = how far driver is from perfect</li>
                <li><em>D</em> = driver score (1-7 scale)</li>
                <li><em>w</em> = driver weight (0-1 scale)</li>
                <li><em>P</em> = total annual team payroll ($)</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Note:</strong> Individual driver costs add up to more than the total dysfunction cost because drivers overlap 
          and interact. The total dysfunction cost accounts for these interactions.
        </p>
      </div>
    )
  },

  drivers: {
    id: 'drivers',
    title: '7 Driver Scores',
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">How Driver Scores are Calculated</h3>
        
        <p>
          Each of the 7 drivers is measured using 5 questions from the assessment. 
          Your score for each driver is the average of your responses to those 5 questions.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Formula:</h4>
          <p className="font-mono text-sm">
            Driver Score = (Q₁ + Q₂ + Q₃ + Q₄ + Q₅) ÷ 5
          </p>
          <div className="mt-3 text-sm space-y-1">
            <p><strong>Where:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><em>Driver Score</em> = score for one driver (1-7 scale)</li>
              <li><em>Q₁, Q₂, Q₃, Q₄, Q₅</em> = the 5 question responses for that driver (1-7 scale)</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Example: Trust Score</h4>
          <p className="text-sm mb-2">If your Trust question responses were: 2, 3, 2, 4, 3</p>
          <p className="text-sm">
            <strong>Trust Score</strong> = (2 + 3 + 2 + 4 + 3) ÷ 5 = 14 ÷ 5 = <strong>2.8</strong>
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Interpreting Driver Scores:</h4>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Score Range</th>
                <th className="text-left py-2">Interpretation</th>
                <th className="text-left py-2">Action Needed</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">6.0-7.0</td>
                <td className="py-2">Strong</td>
                <td className="py-2">Maintain current practices</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">5.0-5.9</td>
                <td className="py-2">Adequate</td>
                <td className="py-2">Monitor and improve gradually</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">4.0-4.9</td>
                <td className="py-2">Moderate Gap</td>
                <td className="py-2">Plan for improvement</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">3.0-3.9</td>
                <td className="py-2">Significant Gap</td>
                <td className="py-2">Prioritize for improvement</td>
              </tr>
              <tr>
                <td className="py-2">1.0-2.9</td>
                <td className="py-2">Critical Gap</td>
                <td className="py-2">Address immediately</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Each driver is based on validated survey instruments from peer-reviewed research studies.
        </p>
      </div>
    )
  },

  priorityMatrix: {
    id: 'priorityMatrix',
    title: 'Priority Matrix Calculation',
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">How the Priority Matrix is Calculated</h3>
        
        <p>
          The Priority Matrix plots each driver on two dimensions: <strong>Team Impact</strong> (how much it affects daily operations) 
          and <strong>Business Value</strong> (the business outcomes if fixed). This helps you prioritize which drivers to address first.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Team Impact Formula:</h4>
            <p className="font-mono text-sm">
              Team Impact = Gap × w
            </p>
            <div className="mt-3 text-sm space-y-1">
              <p><strong>Where:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><em>Team Impact</em> = impact on daily operations</li>
                <li><em>Gap</em> = 7 - D = how far from perfect score of 7</li>
                <li><em>D</em> = driver score (1-7 scale)</li>
                <li><em>w</em> = team impact weight (same as research weight)</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Business Value Formula:</h4>
            <p className="font-mono text-sm">
              Business Value = Gap × w<sub>base</sub> × m
            </p>
            <div className="mt-3 text-sm space-y-1">
              <p><strong>Where:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><em>Business Value</em> = business outcomes if fixed</li>
                <li><em>Gap</em> = 7 - D = how far from perfect score of 7</li>
                <li><em>w<sub>base</sub></em> = base business value weight</li>
                <li><em>m</em> = industry-specific multiplier</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Example: Trust (Software Industry)</h4>
          <p className="text-sm">
            <strong>Trust score (D):</strong> 2.4<br />
            <strong>Trust weight (w):</strong> 0.94<br />
            <strong>Industry multiplier (m):</strong> 1.0 (Software)
          </p>
          <p className="text-sm mt-2">
            <strong>Gap:</strong> 7 - 2.4 = 4.6
          </p>
          <p className="text-sm mt-1">
            <strong>Team Impact:</strong> 4.6 × 0.94 = <strong>4.32</strong>
          </p>
          <p className="text-sm mt-1">
            <strong>Business Value:</strong> 4.6 × 0.94 × 1.0 = <strong>4.32</strong>
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">The Four Quadrants:</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border-2 border-red-500">
              <h5 className="font-semibold text-red-700 dark:text-red-400">CRITICAL (Top-Right)</h5>
              <p className="text-sm mt-1">High team impact AND high business value</p>
              <p className="text-xs mt-1 font-semibold">Action: Address immediately</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded border-2 border-orange-500">
              <h5 className="font-semibold text-orange-700 dark:text-orange-400">HIGH (Bottom-Right)</h5>
              <p className="text-sm mt-1">Low team impact BUT high business value</p>
              <p className="text-xs mt-1 font-semibold">Action: Plan for improvement</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border-2 border-yellow-500">
              <h5 className="font-semibold text-yellow-700 dark:text-yellow-400">MEDIUM (Top-Left)</h5>
              <p className="text-sm mt-1">High team impact BUT low business value</p>
              <p className="text-xs mt-1 font-semibold">Action: Improve for morale</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border-2 border-green-500">
              <h5 className="font-semibold text-green-700 dark:text-green-400">LOW (Bottom-Left)</h5>
              <p className="text-sm mt-1">Low team impact AND low business value</p>
              <p className="text-xs mt-1 font-semibold">Action: Monitor and maintain</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Quadrant thresholds are set at 2.5 for both axes. Drivers above 2.5 on an axis are considered "high" for that dimension.
        </p>
      </div>
    )
  },

  fourCs: {
    id: 'fourCs',
    title: '4 C\'s Framework Calculation',
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">How the 4 C's Scores are Calculated</h3>
        
        <p>
          The 4 C's (Criteria, Commitment, Collaboration, Change) represent the four stages of making change happen in the ProblemOps system.
          Each C is calculated by averaging specific drivers that support that stage.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Criteria (Developing Shared Language)</h4>
            <p className="font-mono text-sm">
              Criteria = (Communication + Goals + Coordination) ÷ 3
            </p>
            <p className="text-sm mt-2">
              <strong>Drivers:</strong> Communication Quality, Goal Clarity, Coordination
            </p>
            <p className="text-sm mt-1">
              <strong>Why:</strong> To develop shared language, you need clear communication, goal clarity, and coordination.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Commitment (Agreeing on What to Work On)</h4>
            <p className="font-mono text-sm">
              Commitment = (Communication + Trust + Goals) ÷ 3
            </p>
            <p className="text-sm mt-2">
              <strong>Drivers:</strong> Communication Quality, Trust, Goal Clarity
            </p>
            <p className="text-sm mt-1">
              <strong>Why:</strong> To commit together, you need clear communication, trust, and goal clarity.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Collaboration (Working Together)</h4>
            <p className="font-mono text-sm">
              Collaboration = (TMS + Trust + Psych Safety + Coordination + Team Cognition) ÷ 5
            </p>
            <p className="text-sm mt-2">
              <strong>Drivers:</strong> Transactive Memory, Trust, Psychological Safety, Coordination, Team Cognition
            </p>
            <p className="text-sm mt-1">
              <strong>Why:</strong> To collaborate effectively, you need to know who knows what (TMS), trust each other, 
              feel safe speaking up, coordinate work, and think together as a team.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Change (Implementing and Measuring)</h4>
            <p className="font-mono text-sm">
              Change = (Goals + Coordination) ÷ 2
            </p>
            <p className="text-sm mt-2">
              <strong>Drivers:</strong> Goal Clarity, Coordination
            </p>
            <p className="text-sm mt-1">
              <strong>Why:</strong> To implement change and measure impact, you need goal clarity and coordination.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Example Calculation:</h4>
          <p className="text-sm mb-2">
            First, normalize driver scores from 1-7 scale to 0-1 scale:
          </p>
          <p className="font-mono text-xs">
            Normalized = (Driver Score - 1) ÷ 6
          </p>
          <p className="text-sm mt-2">
            If Trust = 2.4, then Normalized Trust = (2.4 - 1) ÷ 6 = 0.233
          </p>
          <p className="text-sm mt-2">
            Then calculate Commitment: (0.233 + 0.233 + 0.400) ÷ 3 = <strong>28.9%</strong>
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Target and Gaps:</h4>
          <p className="text-sm mb-2">
            The target for all 4 C's is <strong>85%</strong>. The gap shows how far you are from this target.
          </p>
          <p className="text-sm">
            <strong>Gap</strong> = 85% - C Score
          </p>
          <p className="text-sm mt-1">
            The bigger the gap, the more that C needs attention.
          </p>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          The 4 C's provide a different view of your team: while the 7 Drivers show specific foundational elements, 
          the 4 C's show which stage of change-making is weakest.
        </p>
      </div>
    )
  },

  roi: {
    id: 'roi',
    title: 'ROI Calculation',
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">How Training ROI is Calculated</h3>
        
        <p>
          The Return on Investment (ROI) shows how much money you will save compared to the cost of training.
          It is calculated based on which drivers the training addresses and how much improvement you can expect.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Step 1: Priority Ranking</h4>
            <p className="text-sm mb-2">
              Drivers are ranked by their priority score:
            </p>
            <p className="font-mono text-sm">
              Priority Score = Gap × w
            </p>
            <div className="mt-2 text-sm">
              <p><strong>Where:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><em>Gap</em> = 0.85 - (D ÷ 7) = gap from 85% target</li>
                <li><em>D</em> = driver score (1-7 scale)</li>
                <li><em>w</em> = driver weight (0-1 scale)</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Step 2: Scoped Savings</h4>
            <p className="text-sm mb-2">
              Based on training type, calculate savings from addressing top <em>n</em> drivers:
            </p>
            <p className="font-mono text-sm">
              Scoped Savings = [Σ(Driver Cost for top n drivers)] × 0.85
            </p>
            <div className="mt-2 text-sm">
              <p><strong>Where:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><em>n</em> = 1 for Half Day, 2 for Full Day, 7 for Month-Long</li>
                <li><em>0.85</em> = assumed 85% improvement rate from training</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Step 3: ROI Percentage</h4>
            <p className="font-mono text-sm">
              ROI = (S - C) ÷ C × 100%
            </p>
            <div className="mt-2 text-sm">
              <p><strong>Where:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><em>ROI</em> = Return on Investment (percentage)</li>
                <li><em>S</em> = projected annual savings ($)</li>
                <li><em>C</em> = training cost ($)</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Step 4: Payback Period</h4>
            <p className="font-mono text-sm">
              Payback Period = (C ÷ S × 12) + 3
            </p>
            <div className="mt-2 text-sm">
              <p><strong>Where:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><em>Payback Period</em> = time to recover investment (months)</li>
                <li><em>12</em> = months in a year</li>
                <li><em>3</em> = implementation buffer (months for behavior change adoption)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Example: Full Day Workshop</h4>
          <p className="text-sm">
            <strong>Top 2 drivers:</strong> Trust ($617,580) + Communication ($584,857) = $1,202,437<br />
            <strong>Scoped Savings (S):</strong> $1,202,437 × 0.85 = $1,022,071<br />
            <strong>Training Cost (C):</strong> $3,500
          </p>
          <p className="text-sm mt-2">
            <strong>ROI:</strong> ($1,022,071 - $3,500) ÷ $3,500 × 100% = <strong>29,102%</strong>
          </p>
          <p className="text-sm mt-1">
            <strong>Payback:</strong> ($3,500 ÷ $1,022,071 × 12) + 3 = <strong>3.04 months</strong>
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Training Options:</h4>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Option</th>
                <th className="text-right py-2">Cost</th>
                <th className="text-center py-2">Drivers Addressed</th>
                <th className="text-right py-2">Typical ROI</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Half Day</td>
                <td className="text-right py-2">$2,000</td>
                <td className="text-center py-2">Top 1</td>
                <td className="text-right py-2">20,000-30,000%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Full Day</td>
                <td className="text-right py-2">$3,500</td>
                <td className="text-center py-2">Top 2</td>
                <td className="text-right py-2">25,000-35,000%</td>
              </tr>
              <tr>
                <td className="py-2">Month-Long</td>
                <td className="text-right py-2">$30,000</td>
                <td className="text-center py-2">All 7</td>
                <td className="text-right py-2">5,000-10,000%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          All three options typically have very high ROI because team dysfunction is so expensive. 
          The payback period is usually 3-4 months for all options.
        </p>
      </div>
    )
  }
};

export default function CalculationMethodology() {
  return null; // This component only exports the sections
}
