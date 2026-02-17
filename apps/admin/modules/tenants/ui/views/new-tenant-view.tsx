"use client";

import { ChevronLeft, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { TenantForm } from "../form/tenant-form";

export const NewTenantView = () => {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-8 animate-in fade-in duration-500 text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="w-fit -ml-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="flex items-center gap-4">
          <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-soft">
            <Building2 className="size-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Create Tenant
            </h1>
            <p className="text-muted-foreground font-medium">
              Start by defining a new institution, school or coaching center
            </p>
          </div>
        </div>
      </div>

      <TenantForm />
    </div>
  );
};
