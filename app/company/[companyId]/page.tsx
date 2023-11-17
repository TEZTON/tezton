"use client";

import { TabsDeliveries } from "@/components/tabsDeliveries";

export default function CompanyByIdPage() {
  return (
    <div className="w-full grid grid-cols-[80%,20%] grid-rows-none gap-4 p-4 justify-between">
      <div className="w-full border border-default dark:border-defaultdark bg-foreground dark:bg-darkForeground rounded-sm p-2">
        <TabsDeliveries />
      </div>
    </div>
  );
}
