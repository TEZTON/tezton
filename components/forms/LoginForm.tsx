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
  const { register, handleSubmit } = useForm<Inputs>();
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log(user);
      if (user.user) {
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="w-full flex flex-col gap-5 bg-white items-center justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <span>Login de usuário</span>
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
