
import * as Tabs from "@radix-ui/react-tabs";
import { MessageSquareIcon, PinIcon } from "lucide-react";
import { InfoContent } from "./contents/infos";
import { ReportsContent } from "./contents/reports";

export const TabsDeliveries = () => {
  const MockTriggers = [
    { id: 1, label: "Info", icon: PinIcon, content: <InfoContent /> },
    { id: 2, label: "Report", icon: PinIcon, content: <ReportsContent /> },
    { id: 3, label: "Comentários", icon: MessageSquareIcon, content: "c" },
  ];

  return (
    <Tabs.Root
      className="w-full flex flex-col"
      defaultValue={MockTriggers[0]?.id.toString()}
    >
      <Tabs.List className="w-full flex flex-col">
        <div className="w-full flex gap-1">
          {MockTriggers.map((tabs) => (
            <Tabs.Trigger
              key={tabs.id}
              className={`text-xs justify-between border border-default dark:border-defaultdark rounded w-full p-1 data-[state=active]:bg-primary`}
              value={tabs.id.toString()}
            >
              {tabs.label}
            </Tabs.Trigger>
          ))}
        </div>
        {MockTriggers.map((tabs) => (
          <Tabs.Content
            key={tabs.id}
            className="w-full p-2"
            value={tabs.id.toString()}
          >
            {tabs.content}
          </Tabs.Content>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
};
