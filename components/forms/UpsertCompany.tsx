import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ACCEPTED_IMAGE_TYPES,
  CompanyTypeEnum,
  UpsertCompanyFileUploadSchema,
  UpsertCompanyFileUploadSchemaType,
} from "@/schema/company";
import { trpc } from "@/trpc";
import { uploadAssetApi } from "@/trpc/asset";

interface UpsertCompanyProps {
  companyId?: string;
  onSuccess: () => void;
}

export default function UpsertCompany({
  companyId,
  onSuccess,
}: UpsertCompanyProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpsertCompanyFileUploadSchemaType>({
    defaultValues: {
      type: CompanyTypeEnum.Enum.Consultoria,
    },
    resolver: zodResolver(UpsertCompanyFileUploadSchema),
  });

  const create = trpc.companies.createCompany.useMutation();
  const upload = useMutation({ mutationFn: uploadAssetApi });
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
        console.log("failed to upload image", err);
      }
    }

    await create.mutateAsync({ ...data, companyImageUrl: fileurl });
    await companies.getAllCompanies.invalidate();
    await companies.getMyCompanies.invalidate();
    onSuccess();
  };

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
        {companyId ? "Atualizar Empresa" : "Adicionar Empresa"}
      </p>
      <form
        className="w-full flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        {getError() && <div className="text-error text-xs">{getError()}</div>}
        <input
          type="text"
          placeholder="Nome do Empresa"
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
      </form>
    </div>
  );
}
