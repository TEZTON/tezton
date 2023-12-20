import { useState } from "react";
import { PlusCircleIcon, MoreVertical } from "lucide-react";
import { CompanySchemaType } from "@/schema/company";
import Link from "next/link";
import Dialog from "../modal";
import UpsertCompany from "@/components/company/UpsertCompany";
import { trpc } from "@/trpc";
import ImageRender from "../ImageRender";
import Tooltip from "@/components/Tooltip";

const MIN_DIMENSION_CLASS = "min-w-[40px] min-h-[40px]";
export type CompanyType = "Financeira" | "Tecnologia" | "Consultoria";

export default function AllCompaniesAside() {
  const [isOpen, setOpen] = useState(false);
  const { data: myCompanies = [] } = trpc.companies.getMyCompanies.useQuery();
  const { data = [] } = trpc.companies.getAnotherCompanies.useQuery();
  const [isOpenEdit, setOpenEdit] = useState(false);
  const [contextMenuId, setContextMenuId] = useState(null);
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState<
    CompanySchemaType | any
  >({});

  const handleContextMenu = (id: any) => {
    setContextMenuId(id);
    setContextMenuOpen(true);

    const selectedItem = myCompanies?.find(
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
            initialData={selectedCompany}
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

        {myCompanies?.map(({ id, name, companyImageUrl }) => (
          <Tooltip key={id} title={name} place="right">
            <div
              key={id}
              className={`flex items-center justify-center ${MIN_DIMENSION_CLASS} rounded-r hover:bg-gray-300 dark:text-[gray] overflow-hidden p-1 group`}
              onMouseEnter={() => handleContextMenu(id)}
              onMouseLeave={closeContextMenu}
            >
              {isContextMenuOpen && contextMenuId === id && (
                <MoreVertical onClick={() => setOpenEdit(!isOpenEdit)} />
              )}
              <Link key={id} href={`/company/${id}`}>
                <ImageRender name={name} imageUrl={companyImageUrl} />
              </Link>
            </div>
          </Tooltip>
        ))}
        <div className="border-b-2 border-slate-300" />
        {data?.map(({ id, name, companyImageUrl }) => (
          <Tooltip key={id} title={name} place="right">
            <div
              key={id}
              className={`group flex items-center justify-center ${MIN_DIMENSION_CLASS} rounded-md hover:bg-gray-300 dark:text-[gray] overflow-hidden p-1 group`}
            >
              <Link key={id} href={`/company/${id}`}>
                <ImageRender name={name} imageUrl={companyImageUrl} />
              </Link>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
