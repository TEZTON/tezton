import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { trpc } from "@/trpc";

import {
  UpsertDeliverableDiagramNodeBoundrySchema,
  UpsertDeliverableDiagramNodeBoundrySchemaType,
} from "@/schema/diagrams";

interface UpsertDeliverableDiagramNodeProps {
  deliverableId: string;
  onSuccess: () => void;
}

export default function UpsertDeliverableDiagramNode({
  deliverableId,
  onSuccess,
}: UpsertDeliverableDiagramNodeProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpsertDeliverableDiagramNodeBoundrySchemaType>({
    defaultValues: {
      deliverableId,
      positionX: 0,
      positionY: 0,
    },
    resolver: zodResolver(UpsertDeliverableDiagramNodeBoundrySchema),
  });
  const createNode =
    trpc.deliverableDiagrams.createDeliverableDiagramNode.useMutation();

  const { deliverableDiagrams } = trpc.useUtils();

  const onSubmit: SubmitHandler<
    UpsertDeliverableDiagramNodeBoundrySchemaType
  > = async (data) => {
    await createNode.mutateAsync({
      ...data,
      positionX: Math.floor(Math.random() * 100),
      positionY: Math.floor(Math.random() * 100),
    });
    await deliverableDiagrams.getNodes.invalidate({ deliverableId });

    onSuccess();
  };

  const getError = () => {
    return (
      errors.name?.message ||
      errors.positionX?.message ||
      errors.positionY?.message ||
      errors.root?.message?.toString()
    );
  };

  return (
    <div className="bg-white p-6">
      <p className="font-bold mb-5">Adicionar Card</p>
      <form
        className="w-full flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        {getError() && <div className="text-error text-xs">{getError()}</div>}
        <input
          type="text"
          placeholder="Nome do Card"
          {...register("name")}
          className="input input-sm input-bordered input-primary"
        />
        <input
          type="text"
          placeholder="Descrição"
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
