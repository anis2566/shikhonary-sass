"use client";

import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

export const Toolbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tenants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filter</span>
        </Button>
        <Button size="sm" className="gap-2" asChild>
          <Link href="/tenants/new">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Tenant</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
