import { UpsertProductSchema, UpsertProductSchemaType } from "@/schema/product";
import { trpc } from "@/trpc";
import { useState } from "react";
import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

interface UpsertProductProps {
  companyId: string;
  productId?: string;
  onSuccessCallback: () => void;
}

export default function UpsertProduct({
  companyId,
  productId,
  onSuccessCallback,
}: UpsertProductProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpsertProductSchemaType>({
    defaultValues: {
      companyId: companyId,
    },
    resolver: zodResolver(UpsertProductSchema),
  });

  const [loading, setLoading] = useState(false);

  const { products } = trpc.useUtils();
  const create = trpc.products.createProduct.useMutation();

  const onSubmit: SubmitHandler<UpsertProductSchemaType> = async (data) => {
    setLoading(true);
    await create.mutateAsync({ ...data, companyId });
    await products.getProducts.invalidate();
    setLoading(false);
    onSuccessCallback();
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

        <button className="btn btn-primary text-white" type="submit" disabled={loading}>
          Salvar {loading && <Loader />}
        </button>
      </form>
    </div>
  );
}
