"use client";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginScreen() {
  return (
    <div className="w-full bg-foreground flex h-screen">
      <div className="w-full bg-[url(tzton.jpg)] bg-cover h-full"></div>
      <div className="w-[40%] bg-white h-full flex flex-col items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
}
