"use client";

import { Companies } from "@/components/companies";
import { Calendar } from "@/components/calendar";
import MainPageSidebar from "@/components/sidebar/MainPage";

export default function Home() {
  return (
    <main className="flex min-h-full overflow-y-auto overflow-x-hidden">
      <MainPageSidebar />
      <div className="w-[calc(100%-55px)] ml-4">
        <div className="flex ">
          <Calendar />
        </div>
        <div className="w-full grid grid-cols-2 justify-between gap-14 ">
          <Companies />
        </div>
      </div>
    </main>
  );
}
