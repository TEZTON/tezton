import { auth } from "@/firebase-config";
import { onAuthStateChanged } from "@firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface AuthenticationProps {
  children?: React.ReactNode;
}

export function Authentication({ children }: AuthenticationProps) {
  const [isLoading, setLoading] = useState(true);

  const { push } = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user && auth.currentUser) {
        axios.interceptors.request.use(async (config) => {
          const token = await user.getIdToken();
          config.headers.authorization = `Bearer ${token}`;
          return config;
        });
        setLoading(false);
      } else {
        axios.interceptors.request.clear();
        push("/login");
      }
    });
    return unsub;
  }, [push]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
}

export function RedirectIfAuthenticated({ children }: AuthenticationProps) {
  const [isLoading, setLoading] = useState(true);

  const { push } = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && auth.currentUser) {
        push("/");
      } else {
        setLoading(false);
      }
    });
    return unsub;
  }, [push]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
}
