"use client";

import { Companies } from "@/components/company";
import AllCompaniesAside from "@/components/company/AllCompaniesAside";

export default function Home() {
  return (
    <main className="flex min-h-full overflow-y-auto overflow-x-hidden">
      <AllCompaniesAside />
      <div className="w-[calc(100%-55px)] ml-4">
        <div className="w-full grid grid-cols-2 justify-between gap-14 ">
          <Companies />
        </div>
      </div>
    </main>
  );
}
