import { LucideIcon, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

interface ChapterDetailsStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  color?: "primary" | "green" | "yellow" | "purple" | "blue" | "orange";
}

export const ChapterDetailsStatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  color = "primary",
}: ChapterDetailsStatCardProps) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    green: "bg-green-500/10 text-green-600 border-green-500/20",
    yellow: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    purple: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    orange: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  };

  return (
    <Card className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-glow hover:border-primary/20 group">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "p-2.5 rounded-xl border shadow-soft transition-transform group-hover:scale-110 duration-300",
                colorClasses[color],
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                {value}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 whitespace-nowrap mt-0.5">
                {label}
              </p>
            </div>
          </div>
          {trend && (
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full shadow-soft animate-pulse">
              <TrendingUp className="h-3 w-3 stroke-[3]" />
              {trend}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
