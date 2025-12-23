import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { FourCsAnalysis } from '@/lib/fourCsScoring';

interface FourCsChartProps {
  analysis: FourCsAnalysis;
}

export function FourCsChart({ analysis }: FourCsChartProps) {
  const TARGET_PERCENT = analysis.target * 100;
  
  const cItems = [
    {
      name: 'Criteria',
      description: 'Building shared language and understanding',
      score: analysis.scores.criteria,
      gap: analysis.gaps.criteria,
      color: 'bg-blue-500',
    },
    {
      name: 'Commitment',
      description: 'Agreeing on priorities and outcomes',
      score: analysis.scores.commitment,
      gap: analysis.gaps.commitment,
      color: 'bg-purple-500',
    },
    {
      name: 'Collaboration',
      description: 'Working together effectively',
      score: analysis.scores.collaboration,
      gap: analysis.gaps.collaboration,
      color: 'bg-green-500',
    },
    {
      name: 'Change',
      description: 'Delivering and measuring impact',
      score: analysis.scores.change,
      gap: analysis.gaps.change,
      color: 'bg-orange-500',
    },
  ];
  
  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">The 4 C's of ProblemOps</h3>
          <p className="text-muted-foreground">
            Your team's performance across the four key areas of effective problem-solving operations.
            The goal is to reach {TARGET_PERCENT}% in all four areas.
          </p>
        </div>
        
        <div className="grid gap-6">
          {cItems.map((item) => {
            const percentScore = item.score * 100;
            const percentGap = item.gap * 100;
            const isAboveTarget = percentScore >= TARGET_PERCENT;
            
            return (
              <div key={item.name} className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{percentScore.toFixed(0)}%</div>
                    {!isAboveTarget && (
                      <div className="text-sm text-muted-foreground">
                        {percentGap.toFixed(0)}% below target
                      </div>
                    )}
                    {isAboveTarget && (
                      <div className="text-sm text-green-600 dark:text-green-400">
                        ✓ Above target
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <Progress 
                    value={percentScore} 
                    className="h-3"
                  />
                  {/* Target line indicator */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                    style={{ left: `${TARGET_PERCENT}%` }}
                    title={`Target: ${TARGET_PERCENT}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>How to read this:</strong> Each bar shows your team's current level in that area. 
            The red line marks the {TARGET_PERCENT}% target. Areas furthest from the target are your highest priorities for improvement.
          </p>
        </div>
      </div>
    </Card>
  );
}
