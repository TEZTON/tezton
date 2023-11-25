import {
  UpsertDeliverableSchema,
  UpsertDeliverableSchemaType,
} from "@/schema/deliverable";
import { trpc } from "@/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

interface UpsertDeliverableProps {
  functionalityId: string;
  deliverableId?: string;
  onSuccess: () => void;
}

export default function UpsertDeliverable({
  functionalityId,
  deliverableId,
  onSuccess,
}: UpsertDeliverableProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpsertDeliverableSchemaType>({
    defaultValues: {
      functionalityId: functionalityId,
    },
    resolver: zodResolver(UpsertDeliverableSchema),
  });
  const { deliverables } = trpc.useUtils();
  const create = trpc.deliverables.createDeliverable.useMutation();
  const update = trpc.deliverables.updateDeliverable.useMutation();

  const onSubmit: SubmitHandler<UpsertDeliverableSchemaType> = async (data) => {
    if (deliverableId) {
      await update.mutateAsync({ ...data, deliverableId });
      await deliverables.getDeliverables.invalidate();
      return onSuccess();
    }
    await create.mutateAsync({ ...data, functionalityId });
    await deliverables.getDeliverables.invalidate();
    onSuccess();
  };

  const getError = () => {
    return errors.name?.message || errors.root?.message;
  };

  return (
    <div className="bg-white p-6">
      <p className="font-bold mb-5">
        {deliverableId ? "Atualizar Entregavel" : "Adicionar Entregavel"}
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

        <button className="btn btn-primary text-white" type="submit">
          Salvar
        </button>
      </form>
    </div>
  );
}
