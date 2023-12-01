import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ACCEPTED_IMAGE_TYPES,
  CompanyTypeEnum,
  UpsertCompanyFileUploadSchema,
  UpsertCompanyFileUploadSchemaType
} from "@/schema/company";
import { trpc } from "@/trpc";
import { uploadAssetApi } from "@/trpc/asset";
import { CompanyType, CompanyUpdate, UpsertCompanyProps } from "@/utils/types";

export default function UpsertCompany({
  initialData,
  onSuccess
}: UpsertCompanyProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<UpsertCompanyFileUploadSchemaType>({
    defaultValues: {
      type: CompanyTypeEnum.Enum.Consultoria,
      ...initialData
    },
    resolver: zodResolver(UpsertCompanyFileUploadSchema)
  });
  const create = trpc.companies.createCompany.useMutation();
  const update = trpc.companies.updateCompany.useMutation();
  const upload = useMutation({ mutationFn: uploadAssetApi });
  const deleted = trpc.companies.deleteCompany.useMutation();
  const getCompanies = trpc.companies.getAllCompanies.useQuery();
  const { companies } = trpc.useUtils();

  const onSubmit: SubmitHandler<UpsertCompanyFileUploadSchemaType> = async (
    data
  ) => {
    let fileurl: string | undefined = undefined;

    if (data.companyImage[0]) {
      try {
        const result = await upload.mutateAsync(data.companyImage[0]);
        fileurl = result.url;
      } catch (err) {
        console.error(err);
      }
    }

    if (initialData && initialData.id) {
      const updateData: CompanyUpdate = {
        companyId: initialData?.id as string,
        name: data.name,
        type: data.type as CompanyType,
        companyImageUrl: fileurl
      };
      await update.mutateAsync(updateData);
    } else {
      await create.mutateAsync({ ...data, companyImageUrl: fileurl });
      getCompanies.isFetched && getCompanies.refetch();
    }

    await companies.getAllCompanies.invalidate();
    await companies.getMyCompanies.invalidate();

    onSuccess();
  };

  const funcDelete = async () => {
    if (initialData && initialData.id) {
      await deleted.mutateAsync({ companyId: initialData?.id }, {
        onSuccess: async () => {
          await companies.getAllCompanies.invalidate();
          await companies.getMyCompanies.invalidate();
          onSuccess();
        },
      });
    }
  };

  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("type", initialData.type);
    }
  }, [initialData, setValue]);

  const getError = () => {
    return (
      errors.name?.message ||
      errors.type?.message ||
      errors.root?.message ||
      errors.companyImage?.message?.toString()
    );
  };

  return (
    <div className="bg-white p-6">
      <p className="font-bold mb-5">
        {initialData ? "Atualizar Empresa" : "Adicionar Empresa"}
      </p>
      <form
        className="w-full flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        {getError() && <div className="text-error text-xs">{getError()}</div>}
        <input
          type="text"
          placeholder="Nome da Empresa"
          {...register("name")}
          className="input input-sm input-bordered input-primary"
        />

        <select
          className="input input-sm input-bordered input-primary"
          {...register("type")}
        >
          <option value={CompanyTypeEnum.Enum.Consultoria}>
            {CompanyTypeEnum.Enum.Consultoria}
          </option>
          <option value={CompanyTypeEnum.Enum.Financeira}>
            {CompanyTypeEnum.Enum.Financeira}
          </option>
          <option value={CompanyTypeEnum.Enum.Tecnologia}>
            {CompanyTypeEnum.Enum.Tecnologia}
          </option>
        </select>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Imagem</span>
          </label>
          <input
            type="file"
            className="file-input file-input-xs file-input-bordered text-xs file-input-primary w-full"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            {...register("companyImage")}
          />
        </div>

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
