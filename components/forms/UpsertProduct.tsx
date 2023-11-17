import {
  CreateProduct,
  CreateProductType,
  PRODUCT_KEYS,
  createProductApi,
} from "@/api/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";

interface UpsertProductProps {
  companyId: string;
}

export default function UpsertProduct({ companyId }: UpsertProductProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductType>({
    resolver: zodResolver(CreateProduct),
  });
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createProductApi,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [PRODUCT_KEYS.getProducts],
      });
    },
  });

  const onSubmit: SubmitHandler<CreateProductType> = (data) => {
    create.mutate({ ...data, companyId });
  };

  const getError = () => {
    return errors.name?.message || errors.root?.message;
  };

  return (
    <form
      className="w-full flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      {getError() && <div className="text-[red] text-xs">{getError()}</div>}
      <input
        type="text"
        placeholder="Nome do Empresa"
        {...register("name")}
        className="w-full h-8 pl-2 rounded border border-default dark:border-defaultdark bg-foreground"
      />

      <input
        type="text"
        placeholder="Descrição"
        {...register("description")}
        className="w-full h-8 pl-2 rounded border border-default dark:border-defaultdark bg-foreground"
      />

      <button className="btn" type="submit">
        Salvar
      </button>
    </form>
  );
}
