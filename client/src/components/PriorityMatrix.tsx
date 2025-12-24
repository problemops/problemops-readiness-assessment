import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Eye, TrendingUp } from "lucide-react";

type Driver = {
  id: string;
  name: string;
  value: number;
  weight: number;
};

type PriorityMatrixProps = {
  drivers: Driver[];
};

export default function PriorityMatrix({ drivers }: PriorityMatrixProps) {
  // Calculate thresholds for quadrants
  const avgWeight = drivers.reduce((sum, d) => sum + d.weight, 0) / drivers.length;
  const avgScore = drivers.reduce((sum, d) => sum + d.value, 0) / drivers.length;

  // Categorize drivers into quadrants
  const getQuadrant = (driver: Driver) => {
    const highImpact = driver.weight >= avgWeight;
    const highPerformance = driver.value >= avgScore;

    if (highImpact && !highPerformance) return "critical";
    if (highImpact && highPerformance) return "strength";
    if (!highImpact && !highPerformance) return "monitor";
    return "stable";
  };

  const quadrantInfo = {
    critical: {
      title: "Critical Priorities",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-red-600",
      labelBg: "bg-red-100 dark:bg-red-900/60",
      labelText: "text-red-800 dark:text-red-200",
      labelBorder: "border-red-300 dark:border-red-700",
      description: "High impact, low performance - Fix these first for maximum ROI",
    },
    strength: {
      title: "Key Strengths",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-600",
      labelBg: "bg-green-100 dark:bg-green-900/60",
      labelText: "text-green-800 dark:text-green-200",
      labelBorder: "border-green-300 dark:border-green-700",
      description: "High impact, high performance - Maintain these",
    },
    monitor: {
      title: "Monitor",
      icon: Eye,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      borderColor: "border-yellow-600",
      labelBg: "bg-yellow-100 dark:bg-yellow-900/60",
      labelText: "text-yellow-800 dark:text-yellow-200",
      labelBorder: "border-yellow-300 dark:border-yellow-700",
      description: "Lower impact, low performance - Address after critical priorities",
    },
    stable: {
      title: "Stable Areas",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-600",
      labelBg: "bg-blue-100 dark:bg-blue-900/60",
      labelText: "text-blue-800 dark:text-blue-200",
      labelBorder: "border-blue-300 dark:border-blue-700",
      description: "Lower impact, high performance - Keep doing what you're doing",
    },
  };

  const categorizedDrivers = {
    critical: drivers.filter((d) => getQuadrant(d) === "critical"),
    strength: drivers.filter((d) => getQuadrant(d) === "strength"),
    monitor: drivers.filter((d) => getQuadrant(d) === "monitor"),
    stable: drivers.filter((d) => getQuadrant(d) === "stable"),
  };

  // Calculate position in chart (0-100 scale for both axes)
  // Add padding to keep labels within bounds
  const getPosition = (driver: Driver) => {
    const x = 10 + ((driver.value - 1) / 6) * 80; // Score 1-7 mapped to 10-90 (with padding)
    const y = 10 + ((driver.weight - 0.10) / 0.10) * 80; // Weight ~0.12-0.18 mapped to 10-90
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
          <CardTitle>Action Priority Matrix</CardTitle>
          <p className="text-sm text-muted-foreground">
            Drivers plotted by their impact on team effectiveness (vertical) and current performance (horizontal)
          </p>
        </CardHeader>
        <CardContent>
          <div 
            className="relative w-full max-w-3xl mx-auto border-2 border-border rounded-lg overflow-visible"
            style={{ aspectRatio: '4/3', minHeight: '400px' }}
            role="img"
            aria-label="Action Priority Matrix showing 7 drivers plotted by impact and performance"
          >
            {/* Quadrant backgrounds */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="bg-red-50/50 dark:bg-red-950/10 border-r border-b border-border" />
              <div className="bg-green-50/50 dark:bg-green-950/10 border-b border-border" />
              <div className="bg-yellow-50/50 dark:bg-yellow-950/10 border-r border-border" />
              <div className="bg-blue-50/50 dark:bg-blue-950/10" />
            </div>

            {/* Axis labels */}
            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs font-medium text-muted-foreground bg-background/90 px-2 py-1 rounded whitespace-nowrap">
              ← Low Impact | High Impact →
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 text-xs font-medium text-muted-foreground bg-background/90 px-2 py-1 rounded whitespace-nowrap">
              ← Low Score | High Score →
            </div>

            {/* Quadrant labels */}
            <div className="absolute top-2 left-2 text-center pointer-events-none">
              <AlertTriangle className="h-5 w-5 text-red-600/60 mx-auto mb-0.5" />
              <div className="text-[10px] font-semibold text-red-700/60 dark:text-red-400/60">CRITICAL</div>
            </div>
            <div className="absolute top-2 right-2 text-center pointer-events-none">
              <CheckCircle2 className="h-5 w-5 text-green-600/60 mx-auto mb-0.5" />
              <div className="text-[10px] font-semibold text-green-700/60 dark:text-green-400/60">STRENGTHS</div>
            </div>
            <div className="absolute bottom-2 left-2 text-center pointer-events-none">
              <Eye className="h-5 w-5 text-yellow-600/60 mx-auto mb-0.5" />
              <div className="text-[10px] font-semibold text-yellow-700/60 dark:text-yellow-400/60">MONITOR</div>
            </div>
            <div className="absolute bottom-2 right-2 text-center pointer-events-none">
              <TrendingUp className="h-5 w-5 text-blue-600/60 mx-auto mb-0.5" />
              <div className="text-[10px] font-semibold text-blue-700/60 dark:text-blue-400/60">STABLE</div>
            </div>

            {/* Plot drivers with always-visible labels */}
            {drivers.map((driver) => {
              const pos = getPosition(driver);
              const quadrant = getQuadrant(driver);
              const info = quadrantInfo[quadrant as keyof typeof quadrantInfo];

              return (
                <div
                  key={driver.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  role="listitem"
                  aria-label={`${driver.name}: Score ${driver.value.toFixed(1)} out of 7, ${quadrant} priority`}
                >
                  {/* Always-visible label badge */}
                  <div
                    className={`
                      px-2 py-1.5 rounded-lg border shadow-sm
                      ${info.labelBg} ${info.labelText} ${info.labelBorder}
                      text-center whitespace-nowrap
                      transition-transform hover:scale-105 hover:shadow-md
                    `}
                  >
                    <div className="text-xs font-semibold leading-tight">
                      {getAbbreviatedName(driver.name)}
                    </div>
                    <div className="text-[10px] font-medium opacity-80">
                      {driver.value.toFixed(1)}/7
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-300 dark:bg-red-900/60 dark:border-red-700" />
              <span className="text-muted-foreground">Critical (fix first)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-300 dark:bg-green-900/60 dark:border-green-700" />
              <span className="text-muted-foreground">Strength (maintain)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300 dark:bg-yellow-900/60 dark:border-yellow-700" />
              <span className="text-muted-foreground">Monitor (address later)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300 dark:bg-blue-900/60 dark:border-blue-700" />
              <span className="text-muted-foreground">Stable (keep going)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quadrant Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(quadrantInfo) as Array<keyof typeof quadrantInfo>).map((quadrant) => {
          const info = quadrantInfo[quadrant];
          const driversInQuadrant = categorizedDrivers[quadrant];
          const Icon = info.icon;

          if (driversInQuadrant.length === 0) return null;

          return (
            <Card key={quadrant} className={`border-l-4 ${info.borderColor}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-base flex items-center gap-2 ${info.color}`}>
                  <Icon className="h-5 w-5" />
                  {info.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground">{info.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {driversInQuadrant.map((driver) => (
                    <li key={driver.id} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{driver.name}</span>
                      <span className="text-muted-foreground">
                        {driver.value.toFixed(1)}/7.0
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Recommendations */}
      {categorizedDrivers.critical.length > 0 && (
        <Card className="bg-red-50/50 dark:bg-red-950/10 border-red-600/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Recommended Focus Areas</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Start with these high-impact, low-performance drivers to maximize your ROI:
                </p>
                <ul className="space-y-2">
                  {categorizedDrivers.critical.map((driver) => (
                    <li key={driver.id} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                      <span className="font-medium">{driver.name}</span>
                      <span className="text-muted-foreground">
                        (Score: {driver.value.toFixed(1)}, Impact: {Math.round(driver.weight * 100)}%)
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
