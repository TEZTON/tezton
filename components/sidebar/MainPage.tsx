"use client";
import { EditIcon, PlusCircleIcon } from "lucide-react";

import UpsertCompany from "@/components/forms/UpsertCompany";

import Link from "next/link";
import Image from "next/image";
import Dialog from "../dialog";

import { useQuery } from "@tanstack/react-query";
import { COMPANY_KEYS, getAllCompanyApi } from "@/api/company";
import FakePicture from "../FakePicture";
import { useState } from "react";

export default function MainPageSidebar() {
  const [isOpen, setOpen] = useState(false);
  const { data } = useQuery({
    queryKey: [COMPANY_KEYS.getAllCompanies],
    queryFn: getAllCompanyApi,
  });

  return (
    <div className="w-14 border-r flex flex-col pb-4">
      <Image
        alt="Image"
        src="/isotipo_png.png"
        className="w-14 h-[58px] min-h-[54px] min-w-[54px] p-3 border-b border-default dark:border-defaultdark flex items-center justify-center"
        width={56}
        height={58}
      />
      <div className="w-full flex flex-col justify-center items-center gap-2 mt-3 overflow-auto">
        <Dialog
          open={isOpen}
          setOpen={setOpen}
          trigger={
            <div className="hover:bg-black hover:bg-opacity-20 p-2 rounded-full cursor-pointer">
              <PlusCircleIcon size={16} />
            </div>
          }
        >
          <UpsertCompany
            onSuccess={() => {
              setOpen(false);
            }}
          />
        </Dialog>

        {data?.map(({ id, name }) => (
          <Link
            key={id}
            href={`/company/${id}`}
            className="group flex items-center justify-center min-w-[40px] min-h-[40px] rounded-md hover:bg-[#e6e8eb] dark:hover:bg-[#2f2f2f] dark:text-[gray] overflow-hidden p-1 group"
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
