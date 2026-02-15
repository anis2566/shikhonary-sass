import { LucideIcon, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

interface ClassDetailsStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  color?: "primary" | "green" | "yellow" | "purple" | "blue" | "orange";
}

export const ClassDetailsStatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  color = "primary",
}: ClassDetailsStatCardProps) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    green:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    yellow:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    orange:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  };

  return (
    <Card className={cn("transition-all duration-200")}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-xl", colorClasses[color])}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
