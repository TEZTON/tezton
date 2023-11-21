import {
  CreateCompany,
  CreateCompanyType,
  CompanyTypeEnum,
  createCompanyApi,
} from "@/api/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";

export const CreateCompanyForm = ({ value }: any) => {
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

  const OPTIONS_MOCK = ["Financeira", "Tecnologia", "Consultoria"];

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
      <div className="flex flex-col w-full">
        <label htmlFor="name">Nome da empresa</label>
        <input
          id="name"
          type="text"
          placeholder="Nome da Empresa"
          {...register("name")}
          value={value}
          className="w-full h-8 pl-2 rounded border text-backgroundDark border-default dark:border-defaultdark bg-foreground"
        />
      </div>
      <div className="flex flex-col w-full">
        <label htmlFor="type">Tipo da empresa</label>
        <select
          id="type"
          {...register("type")}
          className="w-full h-8 pl-2 rounded border text-backgroundDark border-default dark:border-defaultdark bg-foreground "
        >
          {OPTIONS_MOCK.map((value) => (
            <option value={value}>{value}</option>
          ))}
        </select>
      </div>
      <button
        className="border-primary border h-11 hover:bg-primary rounded"
        type="submit"
      >
        Salvar
      </button>
    </form>
  );
};
