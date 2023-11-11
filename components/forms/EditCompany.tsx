import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  name: string;
  type: string;
};

export const EditNameCompany = ({ value }: any) => {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <form
      className="w-full flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
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
