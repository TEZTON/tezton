import {
  PriorityEnum,
  UpsertProjectSchema,
  UpsertProjectSchemaType
} from "@/schema/project";
import { trpc } from "@/trpc";
import { UpdateProject, UpsertProps } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";


export default function UpsertProject({
  productId,
  initialData,
  onSuccess,
}: UpsertProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<UpsertProjectSchemaType>({
    defaultValues: {
      productId: productId,
      ...initialData
    },
    resolver: zodResolver(UpsertProjectSchema)
  });
  const create = trpc.projects.createProject.useMutation();
  const update = trpc.projects.updateProject.useMutation();
  const getProject = trpc.projects.getProjects.useQuery({
    productId: productId
  });
  const onSubmit: SubmitHandler<UpsertProjectSchemaType> = async (data) => {
    if (initialData && initialData.id) {
      const updateData: UpdateProject = {
        productId: productId,
        projectId: initialData.id,
        name: data.name,
        description: data.description,
        priority: data.priority
      };
      await update.mutateAsync(updateData);
    } else {
      await create.mutateAsync({ ...data, productId });
      getProject.isFetched && getProject.refetch();
    }
    onSuccess();
  };

  const getError = () => {
    return errors.name?.message || errors.root?.message;
  };
  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("priority", initialData.priority);
      setValue("description", initialData.description);
    }
  }, [initialData, setValue]);

  return (
    <div className="bg-white p-6">
      <p className="font-bold mb-5">
        {initialData ? "Atualizar Projeto" : "Adicionar Projeto"}
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
