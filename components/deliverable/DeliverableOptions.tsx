import {
  DeliverableTypeEnum,
  UpsertDeliverableTypeSchemaType,
} from "@/schema/deliverable";
import { useFormContext } from "react-hook-form";

export default function DeliverableOptions() {
  const { watch, setValue } = useFormContext<UpsertDeliverableTypeSchemaType>();
  const type = watch("type");

  return (
    <div className="flex gap-2 my-4">
      {Object.keys(DeliverableTypeEnum.Values).map((v) => (
        <button
          className={`btn btn-active text-white btn-sm text-xs ${
            type === v && "btn-primary"
          }`}
          key={v}
          onClick={() => {
            setValue("type", v as keyof typeof DeliverableTypeEnum.Values);
          }}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
