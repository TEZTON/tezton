import { UpsertPropsProduct } from "@/utils/types";
import { UpsertProductSchema, UpsertProductSchemaType } from "@/schema/product";
import { trpc } from "@/trpc";
import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

export default function UpsertProduct({
  companyId,
  onSuccessCallback,
  initialData,
}: UpsertPropsProduct) {
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

  const [loading, setLoading] = useState(false);

  const { products } = trpc.useUtils();
  const create = trpc.products.createProduct.useMutation();
  const update = trpc.products.updateProduct.useMutation();
  const deleted = trpc.products.deleteProduct.useMutation();
  const getProducts = trpc.products.getProducts.useQuery({
    companyId: companyId
  });
  const onSubmit: SubmitHandler<UpsertProductSchemaType> = async (data) => {
    setLoading(true);
    if (initialData && initialData.id) {
      const updateData: UpsertProductSchemaType = {
        companyId: companyId,
        productId: initialData.id,
        name: data.name,
        description: data.description,
      };
      await update.mutateAsync({
        ...updateData,
        productId: updateData.productId || "",
      });
    } else {
    await create.mutateAsync({ ...data, companyId });
    getProducts.isFetched && getProducts.refetch();
    }
    await products.getProducts.invalidate();
    setLoading(false);
    onSuccessCallback();
  };

  const funcDelete = async () => {
    if (initialData && initialData.id) {
      setLoading(true);
      await deleted.mutateAsync({
        productId: initialData?.id,
        companyId: companyId
      }, {
        onSuccess: async () => {
          await products.getProducts.invalidate();
          onSuccessCallback();
        },
      });
      setLoading(false);
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

        <button className="btn btn-primary text-white" type="submit" disabled={loading}>
          Salvar {loading && <Loader />}
        </button>
        {initialData && (
          <button
            disabled={loading}
            onClick={funcDelete}
            className="btn btn-secondary text-white"
            type="button"
          >
            Excluir {loading && <Loader />}
          </button>
        )}
      </form>
    </div>
  );
}
