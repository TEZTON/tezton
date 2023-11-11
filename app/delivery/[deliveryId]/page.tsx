"use client";
import { Board } from "@/components/reactFlow";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import Image from "next/image";
import { AppTemplate } from "@/components/templates/Template";
import { TabsDeliveries } from "@/components/tabsDeliveries";
import { Calendar } from "@/components/calendar";
import { useParams } from "next/navigation";

export default function DeliveryScreen() {
  const { selectedFeature } = useContext(GlobalContext);

  const { company_id, delivery_id } = useParams();

  console.log(delivery_id, company_id);

  //  const findSpecificCompany = MOCK_USER.companies.find(company => company.company_id === company_id)
  //  const findSpecificDelivery = findSpecificCompany?.company_products.flatMap(product => product.)

  return (
    <AppTemplate>
      <div className="w-full grid grid-rows-[1fr,2fr] gap-4">
        {selectedFeature && <Calendar />}
        <div className="w-full h-full grid grid-cols-[max-content,2fr,max-content] gap-2 grid-rows-1">
          <div className="w-[200px] border border-default dark:border-defaultdark h-full rounded-md p-3 flex flex-col items-center justify-start gap-5">
            <span className="w-full text-sm border-b border-default dark:border-defaultdark pb-3">
              Evidencias
            </span>
            <Image
              src="/1220358680-giphy.webp"
              className="rounded-xl overflow-hidden"
              alt="Image"
              width={200}
              height={200}
            />
          </div>
          <div className="w-full border border-default dark:border-defaultdark rounded-md p-1">
            <Board />
          </div>
          <div className="w-[200px] border border-default dark:border-defaultdark rounded-md p-1">
            <TabsDeliveries />
          </div>
        </div>
      </div>
    </AppTemplate>
  );
}
