import {
  PriorityEnum,
  UpsertProjectSchema,
  UpsertProjectSchemaType,
} from "@/schema/project";
import { trpc } from "@/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

interface UpsertProjectProps {
  productId: string;
  projectId?: string;
  onSuccess: () => void;
}

export default function UpsertProject({
  productId,
  projectId,
  onSuccess,
}: UpsertProjectProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpsertProjectSchemaType>({
    defaultValues: {
      productId: productId,
    },
    resolver: zodResolver(UpsertProjectSchema),
  });

  const { projects } = trpc.useUtils();
  const create = trpc.projects.createProject.useMutation();

  const onSubmit: SubmitHandler<UpsertProjectSchemaType> = async (data) => {
    await create.mutateAsync({ ...data, productId });
    projects.getProjects.invalidate();
    onSuccess();
  };

  const getError = () => {
    return errors.name?.message || errors.root?.message;
  };

  return (
    <div className="bg-white p-6">
      <p className="font-bold mb-5">
        {projectId ? "Atualizar Projeto" : "Adicionar Projeto"}
      </p>
      <form
        className="w-full flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {getError() && <div className="text-error text-xs">{getError()}</div>}
        <input
          type="text"
          placeholder="Nome do Projeto"
          {...register("name")}
          className="input input-sm input-bordered input-primary"
        />

        <input
          type="text"
          placeholder="Descrição "
          {...register("description")}
          className="input input-sm input-bordered input-primary"
        />

        <select
          className="input input-sm input-bordered input-primary"
          {...register("priority")}
        >
          <option value={PriorityEnum.Enum.Low}>{PriorityEnum.Enum.Low}</option>
          <option value={PriorityEnum.Enum.Medium}>
            {PriorityEnum.Enum.Medium}
          </option>
          <option value={PriorityEnum.Enum.High}>
            {PriorityEnum.Enum.High}
          </option>
        </select>

        <button className="btn btn-primary text-white" type="submit">
          Salvar
        </button>
      </form>
    </div>
  );
}