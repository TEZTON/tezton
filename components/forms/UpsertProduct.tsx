import { UpsertProductSchema, UpsertProductSchemaType } from "@/schema/product";
import { trpc } from "@/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";

interface UpsertProductProps {
  companyId: string;
  productId?: string;
  onSuccess: () => void;
}

export default function UpsertProduct({
  companyId,
  productId,
  onSuccess,
}: UpsertProductProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpsertProductSchemaType>({
    resolver: zodResolver(UpsertProductSchema),
  });
  const queryClient = useQueryClient();
  const create = trpc.products.createProduct.useMutation({
    onSuccess() {
      queryClient.invalidateQueries({
        // queryKey: [PRODUCT_KEYS.getProducts],
      });

      onSuccess();
    },
  });

  const onSubmit: SubmitHandler<UpsertProductSchemaType> = (data) => {
    create.mutate({ ...data, companyId });
  };

  const getError = () => {
    return errors.name?.message || errors.root?.message;
  };

  return (
    <div className="bg-white p-6">
      <p className="font-bold mb-5">
        {productId ? "Atualizar Produto" : "Adicionar Produto"}
      </p>
      <form
        className="w-full flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {getError() && <div className="text-error text-xs">{getError()}</div>}
        <input
          type="text"
          placeholder="Nome do Produto"
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
