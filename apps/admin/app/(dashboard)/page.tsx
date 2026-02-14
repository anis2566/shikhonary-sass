import * as React from "react";
import {
  Users,
  Building2,
  GraduationCap,
  Verified,
  TrendingUp,
  Plus,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@workspace/ui/components/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { Progress } from "@workspace/ui/components/progress";
import { cn } from "@workspace/ui/lib/utils";

const stats = [
  {
    title: "Total Users",
    value: "12,450",
    change: "12%",
    icon: Users,
    glow: "card-glow-blue",
    iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    title: "Active Tenants",
    value: "248",
    change: "+8",
    icon: Building2,
    glow: "card-glow-teal",
    iconBg: "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400",
  },
  {
    title: "Students Enrolled",
    value: "45,230",
    change: "2.3k",
    icon: GraduationCap,
    glow: "card-glow-purple",
    iconBg:
      "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  },
  {
    title: "Active Sessions",
    value: "1,847",
    change: "Live",
    icon: Verified,
    glow: "card-glow-amber",
    iconBg:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  },
];

const recentTenants = [
  {
    name: "ABC High School",
    domain: "abc-high.shikhonary.com",
    initials: "AH",
    type: "School",
    students: "1,250",
    progress: 62,
    status: "Active",
  },
  {
    name: "XYZ Coaching Center",
    domain: "xyz-coaching.shikhonary.com",
    initials: "XC",
    type: "Coaching",
    students: "320",
    progress: 64,
    status: "Active",
  },
  {
    name: "John's Math Academy",
    domain: "johns-math.shikhonary.com",
    initials: "JM",
    type: "Individual",
    students: "45",
    progress: 90,
    status: "Active",
  },
  {
    name: "Greenfield School",
    domain: "greenfield.shikhonary.com",
    initials: "GS",
    type: "School",
    students: "890",
    progress: 89,
    status: "Pending",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`${stat.glow} border-white/60 dark:border-white/10 shadow-soft-card group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-3xl p-7`}
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                  stat.iconBg,
                )}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50/80 dark:bg-emerald-900/20 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/30 px-2.5 py-1 rounded-full">
                {stat.change === "Live" ? (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                ) : (
                  <TrendingUp className="w-3.5 h-3.5" />
                )}
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-foreground tracking-tight">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                {stat.title}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Tenants Table */}
        <Card className="xl:col-span-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl shadow-glass border-white/60 dark:border-white/10 overflow-hidden flex flex-col">
          <CardHeader className="p-8 border-b border-border/50 bg-white/40 dark:bg-black/20 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-bold text-xl text-foreground">
                Recent Tenants
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Latest organizations onboarded
              </p>
            </div>
            <a
              href="#"
              className="text-sm font-bold text-shikhonary-teal hover:text-shikhonary-teal-dark hover:bg-shikhonary-teal/5 px-4 py-2 rounded-lg transition-colors"
            >
              View all tenants
            </a>
          </CardHeader>
          <CardContent className="p-2">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/50 hover:bg-transparent">
                  <TableHead className="px-8 py-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Tenant Identity
                  </TableHead>
                  <TableHead className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Type
                  </TableHead>
                  <TableHead className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Capacity
                  </TableHead>
                  <TableHead className="px-8 py-5 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTenants.map((tenant) => (
                  <TableRow
                    key={tenant.name}
                    className="hover:bg-shikhonary-teal/5 transition-colors group"
                  >
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-shikhonary-teal/5 to-shikhonary-cyan/5 text-shikhonary-teal border border-shikhonary-teal/10 flex items-center justify-center font-extrabold text-sm shadow-sm">
                          {tenant.initials}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm group-hover:text-shikhonary-teal transition-colors">
                            {tenant.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">
                            {tenant.domain}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-6">
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100/60 dark:border-blue-900/30 uppercase tracking-wide text-[10px] font-bold"
                      >
                        {tenant.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-6">
                      <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5">
                        <span>{tenant.students} Students</span>
                        <span className="text-muted-foreground">
                          {tenant.progress}%
                        </span>
                      </div>
                      <Progress
                        value={tenant.progress}
                        className="h-2 bg-slate-100 dark:bg-slate-800"
                      />
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
                          tenant.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30"
                            : "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-800",
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            tenant.status === "Active"
                              ? "bg-emerald-500"
                              : "bg-slate-400",
                          )}
                        ></span>
                        {tenant.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Stats Sidebar */}
        <Card className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-md rounded-3xl border border-white/50 dark:border-white/10 flex flex-col h-full overflow-hidden">
          <CardHeader className="p-8 border-b border-border/50 bg-white/40 dark:bg-black/20">
            <CardTitle className="font-bold text-xl text-foreground">
              Quick Stats
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Platform performance overview
            </p>
          </CardHeader>
          <CardContent className="p-8 flex flex-col justify-center gap-6 h-full">
            {[
              {
                label: "Monthly Revenue",
                value: "৳ 2,45,000",
                icon: Plus,
                iconBg: "bg-emerald-100/50 text-emerald-600",
              },
              {
                label: "New Signups",
                value: "124",
                icon: Plus,
                iconBg: "bg-blue-100/50 text-blue-600",
              },
              {
                label: "Exams Conducted",
                value: "1,245",
                icon: Plus,
                iconBg: "bg-purple-100/50 text-purple-600",
              },
              {
                label: "Avg. Session",
                value: "42 min",
                icon: Plus,
                iconBg: "bg-amber-100/50 text-amber-600",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="glass-stat-item rounded-2xl p-4 flex items-center justify-between shadow-sm bg-white/60 dark:bg-black/20 border border-white/40 dark:border-white/5 hover:bg-white dark:hover:bg-black/40 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      stat.iconBg,
                    )}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                <span className="text-lg font-extrabold text-foreground">
                  {stat.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
