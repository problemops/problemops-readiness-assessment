import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Clock, CheckCircle2, Info, Building2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  type PriorityMatrixResult,
  type DriverMatrixResult,
  type Quadrant,
  QUADRANT_DEFINITIONS,
  DRIVER_NAMES,
  calculatePriorityMatrix,
  normalizeDriverScores,
  getDefaultIndustry,
  isValidIndustry,
  type Industry,
} from "@/lib/priorityMatrixCalculations";

type Driver = {
  id: string;
  name: string;
  value: number;
  weight: number;
};

type PriorityMatrixProps = {
  drivers: Driver[];
  detectedIndustry?: string;
  priorityMatrixData?: PriorityMatrixResult | null;
};

export default function PriorityMatrix({ 
  drivers, 
  detectedIndustry,
  priorityMatrixData 
}: PriorityMatrixProps) {
  // Use pre-calculated matrix data if available, otherwise calculate on the fly
  const matrixResult: PriorityMatrixResult = priorityMatrixData || (() => {
    const scores: Record<string, number> = {};
    drivers.forEach(d => {
      scores[d.id] = d.value;
    });
    const normalizedScores = normalizeDriverScores(scores);
    const industry: Industry = isValidIndustry(detectedIndustry || '') 
      ? detectedIndustry as Industry 
      : getDefaultIndustry();
    return calculatePriorityMatrix(normalizedScores, industry);
  })();

  const quadrantConfig: Record<Quadrant, {
    title: string;
    icon: typeof AlertTriangle;
    color: string;
    bgColor: string;
    borderColor: string;
    labelBg: string;
    labelText: string;
    labelBorder: string;
    chartBg: string;
  }> = {
    CRITICAL: {
      title: "Critical",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-red-600",
      labelBg: "bg-red-100 dark:bg-red-900/60",
      labelText: "text-red-800 dark:text-red-200",
      labelBorder: "border-red-300 dark:border-red-700",
      chartBg: "bg-red-50/60 dark:bg-red-950/20",
    },
    HIGH: {
      title: "High",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-600",
      labelBg: "bg-blue-100 dark:bg-blue-900/60",
      labelText: "text-blue-800 dark:text-blue-200",
      labelBorder: "border-blue-300 dark:border-blue-700",
      chartBg: "bg-blue-50/60 dark:bg-blue-950/20",
    },
    MEDIUM: {
      title: "Medium",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      borderColor: "border-yellow-600",
      labelBg: "bg-yellow-100 dark:bg-yellow-900/60",
      labelText: "text-yellow-800 dark:text-yellow-200",
      labelBorder: "border-yellow-300 dark:border-yellow-700",
      chartBg: "bg-yellow-50/60 dark:bg-yellow-950/20",
    },
    LOW: {
      title: "Low",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-600",
      labelBg: "bg-green-100 dark:bg-green-900/60",
      labelText: "text-green-800 dark:text-green-200",
      labelBorder: "border-green-300 dark:border-green-700",
      chartBg: "bg-green-50/60 dark:bg-green-950/20",
    },
  };

  // Group drivers by quadrant
  const driversByQuadrant: Record<Quadrant, DriverMatrixResult[]> = {
    CRITICAL: [],
    HIGH: [],
    MEDIUM: [],
    LOW: [],
  };

  matrixResult.drivers.forEach(driver => {
    driversByQuadrant[driver.quadrant].push(driver);
  });

  // Calculate position in chart (0-100 scale for both axes)
  // X-axis: Business Value Score (0-6 range mapped to 5-95)
  // Y-axis: Team Impact Score (0-6 range mapped to 5-95)
  const getPosition = (driver: DriverMatrixResult) => {
    // Max possible weighted score is 6 (gap) * 1.0 (weight) = 6
    const maxScore = 6;
    const x = 5 + (driver.businessValueScore / maxScore) * 90;
    const y = 5 + (driver.teamImpactScore / maxScore) * 90;
    return { x, y: 100 - y }; // Invert Y so high impact is at top
  };

  // Get abbreviated driver name for compact display
  const getAbbreviatedName = (name: string) => {
    const abbreviations: Record<string, string> = {
      "Trust": "Trust",
      "Psychological Safety": "Psych Safety",
      "Transactive Memory": "Trans. Memory",
      "Communication Quality": "Comm Quality",
      "Goal Clarity": "Goal Clarity",
      "Coordination": "Coordination",
      "Team Cognition": "Team Cognition",
    };
    return abbreviations[name] || name;
  };

  return (
    <div className="space-y-6">
      {/* Visual Matrix */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Action Priority Matrix</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Drivers plotted by impact on team performance (vertical) and business value if fixed (horizontal)
              </p>
            </div>
            {matrixResult.industry && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Industry: <span className="font-medium text-foreground">{matrixResult.industry}</span>
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className="relative w-full max-w-3xl mx-auto border-2 border-border rounded-lg overflow-visible"
            style={{ aspectRatio: '4/3', minHeight: '400px' }}
            role="img"
            aria-label="Action Priority Matrix showing 7 drivers plotted by team impact and business value"
          >
            {/* Quadrant backgrounds - arranged for correct positioning */}
            {/* Top-left: MEDIUM (High Team, Low Biz), Top-right: CRITICAL (High Team, High Biz) */}
            {/* Bottom-left: LOW (Low Team, Low Biz), Bottom-right: HIGH (Low Team, High Biz) */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className={`${quadrantConfig.MEDIUM.chartBg} border-r border-b border-border`} />
              <div className={`${quadrantConfig.CRITICAL.chartBg} border-b border-border`} />
              <div className={`${quadrantConfig.LOW.chartBg} border-r border-border`} />
              <div className={`${quadrantConfig.HIGH.chartBg}`} />
            </div>

            {/* Threshold lines */}
            <div 
              className="absolute left-1/2 top-0 bottom-0 border-l-2 border-dashed border-border/50"
              style={{ left: '50%' }}
            />
            <div 
              className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-border/50"
              style={{ top: '50%' }}
            />

            {/* Y-axis label (Team Impact) */}
            <div className="absolute -left-2 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none">
              <div className="transform -rotate-90 origin-left translate-x-4 text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                High team impact
              </div>
              <div className="transform -rotate-90 origin-left translate-x-4 text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                Low team impact
              </div>
            </div>

            {/* X-axis label (Business Value) */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 translate-y-6 pointer-events-none">
              <div className="text-[10px] font-medium text-muted-foreground">
                Low business value
              </div>
              <div className="text-[10px] font-medium text-muted-foreground">
                High business value
              </div>
            </div>

            {/* Quadrant labels */}
            <div className="absolute top-2 left-2 text-center pointer-events-none">
              <Clock className="h-5 w-5 text-yellow-600/60 mx-auto mb-0.5" />
              <div className="text-[10px] font-semibold text-yellow-700/60 dark:text-yellow-400/60">MEDIUM</div>
            </div>
            <div className="absolute top-2 right-2 text-center pointer-events-none">
              <AlertTriangle className="h-5 w-5 text-red-600/60 mx-auto mb-0.5" />
              <div className="text-[10px] font-semibold text-red-700/60 dark:text-red-400/60">CRITICAL</div>
            </div>
            <div className="absolute bottom-8 left-2 text-center pointer-events-none">
              <CheckCircle2 className="h-5 w-5 text-green-600/60 mx-auto mb-0.5" />
              <div className="text-[10px] font-semibold text-green-700/60 dark:text-green-400/60">LOW</div>
            </div>
            <div className="absolute bottom-8 right-2 text-center pointer-events-none">
              <TrendingUp className="h-5 w-5 text-blue-600/60 mx-auto mb-0.5" />
              <div className="text-[10px] font-semibold text-blue-700/60 dark:text-blue-400/60">HIGH</div>
            </div>

            {/* Plot drivers with tooltips */}
            <TooltipProvider>
              {matrixResult.drivers.map((driver) => {
                const pos = getPosition(driver);
                const config = quadrantConfig[driver.quadrant];

                return (
                  <Tooltip key={driver.driverId}>
                    <TooltipTrigger asChild>
                      <div
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        role="listitem"
                        aria-label={`${driver.driverName}: Score ${driver.score.toFixed(1)} out of 7, ${driver.quadrant} priority`}
                      >
                        {/* Driver label badge */}
                        <div
                          className={`
                            px-2 py-1.5 rounded-lg border shadow-sm
                            ${config.labelBg} ${config.labelText} ${config.labelBorder}
                            text-center whitespace-nowrap
                            transition-transform hover:scale-105 hover:shadow-md
                          `}
                        >
                          <div className="text-xs font-semibold leading-tight">
                            {getAbbreviatedName(driver.driverName)}
                          </div>
                          <div className="text-[10px] font-medium opacity-80">
                            {driver.score.toFixed(1)}/7
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-semibold">{driver.driverName}</p>
                        <p className="text-xs">Current Score: {driver.score.toFixed(1)} / 7.0</p>
                        <p className="text-xs">Gap from Ideal: {driver.gap.toFixed(1)}</p>
                        <p className="text-xs">Team Impact Score: {driver.teamImpactScore.toFixed(2)}</p>
                        <p className="text-xs">Business Value Score: {driver.businessValueScore.toFixed(2)}</p>
                        <p className="text-xs font-medium mt-1">Priority: {driver.quadrant}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
          
          {/* Legend */}
          <div className="mt-8 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Priority Legend</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {(Object.keys(QUADRANT_DEFINITIONS) as Quadrant[]).map((quadrant) => {
                const def = QUADRANT_DEFINITIONS[quadrant];
                const config = quadrantConfig[quadrant];
                return (
                  <div key={quadrant} className="flex items-start gap-2">
                    <div className={`w-4 h-4 rounded mt-0.5 ${config.labelBg} ${config.labelBorder} border flex-shrink-0`} />
                    <div>
                      <span className={`font-medium ${config.color}`}>{def.label}:</span>
                      <span className="text-muted-foreground ml-1">{def.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quadrant Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(quadrantConfig) as Quadrant[]).map((quadrant) => {
          const config = quadrantConfig[quadrant];
          const driversInQuadrant = driversByQuadrant[quadrant];
          const Icon = config.icon;
          const def = QUADRANT_DEFINITIONS[quadrant];

          if (driversInQuadrant.length === 0) return null;

          return (
            <Card key={quadrant} className={`border-l-4 ${config.borderColor}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-base flex items-center gap-2 ${config.color}`}>
                  <Icon className="h-5 w-5" />
                  {def.label} Priority
                  <span className="text-xs font-normal text-muted-foreground ml-auto">
                    {driversInQuadrant.length} driver{driversInQuadrant.length !== 1 ? 's' : ''}
                  </span>
                </CardTitle>
                <p className="text-xs text-muted-foreground">{def.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {driversInQuadrant.map((driver) => (
                    <li key={driver.driverId} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{driver.driverName}</span>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="text-xs">
                          Team: {driver.teamImpactScore.toFixed(1)}
                        </span>
                        <span className="text-xs">
                          Biz: {driver.businessValueScore.toFixed(1)}
                        </span>
                        <span>
                          {driver.score.toFixed(1)}/7
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Recommendations */}
      {driversByQuadrant.CRITICAL.length > 0 && (
        <Card className="bg-red-50/50 dark:bg-red-950/10 border-red-600/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Recommended Focus Areas</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  These drivers have both high impact on daily team performance AND high business value if fixed. 
                  Address these first for maximum ROI:
                </p>
                <ul className="space-y-2">
                  {driversByQuadrant.CRITICAL
                    .sort((a: DriverMatrixResult, b: DriverMatrixResult) => (b.teamImpactScore + b.businessValueScore) - (a.teamImpactScore + a.businessValueScore))
                    .map((driver: DriverMatrixResult) => (
                    <li key={driver.driverId} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                      <span className="font-medium">{driver.driverName}</span>
                      <span className="text-muted-foreground">
                        (Score: {driver.score.toFixed(1)}, Team Impact: {driver.teamImpactScore.toFixed(1)}, Business Value: {driver.businessValueScore.toFixed(1)})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* High Priority Strategic Investments */}
      {driversByQuadrant.HIGH.length > 0 && (
        <Card className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-600/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Strategic Investment Opportunities</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  These drivers have high business value but lower daily team impact. 
                  Consider these for strategic long-term improvements:
                </p>
                <ul className="space-y-2">
                  {driversByQuadrant.HIGH.map((driver) => (
                    <li key={driver.driverId} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <span className="font-medium">{driver.driverName}</span>
                      <span className="text-muted-foreground">
                        (Score: {driver.score.toFixed(1)}, Business Value: {driver.businessValueScore.toFixed(1)})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
