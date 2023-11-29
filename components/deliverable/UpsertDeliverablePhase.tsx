import { UpsertDeliverablePhaseSchemaType } from "@/schema/deliverable";
import { format, formatISO, startOfToday } from "date-fns";
import { useFormContext } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import CalendarPopover from "../calendar/CalendarPopover";
import { useState } from "react";
import { trpc } from "@/trpc";
import { useParams } from "next/navigation";

export default function UpsertDeliverablePhase() {
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useFormContext<UpsertDeliverablePhaseSchemaType>();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const createPhase = trpc.deliverablePhases.createDeliverablePhase.useMutation();

  const { deliverablePhases } = trpc.useUtils();

  const submitForm = async (data: UpsertDeliverablePhaseSchemaType) => {
    await createPhase.mutateAsync(data);
    await deliverablePhases.getPhases.invalidate({
      deliverableId: data.deliverableId,
    });
    reset();
  };

  const getError = () => {
    return (
      errors.name?.message ||
      errors.endDate?.message ||
      errors.startDate?.message ||
      errors.root?.message ||
      errors.deliverableTypeId?.message
    );
  };

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const { deliverableId, functionalityId } = useParams();
  const { data } = trpc.deliverables.byId.useQuery(
    {
      deliverableId: deliverableId as string,
      functionalityId: functionalityId as string,
    },
    {
      enabled:
        typeof deliverableId === "string" &&
        typeof functionalityId === "string",
    }
  );

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitForm)}>
      <p className="text-xs text-error">{getError()}</p>
      <input
        className="input input-sm input-bordered input-primary"
        placeholder="Titulo"
        defaultValue={data?.name}
        {...register("name")}
      />
      <CalendarPopover
        open={startDateOpen}
        onOpenChange={setStartDateOpen}
        value={startDate && formatISO(startDate)}
        minDate={startOfToday()}
        onChange={(date) => {
          if (date && !Array.isArray(date)) {
            setValue("startDate", date);
          }

          setStartDateOpen(false);
        }}
        trigger={
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} />

            <input
              className="input input-sm input-bordered input-primary w-full"
              placeholder="Data de Inicio"
              defaultValue={startDate && format(startDate, "PP")}
            />
          </div>
        }
      />
      <CalendarPopover
        open={endDateOpen}
        onOpenChange={setEndDateOpen}
        value={endDate && formatISO(endDate)}
        minDate={startDate}
        onChange={(date) => {
          if (date && !Array.isArray(date)) {
            setValue("endDate", date);
          }

          setEndDateOpen(false);
        }}
        trigger={
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} />

            <input
              className="input input-sm input-bordered input-primary w-full"
              placeholder="Data de Fim"
              defaultValue={endDate && format(endDate, "PP")}
            />
          </div>
        }
      />
      <input
        type="file"
        className="file-input file-input-xs  file-input-bordered text-xs file-input-primary"
        placeholder="Documentação anexada"
      />

      <div>
        <p>Descricao</p>
        <div className="divider m-0" />
      </div>
      <textarea
        className="textarea textarea-sm textarea-bordered textarea-primary"
        defaultValue={data?.description || ""}
        placeholder="Descricao"
        rows={4}
      />
      <button className="btn btn-primary text-white" type="submit">
        Salvar
      </button>
    </form>
  );
}
