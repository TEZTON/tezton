import {
  UpsertFunctionalitySchema,
  UpsertFunctionalitySchemaType,
} from "@/schema/functionality";
import { trpc } from "@/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

interface UpsertFunctionalityProps {
  projectId: string;
  functionalityId?: string;
  onSuccess: () => void;
}

export default function UpsertFunctionality({
  projectId,
  functionalityId,
  onSuccess,
}: UpsertFunctionalityProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpsertFunctionalitySchemaType>({
    defaultValues: {
      projectId: projectId,
    },
    resolver: zodResolver(UpsertFunctionalitySchema),
  });
  const { functionalities } = trpc.useUtils();

  const create = trpc.functionalities.createFunctionality.useMutation();

  const onSubmit: SubmitHandler<UpsertFunctionalitySchemaType> = async (
    data
  ) => {
    await create.mutateAsync({ ...data, projectId });
    await functionalities.getFunctionalities.invalidate();
    onSuccess();
  };

  const getError = () => {
    return errors.name?.message || errors.root?.message;
  };

  return (
    <div className="bg-white p-6">
      <p className="font-bold mb-5">
        {functionalityId
          ? "Atualizar Funcionalidade"
          : "Adicionar Funcionalidade"}
      </p>
      <form
        className="w-full flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {getError() && <div className="text-error text-xs">{getError()}</div>}
        <input
          type="text"
          placeholder="Nome da funcionalidade"
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
