import UpserProjectExpanded from "../forms/UpsertProjectExpanded";
import * as Tabs from "@radix-ui/react-tabs";

export default function ProjectExpanded() {
  return (
    <Tabs.Root
      className="flex flex-col w-[300px] py-2 px-4 border-l ml-auto"
      defaultValue="tab1"
    >
      <Tabs.List
        className="shrink-0 flex justify-between"
        aria-label="Manage your account"
      >
        <Tabs.Trigger
          className="flex-1 flex items-center justify-center data-[state=active]:border-b"
          value="tab1"
        >
          Info
        </Tabs.Trigger>
        <Tabs.Trigger
          className="flex-1 flex items-center justify-center data-[state=active]:border-b"
          value="tab2"
        >
          Reporte
        </Tabs.Trigger>
        <Tabs.Trigger
          className="flex-1 flex items-center justify-center data-[state=active]:border-b"
          value="tab3"
        >
          Comentarios
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="my-4" value="tab1">
        <UpserProjectExpanded />
      </Tabs.Content>
      <Tabs.Content className="my-4" value="tab2">
        Reporte
      </Tabs.Content>
      <Tabs.Content className="my-4" value="tab3">
        Comentarios
      </Tabs.Content>
    </Tabs.Root>
  );
}
