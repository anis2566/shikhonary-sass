interface StatCardsProps {
  totalTenants: number;
  activeTenants: number;
  onTrialTenants: number;
  enterpriseTenants: number;
}

export const StatCards = ({
  totalTenants,
  activeTenants,
  onTrialTenants,
  enterpriseTenants,
}: StatCardsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Total Tenants
        </p>
        <p className="text-xl sm:text-2xl font-bold">{totalTenants}</p>
      </div>
      <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
        <p className="text-xl sm:text-2xl font-bold text-green-600">
          {activeTenants}
        </p>
      </div>
      <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-muted-foreground">On Trial</p>
        <p className="text-xl sm:text-2xl font-bold text-amber-600">
          {onTrialTenants}
        </p>
      </div>
      <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-muted-foreground">Enterprise</p>
        <p className="text-xl sm:text-2xl font-bold text-purple-600">
          {enterpriseTenants}
        </p>
      </div>
    </div>
  );
};
