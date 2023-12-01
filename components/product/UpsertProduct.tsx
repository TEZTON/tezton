import { UpsertProductSchema, UpsertProductSchemaType } from "@/schema/product";
import { trpc } from "@/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface UpsertProductProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
  };
  companyId: string;
  productId?: string;
  onSuccessCallback: () => void;
}

export default function UpsertProduct({
  companyId,
  productId,
  onSuccessCallback,
  initialData,
}: UpsertProductProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpsertProductSchemaType>({
    defaultValues: {
      companyId: companyId,
      ...initialData
    },
    resolver: zodResolver(UpsertProductSchema),
  });

  const { products } = trpc.useUtils();
  const create = trpc.products.createProduct.useMutation();
  const update = trpc.products.updateProduct.useMutation();
  const deleted = trpc.products.deleteProduct.useMutation();
  const onSubmit: SubmitHandler<UpsertProductSchemaType> = async (data) => {
    if (initialData && initialData.id) {
      await update.mutateAsync({
        productId: initialData?.id as any,
        ...data,
      });
    } else {
    await create.mutateAsync({ ...data, companyId });
    }
    await products.getProducts.invalidate();
    onSuccessCallback();
  };

  const funcDelete = async () => {
    if (initialData && initialData.id) {
      await deleted.mutateAsync({
        productId: initialData?.id,
        companyId: companyId
      }, {
        onSuccess: async () => {
          await products.getProducts.invalidate();
          onSuccessCallback();
        },
      });
    }
  };

  const getError = () => {
    return errors.name?.message || errors.root?.message;
  };
  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("description", initialData.description);
    }
  }, [initialData, setValue]);

  return (
    <div className="bg-white p-6">
      <p className="font-bold mb-5">
        {initialData ? "Atualizar Produto" : "Adicionar Produto"}
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
        {initialData && (
          <button
            onClick={funcDelete}
            className="btn btn-secondary text-white"
            type="button"
          >
            Excluir
          </button>
        )}
      </form>
    </div>
  );
}
