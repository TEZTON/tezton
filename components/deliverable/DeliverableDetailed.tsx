import UpsertDeliverablePhase from "./UpsertDeliverablePhase";
import * as Tabs from "@radix-ui/react-tabs";
import { DeliverablePhaseSchemaType } from "@/schema/deliverable";
import { DeliverableDiagramNodeBoundrySchemaType } from "@/schema/diagrams";
import { TrashIcon } from "lucide-react";
import { ContextMenu } from "@/components/dropdownMenu";
import React from "react";
import { trpc } from "@/trpc";

interface UpsertDeliverablePhaseProps {
  selectedPhase: DeliverablePhaseSchemaType | null;
  selected: DeliverableDiagramNodeBoundrySchemaType | null;
  deliverableId: string;
}


export default function DeliverableDetailed({
  selectedPhase,
  selected,
  deliverableId,
}: UpsertDeliverablePhaseProps) {
  const deletedBoundry = trpc.deliverableDiagrams.deleteBoundry.useMutation();
  const deleted = trpc.deliverableDiagrams.deleteDiagram.useMutation();
  const fetchNode = trpc.deliverableDiagrams.getNodes.useQuery({
    deliverableId: deliverableId as string,
  });
  const fetchBoundry = trpc.deliverableDiagrams.getBoundries.useQuery({
    deliverableId: deliverableId as string,
  });
  const deletedFunc = async () => {
    if (selected?.type === "BOUNDRY") {
      await deletedBoundry.mutateAsync({
        nodeId: selected.id,
      });
    } else {
      await deleted.mutateAsync({
        nodeId: selected?.id as string,
      });
    }
    fetchBoundry.refetch();
    fetchNode.refetch();
  };
  const deliverablesContexts = [
    {
      id: 1,
      label: "Excluir",
      icon: TrashIcon,
      action: () => {
        deletedFunc()
      }
    }
  ];
  return (
    <Tabs.Root
      className="flex flex-col w-[350px] py-2 px-4 border-l"
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
          className="flex-1 flex ml-2 items-center justify-center data-[state=active]:border-b"
          value="tab3"
        >
          Comentarios
        </Tabs.Trigger>
        {selected && (
          <div className="ml-6 mt-2">
            <ContextMenu
              itemId={selected?.id || selected?.id || ""}
              items={deliverablesContexts}
            />
          </div>
        )}
      </Tabs.List>
      <Tabs.Content className="my-4" value="tab1">
        <UpsertDeliverablePhase
          selectedPhase={selectedPhase}
          selected={selected}
        />
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
