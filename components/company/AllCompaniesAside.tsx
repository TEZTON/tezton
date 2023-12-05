import { useState } from "react";
import {
  PlusCircleIcon,
  MoreVertical
} from "lucide-react";
import {
  CompanySchemaType
} from "@/schema/company";
import Link from "next/link";
import Dialog from "../modal";
import UpsertCompany from "@/components/company/UpsertCompany";
import { trpc } from "@/trpc";
import ImageRender from "../ImageRender";

const MIN_DIMENSION_CLASS = "min-w-[40px] min-h-[40px]";
export type CompanyType = 'Financeira' | 'Tecnologia' | 'Consultoria';

export default function AllCompaniesAside() {
  const [isOpen, setOpen] = useState(false);
  const { data } = trpc.companies.getAllCompanies.useQuery();
  const [isOpenEdit, setOpenEdit] = useState(false);
  const [contextMenuId, setContextMenuId] = useState(null);
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState<CompanySchemaType | null>(null);

  const handleContextMenu = (id: any) => {
    setContextMenuId(id);
    setContextMenuOpen(true);
  
    const selectedItem = data?.find(
      (company: CompanySchemaType) => company.id === id
    ) as CompanySchemaType | undefined;

    setSelectedCompany(selectedItem as CompanySchemaType);
  };

  const closeContextMenu = () => {
    setContextMenuId(null);
    setContextMenuOpen(false);
  };

  return (
    <div className="w-14 flex flex-col border-r">
      <div className="w-full flex flex-col gap-2 pb-4">
        <Dialog open={isOpenEdit} setOpen={setOpenEdit}>
          <UpsertCompany
            initialData={{
              id: selectedCompany?.id || "",
              name: selectedCompany?.name || "",
              type: selectedCompany?.type as CompanyType || 'Financeira',
            }} 
            onSuccess={() => {
              setOpenEdit(false);
            }}
          />
        </Dialog>
        <Dialog
          open={isOpen}
          setOpen={setOpen}
          trigger={
            <button className="btn btn-xs cursor-pointer m-auto mt-2 flex w-9 h-9">
              <PlusCircleIcon size={16} />
            </button>
          }
        >
          <UpsertCompany
            onSuccess={() => {
              setOpen(false);
            }}
          />
        </Dialog>

        {data?.map(({ id, name, companyImageUrl }) => (
          <div
            key={id}
            className={`group flex items-center justify-center ${MIN_DIMENSION_CLASS} rounded-md hover:bg-[#e6e8eb] dark:hover:bg-[#2f2f2f] dark:text-[gray] overflow-hidden p-1 group`}
            onMouseEnter={() => handleContextMenu(id)}
            onMouseLeave={closeContextMenu}
          >
            <Link key={id} href={`/company/${id}`}>
              <ImageRender name={name} imageUrl={companyImageUrl} />
            </Link>
            {isContextMenuOpen && contextMenuId === id && (
              <MoreVertical onClick={() => setOpenEdit(!isOpenEdit)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
