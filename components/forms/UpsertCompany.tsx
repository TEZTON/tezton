import {
  CreateCompany,
  CreateCompanyType,
  CompanyTypeEnum,
  createCompanyApi,
} from "@/api/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";

export default function UpsertCompany() {
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

  const create = useMutation({
    mutationFn: createCompanyApi,
    onSuccess() {},
    onError() {},
  });

  const onSubmit: SubmitHandler<CreateCompanyType> = (data) => {
    create.mutate(data);
  };

  const getError = () => {
    return errors.name?.message || errors.type?.message || errors.root?.message;
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

      <select
        className="w-full h-8 pl-2 rounded border border-default dark:border-defaultdark bg-foreground"
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

      <button type="submit">Salvar</button>
    </form>
  );
}
