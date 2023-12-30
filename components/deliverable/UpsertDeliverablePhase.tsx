import { format, formatISO, startOfToday } from "date-fns";
import { useFormContext } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import CalendarPopover from "../calendar/CalendarPopover";
import { trpc } from "@/trpc";
import { useState, useEffect } from "react";
import {
  UpsertDeliverablePhaseSchemaType,
  DeliverablePhaseSchemaType
} from "@/schema/deliverable";

import { useParams } from "next/navigation";
import { DeliverableDiagramNodeBoundrySchemaType } from "@/schema/diagrams";

interface UpsertDeliverablePhaseProps {
  selectedPhase: DeliverablePhaseSchemaType | null;
  selected: DeliverableDiagramNodeBoundrySchemaType | null;
}

export default function UpsertDeliverablePhase({
  selectedPhase,
  selected
}: UpsertDeliverablePhaseProps) {
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset
  } = useFormContext<UpsertDeliverablePhaseSchemaType>();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { deliverableId, functionalityId } = useParams();
  const { deliverablePhases } = trpc.useUtils();

  useEffect(() => {
    if (selectedPhase) {
      setEditMode(true);
      setValue("name", selectedPhase.name);
      setValue("startDate", selectedPhase.startDate);
      setValue("endDate", selectedPhase.endDate);
      setValue("deliverableTypeId", selectedPhase.type);
    }

    if (selected) {
      setEditMode(true);
      setValue("name", selected.data?.label);
      setValue("description", selected.data?.description);
    }
  }, [selectedPhase, setValue, selected]);

  const createPhase =
    trpc.deliverablePhases.createDeliverablePhase.useMutation();
  const updatePhase =
    trpc.deliverablePhases.updateDeliverablePhase.useMutation();
  const updateDiagram = trpc.deliverableDiagrams.updateDiagram.useMutation();
  const updateBoundry = trpc.deliverableDiagrams.updateBoundry.useMutation();
  const fetchNode = trpc.deliverableDiagrams.getNodes.useQuery({
    deliverableId: deliverableId as string
  });
  const fetchBoundry = trpc.deliverableDiagrams.getBoundries.useQuery({
    deliverableId: deliverableId as string
  });

  const submitDiagram = async (nameEdit: string, descriptionEdit: string) => {
    await updateDiagram.mutateAsync({
      name: nameEdit,
      nodeId: selected?.id as string,
      description: descriptionEdit
    });
    fetchNode.refetch();
  };

  const submitBoundry = async (nameEdit: string, descriptionEdit: string) => {
    await updateBoundry.mutateAsync({
      name: nameEdit,
      nodeId: selected?.id as string,
      description: descriptionEdit
    });
    fetchBoundry.refetch();
  };

  const submitPhase = async (data: UpsertDeliverablePhaseSchemaType) => {
    await updatePhase.mutateAsync({
      ...data,
      id: selectedPhase?.id as string,
      deliverableTypeId: selectedPhase?.type as string
    });
  };

  const submitForm = async (data: UpsertDeliverablePhaseSchemaType) => {
    const nameEdit =
      watch("name") || selectedPhase?.name || selected?.data?.label;
    const descriptionEdit = watch("description") || selected?.data?.description;

    if (selected && editMode) {
      await submitDiagram(nameEdit!, descriptionEdit!);
    } else if (selectedPhase && editMode) {
      await submitPhase(data);
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
    if (selected) {
      return errors.name?.message;
    }

    if (selectedPhase) {
      return (
        errors.name?.message ||
        errors.endDate?.message ||
        errors.startDate?.message ||
        errors.root?.message ||
        errors.deliverableTypeId?.message
      );
    }

    return "";
  };

  const startDate =
    watch("startDate") || (selectedPhase && selectedPhase.startDate);
  const endDate = watch("endDate") || (selectedPhase && selectedPhase.endDate);
  const descriptionEdit = watch("description") || selected?.data?.description;

  const { data } = trpc.deliverables.byId.useQuery(
    {
      deliverableId: deliverableId as string,
      functionalityId: functionalityId as string
    },
    {
      enabled:
        typeof deliverableId === "string" && typeof functionalityId === "string"
    }
  );

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitForm)}>
      <p className="text-xs text-error">{getError()}</p>
      <input
        className="input input-sm input-bordered input-primary"
        placeholder="Titulo"
        defaultValue={selectedPhase?.name || selected?.data?.label}
        {...register("name")}
      />
      {selected === null ? (
        <>
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
        </>
      ) : (
        <></>
      )}
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
        {...register("description")}
        className="textarea textarea-sm textarea-bordered textarea-primary"
        defaultValue={data?.description || descriptionEdit!}
        placeholder="Descricao"
        rows={4}
      />
      {selectedPhase && (
        <button className="btn btn-primary text-white" type="submit">
          {editMode ? "Atualizar" : "Salvar"}
        </button>
      )}
      {selected?.type === "BOUNDRY" ? (
        <button
          className="btn btn-primary text-white"
          type="button"
          onClick={() => {
            const nameEdit = watch("name") || selected?.data?.label;
            const descriptionEdit =
              watch("description") || selected?.data?.description;
            submitBoundry(nameEdit!, descriptionEdit!);
          }}
        >
          Atualizar
        </button>
      ) : (
        <button
          className="btn btn-primary text-white"
          type="button"
          onClick={() => {
            const nameEdit = watch("name") || selected?.data?.label;
            const descriptionEdit = watch("description") || selected?.data?.description;
            submitDiagram(nameEdit!, descriptionEdit!);
          }}
        >
          Atualizar
        </button>
      )}
    </form>
  );
}
