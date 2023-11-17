import { EditIcon, HomeIcon, PlusCircleIcon } from "lucide-react";

import Link from "next/link";
import { Dialog } from "../dialog";

import { useQuery } from "@tanstack/react-query";
import FakePicture from "../FakePicture";
import UpsertProduct from "../forms/UpsertProduct";
import { PRODUCT_KEYS, getProductsApi } from "@/api/product";

interface CompanyPageSidebarProps {
  id: string;
  name: string;
}

export default function CompanyPageSidebar({
  name,
  id,
}: CompanyPageSidebarProps) {
  const { data } = useQuery({
    queryKey: [PRODUCT_KEYS.getProducts],
    queryFn: () => getProductsApi(id),
  });

  return (
    <div className="w-14 border-r flex flex-col overflow-auto">
      <div className="p-3 border-b">
        <FakePicture name={name} width={31} height={31} />
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-2 mt-3">
        <div className="w-full flex flex-col justify-center items-center gap-2">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#e6e8eb] dark:hover:bg-[#2f2f2f] dark:text-[gray] overflow-hidden p-1"
          >
            <HomeIcon size={16} />
          </Link>
          <Dialog
            title="Adicionar Produto"
            Trigger={
              <button className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#e6e8eb] dark:hover:bg-[#2f2f2f] dark:text-[gray] overflow-hidden">
                <PlusCircleIcon size={16} />
              </button>
            }
            Content={() => <UpsertProduct companyId={id} />}
          />
        </div>
        {data?.map(({ id, name }) => (
          <Link
            key={id}
            href={`/company/${id}`}
            className="group flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#e6e8eb] dark:hover:bg-[#2f2f2f] dark:text-[gray] overflow-hidden p-1 group"
          >
            <div className="invisible group-hover:visible absolute text-primary mt-[-30px] ml-[-30px]">
              <EditIcon size={16} />
            </div>
            <FakePicture name={name} />
          </Link>
        ))}
      </div>
    </div>
  );
}
