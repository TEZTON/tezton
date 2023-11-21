"use client";
import { Calendar } from "@/components/calendar";
import { TabsDeliveries } from "@/components/tabsDeliveries";
import { AppTemplate } from "@/components/templates/Template";
import { GlobalContext } from "@/contexts/GlobalContext";
import { useParams } from "next/navigation";
import { useContext } from "react";

export default function CompanyByIdPage() {
  const { companyId } = useParams();
  const { selectedFeature } = useContext(GlobalContext);

  return (
    <AppTemplate>
      <div className="w-full grid grid-cols-[80%,20%] grid-rows-none gap-4 p-4 justify-between">
        {selectedFeature ? (
          <div className="w-full h-full">
            <Calendar />
          </div>
        ) : (
          <div className="w-full flex items-center justify-center border-default dark:border-defaultdark bg-foreground dark:bg-darkForeground rounded-md p-2">
            Selecione Algum Projeto / Funcionalidade
          </div>
        )}
        <div className="w-full border border-default dark:border-defaultdark bg-foreground dark:bg-darkForeground rounded-sm p-2">
          <TabsDeliveries />
        </div>
      </div>
    </AppTemplate>
  );
}
