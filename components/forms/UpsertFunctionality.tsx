import {
  CreateFunctionality,
  CreateFunctionalityType,
  createFunctionalityApi,
} from "@/api/functionality";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";

interface UpsertFunctionalityrops {
  projectId: string;
  functionalityId?: string;
  onSuccess: () => void;
}

export default function UpsertFunctionality({
  projectId,
  functionalityId,
  onSuccess,
}: UpsertFunctionalityrops) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFunctionalityType>({
    resolver: zodResolver(CreateFunctionality),
  });
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createFunctionalityApi,
    async onSuccess() {
      await queryClient.invalidateQueries({
        // queryKey: [PROJECT_KEYS.getProjects],
      });
      onSuccess();
    },
  });

  const onSubmit: SubmitHandler<CreateFunctionalityType> = (data) => {
    create.mutate({ ...data, projectId });
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
