import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  MoreVerticalIcon,
  PenSquareIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";

const ITEMS = [
  { id: 1, label: "Criar", icon: PlusIcon, action: (data: any) => {} },
  { id: 2, label: "Editar", icon: PenSquareIcon, action: (data: any) => {} },
  { id: 3, label: "Apagar", icon: TrashIcon, action: (id: number) => {} },
];

type ContextItemsProps = typeof ITEMS;

export const ContextMenu = ({
  items,
  itemId,
}: {
  items: ContextItemsProps;
  itemId: any;
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <MoreVerticalIcon size={16} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-foreground flex flex-col w-max max-w-[250px] gap-2 border border-default dark:border-defaultdark rounded-md overflow-hidden shadow-md drop-shadow-lg bg-gray-200">
        {!items?.length &&
          ITEMS.map(({ id, label, icon: Icon }) => (
            <DropdownMenu.Item
              key={label + id}
              className="w-full h-7 flex justify-between items-center gap-2 px-2 py-3"
            >
              <span className="flex justify-start w-full text-xs">{label}</span>
              <Icon />
            </DropdownMenu.Item>
          ))}
        {items?.length &&
          items.map(({ id, label, icon: Icon, action }) => (
            <DropdownMenu.Item
              onClick={() => action(itemId)}
              key={label + id}
              className="w-full h-7 flex justify-between items-center gap-2 hover:bg-primary px-2 py-3 hover:text-white"
            >
              <span className="flex justify-start w-full text-xs">{label}</span>
              <Icon />
            </DropdownMenu.Item>
          ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
