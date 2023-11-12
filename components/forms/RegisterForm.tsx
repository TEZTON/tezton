import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CreateUser, CreateUserType, createUserApi } from "@/api/user";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

function getError(err: any) {
  return err.response?.data?.message || "Invalid";
}

export const RegisterForm = () => {
  const [successMsg, setSuccessMsg] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreateUserType>({
    resolver: zodResolver(CreateUser),
  });
  const { push } = useRouter();

  const createUserMutation = useMutation({
    mutationFn: createUserApi,
    onSuccess() {
      setSuccessMsg("Usuário criado com sucesso");

      setTimeout(() => {
        push("/login");
      }, 2000);
    },
    onError(err) {
      if ((err as any).code === "ERR_BAD_REQUEST") {
        setError("root", { message: getError(err) });
      } else {
        setError("root", {
          message: "Something went wrong, please try again later.",
        });
      }
    },
  });

  const onSubmit: SubmitHandler<CreateUserType> = async (data) => {
    createUserMutation.mutate(data);
  };

  const getErrors = () => {
    return (
      errors.email?.message ||
      errors.password?.message ||
      errors.firstName?.message ||
      errors.lastName?.message ||
      errors.root?.message
    );
  };

  return (
    <form
      className="w-full flex flex-col gap-5 bg-white items-center justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <span>Registro de usuário</span>
      {successMsg && <span className="text-[green] text-xs">{successMsg}</span>}
      {getErrors() && <span className="text-[red] text-xs">{getErrors()}</span>}
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
