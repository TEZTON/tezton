import {
  CreateCompany,
  CreateCompanyType,
  CompanyTypeEnum,
  createCompanyApi,
  COMPANY_KEYS,
} from "@/api/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";

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

  const onSubmit: SubmitHandler<CreateCompanyType> = async (data) => {
    create.mutate(data);
    await queryClient.invalidateQueries({
      queryKey: [COMPANY_KEYS.getAllowedCompanies],
    });

    await queryClient.invalidateQueries({
      queryKey: [COMPANY_KEYS.getAllCompanies],
    });

    onSuccess();
  };

  const getError = () => {
    return errors.name?.message || errors.type?.message || errors.root?.message;
  };

  return (
    <div className="bg-white p-6">
      <p className="font-bold mb-5">
        {companyId ? "Atualizar Empresa" : "Adicionar Empresa"}
      </p>
      <form
        className="w-full flex flex-col gap-5"
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
          <option selected value={CompanyTypeEnum.Enum.Consultoria}>
            {CompanyTypeEnum.Enum.Consultoria}
          </option>
          <option value={CompanyTypeEnum.Enum.Financeira}>
            {CompanyTypeEnum.Enum.Financeira}
          </option>
          <option value={CompanyTypeEnum.Enum.Tecnologia}>
            {CompanyTypeEnum.Enum.Tecnologia}
          </option>
        </select>

        <button className="btn btn-primary text-white" type="submit">
          Salvar
        </button>
      </form>
    </div>
  );
}
