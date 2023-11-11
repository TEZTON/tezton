import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import {
  AppleIcon,
  ComputerIcon,
  LogOutIcon,
  SettingsIcon,
  Smartphone,
} from "lucide-react";
import { Fragment, useContext, useState } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase-config";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export const TopMenu = () => {
  const PLATFORMS = [
    { label: "Web", icon: ComputerIcon },
    { label: "Android", icon: Smartphone },
    { label: "iOS", icon: AppleIcon },
  ];

  const AMBIENTS = [
    { label: "Ideação", value: "Ideação" },
    { label: "Refinamento", value: "Refinamento" },
    { label: "Desenvolvimento", value: "Desenvolvimento" },
    { label: "Homologação", value: "Homologação" },
    { label: "Produção", value: "Produção" },
  ];

  const STATS = [
    { id: 1, label: "Configurações", icon: SettingsIcon },
    { id: 2, label: "Deslogar", icon: LogOutIcon },
  ];

  const { user } = useContext(GlobalContext);
  const { company_id } = useParams();
  const [selectedAmbient, setSelectedAmbient] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState("");

  const r = useRouter();

  async function handleLogout() {
    try {
      await signOut(auth);
      r.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full h-[58px] bg-[#F8F9FF] dark:bg-[#1c1c1c] border-b border-default dark:border-defaultdark px-3 flex items-center justify-between">
      <div className="w-full flex justify-start items-center gap-2">
        {company_id && (
          <Fragment>
            <span className="text-xs">Dispositivos:</span>
            {PLATFORMS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setSelectedPlatforms(label)}
                className={`w-max h-max p-2 border border-default dark:border-defaultdark rounded-md hover:bg-primary ${
                  selectedPlatforms === label && "bg-primary"
                }`}
              >
                <Icon size={14} />
              </button>
            ))}
            <div className="w-full flex gap-1 ml-8">
              {AMBIENTS.map(({ label }) => (
                <button
                  key={label}
                  onClick={() => setSelectedAmbient(label)}
                  className={`w-max h-max p-2 text-xs rounded-md hover:bg-primary ${
                    selectedAmbient === label && "bg-primary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="w-full flex gap-2">
              {["Voltar", "Promover"].map((label) => (
                <button
                  onClick={() => {}}
                  key={label}
                  className={`w-max h-max p-2 text-sm border border-default dark:border-defaultdark rounded-md hover:bg-primary`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Fragment>
        )}
      </div>

      <div className="w-full flex justify-end items-center gap-2">
        <span>{user?.email}</span>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <div className="max-w-[45px] max-h-[45px] rounded-full overflow-hidden">
              <Image
                alt="user"
                src="/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.jpeg"
                width={45}
                height={45}
              />
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-foreground flex flex-col w-max max-w-[250px] gap-2 border border-default dark:border-defaultdark rounded-md overflow-hidden shadow-md drop-shadow-lg">
            {STATS.map(({ id, label, icon: Icon }) => (
              <DropdownMenu.Item
                onClick={() => (label === "Deslogar" ? handleLogout() : {})}
                key={label + id}
                className="w-full h-7 flex justify-between items-center gap-2 hover:bg-primary px-2 py-3"
              >
                <Icon size={20} />
                <span className="flex justify-start w-full text-xs">
                  {label}
                </span>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};
