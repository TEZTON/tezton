import { format, formatISO, startOfToday } from "date-fns";
import { useFormContext } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import CalendarPopover from "../calendar/CalendarPopover";
import { trpc } from "@/trpc";
import { useState, useEffect } from "react";
import { UpsertDeliverablePhaseSchemaType, DeliverablePhaseSchemaType } from "@/schema/deliverable";

interface UpsertDeliverablePhaseProps {
  selectedPhase: DeliverablePhaseSchemaType | null;
}

export default function UpsertDeliverablePhase({
  selectedPhase
}: UpsertDeliverablePhaseProps) {
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
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    if (selectedPhase) {
      setEditMode(true);
      setValue("name", selectedPhase.name);
      setValue("startDate", selectedPhase.startDate);
      setValue("endDate", selectedPhase.endDate);
      setValue("deliverableTypeId", selectedPhase.type);
    }
  }, [selectedPhase, setValue]);

  const createPhase =
    trpc.deliverablePhases.createDeliverablePhase.useMutation();
  const updatePhase =
    trpc.deliverablePhases.updateDeliverablePhase.useMutation();
  const { deliverablePhases } = trpc.useUtils();
  const submitForm = async (data: UpsertDeliverablePhaseSchemaType) => {
    if (editMode) {
      await updatePhase.mutateAsync({
        ...data,
        id: selectedPhase?.id as string,
        deliverableTypeId: selectedPhase?.type as string
      });
    } else {
      await createPhase.mutateAsync(data);
    }
    await deliverablePhases.getPhases.invalidate({
      deliverableId: data.deliverableId
    });

    reset();
    setEditMode(false);
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

  const startDate =
    watch("startDate") || (selectedPhase && selectedPhase.startDate);
  const endDate = watch("endDate") || (selectedPhase && selectedPhase.endDate);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitForm)}>
      <p className="text-xs text-error">{getError()}</p>
      <input
        className="input input-sm input-bordered input-primary"
        placeholder="Titulo"
        defaultValue={selectedPhase?.name || ""}
        {...register("name")}
        readOnly={editMode}
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
        <p>Descrição</p>
        <div className="divider m-0" />
      </div>
      <textarea
        className="textarea textarea-sm textarea-bordered textarea-primary"
        placeholder="Descricao"
        rows={4}
      />
      <button className="btn btn-primary text-white" type="submit">
        {editMode ? "Atualizar" : "Salvar"}
      </button>
    </form>
  );
}
