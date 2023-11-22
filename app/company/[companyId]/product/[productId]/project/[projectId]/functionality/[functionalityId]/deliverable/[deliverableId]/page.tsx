"use client";

import DeliverableDetailed from "@/components/deliverable/DeliverableDetailed";
import DeliverableOptions from "@/components/deliverable/DeliverableOptions";
import DeliverableTimeline from "@/components/deliverable/DeliverableTimeline";
import {
  UpsertDeliverableTypeSchema,
  UpsertDeliverableTypeSchemaType,
} from "@/schema/deliverable";
import { trpc } from "@/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

export default function DeliverablePage() {
  const { deliverableId, functionalityId } = useParams();
  const { data, isLoading, error } = trpc.deliverables.byId.useQuery(
    {
      deliverableId: deliverableId as string,
      functionalityId: functionalityId as string,
    },
    {
      enabled: !(
        typeof deliverableId !== "string" || typeof functionalityId !== "string"
      ),
    }
  );

  const methods = useForm<UpsertDeliverableTypeSchemaType>({
    resolver: zodResolver(UpsertDeliverableTypeSchema),
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong.</div>;
  }

  return (
    <FormProvider {...methods}>
      <div className="w-[calc(100%-700px)] mx-2">
        <DeliverableOptions />
        <DeliverableTimeline />
      </div>
      <DeliverableDetailed />
    </FormProvider>
  );
}
