"use client";
import { UpsertDeliverablePhaseSchemaType } from "@/schema/deliverable";
import { useFormContext } from "react-hook-form";

interface DeliverableOptionsProps {
  data: {
    id: string;
    name: string;
  }[];
}

export default function DeliverableOptions({ data }: DeliverableOptionsProps) {
  const { watch, setValue } =
    useFormContext<UpsertDeliverablePhaseSchemaType>();
  const type = watch("deliverableTypeId");

  return (
    <div className="flex gap-2 my-4">
      {data.map(({ id, name }) => (
        <button
          className={`btn btn-active text-white btn-sm text-xs ${
            type === id && "btn-primary"
          }`}
          key={id}
          onClick={() => {
            setValue("deliverableTypeId", id);
          }}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
