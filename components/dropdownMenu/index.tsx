import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  MoreVerticalIcon,
  PenSquareIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { Dialog } from "../dialog";

export const ContextMenu = () => {
  const ITEMS = [
    { id: 1, label: "Criar", icon: PlusIcon },
    { id: 2, label: "Atualizar", icon: PenSquareIcon },
    { id: 3, label: "Deletar", icon: TrashIcon },
  ];

  // function handleExecute(id: number) {
  //   switch (id) {
  //     case 1:
  //       alert("Criar");
  //       break;
  //     case 2:
  //       alert("Atualizar");
  //       break;
  //     case 3:
  //       alert("Deletar");
  //       break;
  //   }
  // }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <MoreVerticalIcon size={16} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-foreground flex flex-col w-max max-w-[250px] gap-2 border border-default dark:border-defaultdark rounded-md overflow-hidden shadow-md drop-shadow-lg">
        {ITEMS.map(({ id, label, icon: Icon }) => (
          <DropdownMenu.Item
            // onClick={() => handleExecute(id)}
            key={label + id}
            className="w-full h-7 flex justify-between items-center gap-2 hover:bg-primary px-2 py-3"
          >
            <Dialog Trigger={<Icon size={14} />} />
            <span className="flex justify-start w-full text-xs">{label}</span>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
