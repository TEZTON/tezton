"use client";
import { useEffect } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase-config";

import { LoginForm } from "@/components/forms/LoginForm";
import { useRouter } from "next/navigation";

export default function LoginScreen() {
  const r = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        return r.push("/home");
      }
    });
  }, [r]);

  return (
    <div className="w-full bg-foreground flex h-screen">
      <div className="w-full bg-[url(tzton.jpg)] bg-cover h-full"></div>
      <div className="w-[40%] bg-white h-full flex flex-col items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
}
