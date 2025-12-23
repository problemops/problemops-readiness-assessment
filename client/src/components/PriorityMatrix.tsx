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
      description: "High impact, low performance - Fix these first for maximum ROI",
    },
    strength: {
      title: "Key Strengths",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-600",
      description: "High impact, high performance - Maintain these",
    },
    monitor: {
      title: "Monitor",
      icon: Eye,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      borderColor: "border-yellow-600",
      description: "Lower impact, low performance - Address after critical priorities",
    },
    stable: {
      title: "Stable Areas",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-600",
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
  const getPosition = (driver: Driver) => {
    const x = ((driver.value - 1) / 6) * 100; // Score 1-7 mapped to 0-100
    const y = ((driver.weight - 0.10) / 0.10) * 100; // Weight ~0.12-0.18 mapped to 0-100
    return { x, y: 100 - y }; // Invert Y so high impact is at top
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
          <div className="relative w-full aspect-square max-w-2xl mx-auto border-2 border-border rounded-lg overflow-hidden">
            {/* Quadrant backgrounds */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="bg-red-50/50 dark:bg-red-950/10 border-r border-b border-border" />
              <div className="bg-green-50/50 dark:bg-green-950/10 border-b border-border" />
              <div className="bg-yellow-50/50 dark:bg-yellow-950/10 border-r border-border" />
              <div className="bg-blue-50/50 dark:bg-blue-950/10" />
            </div>

            {/* Axis labels */}
            <div className="absolute top-2 left-2 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
              High Impact
            </div>
            <div className="absolute bottom-2 left-2 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
              Low Impact
            </div>
            <div className="absolute bottom-2 left-2 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
              Low Score
            </div>
            <div className="absolute bottom-2 right-2 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
              High Score
            </div>

            {/* Quadrant labels */}
            <div className="absolute top-[15%] left-[15%] text-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-1" />
              <div className="text-xs font-semibold text-red-700 dark:text-red-400">Critical</div>
            </div>
            <div className="absolute top-[15%] right-[15%] text-center">
              <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="text-xs font-semibold text-green-700 dark:text-green-400">Strengths</div>
            </div>
            <div className="absolute bottom-[15%] left-[15%] text-center">
              <Eye className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
              <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">Monitor</div>
            </div>
            <div className="absolute bottom-[15%] right-[15%] text-center">
              <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-semibold text-blue-700 dark:text-blue-400">Stable</div>
            </div>

            {/* Plot drivers */}
            {drivers.map((driver) => {
              const pos = getPosition(driver);
              const quadrant = getQuadrant(driver);
              const info = quadrantInfo[quadrant as keyof typeof quadrantInfo];

              return (
                <div
                  key={driver.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${info.bgColor} ${info.borderColor} border-2 cursor-pointer transition-transform hover:scale-150`}
                  />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-popover text-popover-foreground text-xs px-3 py-2 rounded-lg shadow-lg border border-border whitespace-nowrap">
                      <div className="font-semibold">{driver.name}</div>
                      <div className="text-muted-foreground">
                        Score: {driver.value.toFixed(1)} | Impact: {Math.round(driver.weight * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
