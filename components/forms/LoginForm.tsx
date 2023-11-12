import { signInWithEmailAndPassword } from "firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { auth } from "@/firebase-config";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Inputs = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (user.user) {
        router.push("/");
      }
    } catch (error) {
      if (
        (error as unknown as any).code &&
        ((error as unknown as any).code === "auth/invalid-login-credentials" ||
          (error as unknown as any).code === "auth/invalid-email")
      ) {
        setError("root", { message: "Credenciais inválidas" });
      } else {
        setError("root", { message: "Erro inesperado" });
      }
    }
  };

  return (
    <form
      className="w-full flex flex-col gap-5 bg-white items-center justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <span>Login de usuário</span>
      {errors.root && (
        <span className="text-[red] text-xs">{errors.root.message}</span>
      )}
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
      <Link className="text-xs" href="/register">
        Não tenho conta, criar
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
