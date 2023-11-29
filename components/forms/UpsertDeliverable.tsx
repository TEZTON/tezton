import {
  UpsertDeliverableSchema,
  UpsertDeliverableSchemaType,
} from "@/schema/deliverable";
import { trpc } from "@/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { Loader } from "lucide-react";

interface UpsertDeliverableProps {
  functionalityId: string;
  deliverable?: any;
  onSuccess: () => void;
}

export default function UpsertDeliverable({
  functionalityId,
  deliverable,
  onSuccess,
}: UpsertDeliverableProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpsertDeliverableSchemaType>({
    defaultValues: {
      name: deliverable?.name || "",
      functionalityId: functionalityId,
      description: deliverable?.description || "",
    },
    resolver: zodResolver(UpsertDeliverableSchema),
  });
  const { deliverables } = trpc.useUtils();
  const create = trpc.deliverables.createDeliverable.useMutation();
  const update = trpc.deliverables.updateDeliverable.useMutation();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<UpsertDeliverableSchemaType> = async (data) => {
    setLoading(true);
    if (deliverable?.id) {
      await update.mutateAsync({ ...data, deliverableId: deliverable.id });
      await deliverables.getDeliverables.invalidate({ functionalityId });
      return onSuccess();
    }
    await create.mutateAsync({ ...data, functionalityId });
    await deliverables.getDeliverables.invalidate();
    setLoading(false);
    onSuccess();
  };

  const getError = () => {
    return errors.name?.message || errors.root?.message;
  };

  return (
    <div className="bg-white p-6">
      <p className="font-bold mb-5">
        {deliverable?.id ? "Atualizar Entregavel" : "Adicionar Entregavel"}
      </p>
      <form
        className="w-full flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {getError() && <div className="text-error text-xs">{getError()}</div>}
        <input
          type="text"
          placeholder="Nome da entrega"
          {...register("name")}
          className="input input-sm input-bordered input-primary"
        />

        <input
          type="text"
          placeholder="Descrição "
          {...register("description")}
          className="input input-sm input-bordered input-primary"
        />

        <button
          disabled={loading}
          className={`btn btn-primary text-white`}
          type="submit"
        >
          Salvar {loading && <Loader />}
        </button>
      </form>
    </div>
  );
}
