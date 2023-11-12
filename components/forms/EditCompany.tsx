import {
  CreateCompany,
  CreateCompanyType,
  CompanyTypeEnum,
  createCompanyApi,
} from "@/api/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";

export const EditNameCompany = ({ value }: any) => {
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
        value={value}
        className="w-full h-8 pl-2 rounded border border-default dark:border-defaultdark bg-foreground"
      />
      <input
        type="text"
        placeholder="Tipo da Empresa"
        {...register("type")}
        value={value}
        className="w-full h-8 pl-2 rounded border border-default dark:border-defaultdark bg-foreground"
      />
      <button type="submit">Salvar</button>
    </form>
  );
};
