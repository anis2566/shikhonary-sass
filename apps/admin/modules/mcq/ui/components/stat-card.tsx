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
        "bg-card/80 backdrop-blur-2xl rounded-[2rem] border border-border/60 p-6 lg:p-8 transition-all duration-300",
        "hover:shadow-large hover:border-primary/30 group relative overflow-hidden",
        className,
      )}
    >
      <div className="absolute -right-4 -bottom-4 size-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
      <div className="flex items-start justify-between">
        <div className="space-y-1 relative z-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">
            {title}
          </p>
          <p className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
        <div className="p-4 bg-primary/10 rounded-[1.25rem] text-primary shadow-glow/5 group-hover:scale-110 transition-transform duration-500 relative z-10">
          <Icon className="h-7 w-7" />
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
