"use client";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import { TabsDeliveries } from "@/components/tabsDeliveries";
import { AppTemplate } from "@/components/templates/Template";

export default function ProductPage() {
  const { selectedFeature } = useContext(GlobalContext);

  return (
    <AppTemplate>
      <div className="w-full grid grid-cols-[80%,20%] grid-rows-none gap-4 p-4 justify-between">
        {selectedFeature ? (
          <div className="w-full h-full">
            {/* {teste.map(({ nome, icon: Icon }) => (
              <div>
                <Icon />
                <span>{nome}</span>
              </div>
            ))} */}
            <div className="w-full flex items-center justify-center border-default dark:border-defaultdark dark:bg-darkForeground bg-foreground rounded-md p-2">
              Selecione algum projeto
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center border-default dark:border-defaultdark dark:bg-darkForeground bg-foreground rounded-md p-2">
            Selecione alguma funcionalidade
          </div>
        )}
        <div className="w-full border border-default dark:border-defaultdark dark:bg-darkForeground bg-foreground rounded-sm p-2">
          <TabsDeliveries />
        </div>
      </div>
    </AppTemplate>
  );
}
