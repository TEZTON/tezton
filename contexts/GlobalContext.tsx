import { onAuthStateChanged } from "firebase/auth";
import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { auth } from "@/firebase-config";

interface GlobalProviderProps {
  selectedFeature?: any;
  setSelectedFeature?: (feature: any) => void;
  selectedCompany?: any;
  setSelectedCompany?: any;
  user?: any;
  setUser?: (user: any) => void;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
}

export const GlobalContext = createContext({} as GlobalProviderProps);

export default function GlobalProvider({ children }: PropsWithChildren) {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        return setUser(currentUser);
      }
    });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        selectedFeature,
        setSelectedFeature,
        selectedCompany,
        setSelectedCompany,
        user,
        setUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
