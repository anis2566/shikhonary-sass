"use client";

import { CircleHelp, CheckCircle, XCircle, Layers } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useMCQStats } from "@workspace/api-client";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  className?: string;
}

function StatsCard({ title, value, icon: Icon, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-card/50 backdrop-blur-md rounded-2xl border border-border/50 p-5 lg:p-6 transition-all duration-300",
        "hover:shadow-glow hover:border-primary/20",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            {title}
          </p>
          <p className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">
            {value}
          </p>
        </div>
        <div className="p-3 bg-primary/10 rounded-xl text-primary shadow-soft">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export const McqListStat = () => {
  const { data } = useMCQStats();

  const total = data?.total ?? 0;
  const types: { type: string; _count: number }[] = data?.types ?? [];
  const singleCount = types.find((t) => t.type === "SINGLE")?._count ?? 0;
  const multipleCount = types.find((t) => t.type === "MULTIPLE")?._count ?? 0;
  const contextualCount =
    types.find((t) => t.type === "CONTEXTUAL")?._count ?? 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard title="Total MCQs" value={total} icon={CircleHelp} />
      <StatsCard
        title="Single Choice"
        value={singleCount}
        icon={CheckCircle}
        className="[&_.text-primary]:text-blue-500 [&_.bg-primary\/10]:bg-blue-500/10"
      />
      <StatsCard
        title="Multiple Choice"
        value={multipleCount}
        icon={Layers}
        className="[&_.text-primary]:text-purple-500 [&_.bg-primary\/10]:bg-purple-500/10"
      />
      <StatsCard
        title="Contextual"
        value={contextualCount}
        icon={XCircle}
        className="[&_.text-primary]:text-teal-500 [&_.bg-primary\/10]:bg-teal-500/10"
      />
    </div>
  );
};
