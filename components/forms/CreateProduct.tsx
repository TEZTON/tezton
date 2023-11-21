import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createProductApi } from "@/api/product";
import { useParams } from "next/navigation";

type Inputs = {
  name: string;
  description: string;
  companyId: string;
};

export const CreateProduct = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    create.mutate(data);
  };

  const { companyId } = useParams();

  const create = useMutation({
    mutationFn: createProductApi,
    onSuccess() {},
    onError() {},
  });

  return (
    <form
      className="w-full flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col w-full">
        <label htmlFor="name">Nome do produto</label>
        <input
          id="name"
          {...register("name")}
          className="w-full h-8 pl-2 rounded border text-backgroundDark border-default dark:border-defaultdark bg-foreground"
        />
      </div>
      <div className="flex flex-col w-full">
        <label htmlFor="description">Descrição</label>
        <input
          id="description"
          {...register("description")}
          className="w-full h-8 pl-2 rounded border text-backgroundDark border-default dark:border-defaultdark bg-foreground"
        />
      </div>
      <input type="hidden" {...register("companyId")} value={companyId} />

      <button
        className="border-primary border h-11 hover:bg-primary rounded"
        type="submit"
      >
        Salvar
      </button>
    </form>
  );
};
