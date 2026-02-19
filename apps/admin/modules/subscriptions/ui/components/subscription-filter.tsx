import { Search } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

interface SubscriptionFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  tierFilter: string;
  setTierFilter: (tier: string) => void;
  tierOrder: string[];
}

export const SubscriptionFilter = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  tierFilter,
  setTierFilter,
  tierOrder,
}: SubscriptionFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by tenant or tier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all"
        />
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px] bg-card/50 backdrop-blur-sm border-border/50">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="trial">Trial</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="past_due">Past Due</SelectItem>
          <SelectItem value="canceled">Canceled</SelectItem>
          <SelectItem value="expired">Expired</SelectItem>
        </SelectContent>
      </Select>
      <Select value={tierFilter} onValueChange={setTierFilter}>
        <SelectTrigger className="w-[160px] bg-card/50 backdrop-blur-sm border-border/50">
          <SelectValue placeholder="Filter by tier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tiers</SelectItem>
          {tierOrder.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
