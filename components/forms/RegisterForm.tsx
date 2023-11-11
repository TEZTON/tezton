import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";

type Inputs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const RegisterForm = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const r = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const user = await axios.post(
        "https://tezton-api-b7127338731a.herokuapp.com/api/user",
        data
      );

      console.log(user);
      r.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="w-full flex flex-col gap-5 bg-white items-center justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <span>Registro de usuário</span>
      <div className="flex flex-col justify-start items-start">
        <label htmlFor="firstname">Primeiro nome</label>
        <input
          type="text"
          title="firstname"
          {...register("firstName")}
          className="w-full h-8 pl-2 rounded border border-default dark:border-defaultdark bg-foreground text-black"
        />
      </div>
      <div className="flex flex-col justify-start items-start">
        <label htmlFor="lastname">Segundo nome</label>
        <input
          type="text"
          title="lastname"
          {...register("lastName")}
          className="w-full h-8 pl-2 rounded border border-default dark:border-defaultdark bg-foreground text-black"
        />
      </div>
      <div className="flex flex-col justify-start items-start">
        <label htmlFor="Email">Email</label>
        <input
          type="text"
          {...register("email")}
          className="w-full h-8 pl-2 rounded border border-default dark:border-defaultdark bg-foreground text-black"
        />
      </div>
      <div className="flex flex-col justify-start items-start">
        <label htmlFor="Senha">Senha</label>
        <input
          type="password"
          {...register("password")}
          className="w-full h-8 pl-2 rounded border border-default dark:border-defaultdark bg-foreground text-black"
        />
      </div>
      <Link className="text-xs" href="/login">
        Já tenho conta
      </Link>
      <button
        className="w-max border border-primary px-3 py-1 rounded-md hover:bg-primary hover:text-black"
        type="submit"
      >
        Salvar
      </button>
    </form>
  );
};
