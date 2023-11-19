import {
  CreateCompany,
  CreateCompanyType,
  CompanyTypeEnum,
  createCompanyApi,
  COMPANY_KEYS,
  ACCEPTED_IMAGE_TYPES,
} from "@/api/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import type { PutBlobResult } from "@vercel/blob";
import { uploadAssetApi } from "@/api/asset";

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
  } = useForm<CreateCompanyType>({
    defaultValues: {
      type: CompanyTypeEnum.Enum.Consultoria,
    },
    resolver: zodResolver(CreateCompany),
  });

  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createCompanyApi,
  });
  const upload = useMutation({ mutationFn: uploadAssetApi });

  const onSubmit: SubmitHandler<CreateCompanyType> = async (data) => {
    let fileurl: string | undefined = undefined;

    if (data.companyImage[0]) {
      try {
        const result = await upload.mutateAsync(data.companyImage[0]);
        fileurl = result.url;
      } catch (err) {
        console.log("failed to upload image", err);
      }
    }

    create.mutate({ ...data, companyImageUrl: fileurl });
    await queryClient.invalidateQueries({
      queryKey: [COMPANY_KEYS.getAllowedCompanies],
    });

    await queryClient.invalidateQueries({
      queryKey: [COMPANY_KEYS.getAllCompanies],
    });

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
