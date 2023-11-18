import {
  CreateDeliverable,
  CreateDeliverableType,
  DELIVERABLE_KEYS,
  createDeliverableApi,
} from "@/api/deliverable";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  } = useForm<CreateDeliverableType>({
    resolver: zodResolver(CreateDeliverable),
  });
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createDeliverableApi,
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: [DELIVERABLE_KEYS.getDeliverables, functionalityId],
      });
      onSuccess();
    },
  });

  const onSubmit: SubmitHandler<CreateDeliverableType> = (data) => {
    create.mutate({ ...data, functionalityId });
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
