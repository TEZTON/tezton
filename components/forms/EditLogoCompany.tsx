import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  nome: string;
};

export const EditLogoCompany = ({ value }: any) => {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <form
      className="w-full flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        type="url"
        {...register("nome")}
        value={value}
        className="w-full h-8 pl-2 rounded border border-default dark:border-defaultdark bg-foreground"
      />
      <button type="submit">Salvar</button>
    </form>
  );
};
