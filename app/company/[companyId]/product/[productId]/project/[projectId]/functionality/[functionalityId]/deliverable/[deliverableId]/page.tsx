"use client";
import DeliverableDetailed from "@/components/deliverable/DeliverableDetailed";
import DeliverableOptions from "@/components/deliverable/DeliverableOptions";
import DeliverableTimeline from "@/components/deliverable/DeliverableTimeline";
import DeliverableDiagram from "@/components/deliverable/DeliverableDiagram";
import {
  UpsertDeliverablePhaseSchema,
  UpsertDeliverablePhaseSchemaType,
  DeliverablePhaseSchemaType
} from "@/schema/deliverable";
import { trpc } from "@/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { DeliverableDiagramNodeBoundrySchemaType } from "@/schema/diagrams";

export default function DeliverablePage() {
  const { deliverableId, functionalityId } = useParams();
  const { data, isLoading, error } = trpc.deliverables.byId.useQuery(
    {
      deliverableId: deliverableId as string,
      functionalityId: functionalityId as string
    },
    {
      enabled:
        typeof deliverableId === "string" && typeof functionalityId === "string"
    }
  );
  const { data: deliverableTypesData } =
    trpc.deliverableTypes.getTypes.useQuery();

  const { data: phasesData } = trpc.deliverablePhases.getPhases.useQuery({
    deliverableId: deliverableId as string
  });

  const methods = useForm<UpsertDeliverablePhaseSchemaType>({
    defaultValues: {
      deliverableId: deliverableId as string
    },
    resolver: zodResolver(UpsertDeliverablePhaseSchema)
  });
  const [selectedOptions, setSelectedOptions] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selected, setSelected] = 
    useState<DeliverableDiagramNodeBoundrySchemaType | null>(null);
  const [selectedPhase, setSelectedPhase] =
    useState<DeliverablePhaseSchemaType | null>(null);
    const handlePhaseClick = (phase: DeliverablePhaseSchemaType) => {
      setSelectedPhase(phase);

      const selectedOption = deliverableTypesData?.find(
        (option) => option.id === phase.type
      );
      setSelectedOptions(selectedOption || null);
    };

    const handleClick = (item: DeliverableDiagramNodeBoundrySchemaType) => {
      setSelected(item);
    };
  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong.</div>;
  }

  return (
    <FormProvider {...methods}>
      <div className="w-[calc(100%-700px)] mx-2">
        <DeliverableOptions 
          data={deliverableTypesData || []} 
          selectedOption={selectedOptions}
        />
        <DeliverableTimeline
          groups={deliverableTypesData || []}
          phases={phasesData || []}
          onPhaseClick={handlePhaseClick}
        />
        <DeliverableDiagram 
          deliverableId={deliverableId as string} 
          onClick={handleClick}
        />
      </div>
      <DeliverableDetailed
        selectedPhase={selectedPhase as DeliverablePhaseSchemaType}
        selected={selected as DeliverableDiagramNodeBoundrySchemaType}
        deliverableId={deliverableId as string} 
      />
    </FormProvider>
  );
}
