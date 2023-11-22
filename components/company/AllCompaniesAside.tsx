"use client";
import { EditIcon, PlusCircleIcon } from "lucide-react";

import UpsertCompany from "@/components/company/UpsertCompany";

import Link from "next/link";
import Image from "next/image";
import Dialog from "../modal";

import { useState } from "react";
import ImageRender from "../ImageRender";
import { trpc } from "@/trpc";

export default function AllCompaniesAside() {
  const [isOpen, setOpen] = useState(false);
  const { data } = trpc.companies.getAllCompanies.useQuery();

  return (
    <div className="w-14 flex flex-col border-r">
      <Image
        alt="Image"
        src="/isotipo_png.png"
        className="w-14 h-[58px] min-h-[54px] min-w-[54px] p-3 border-b"
        width={56}
        height={58}
      />
      <div className="w-full flex flex-col gap-2 pb-4">
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
          <Link
            key={id}
            href={`/company/${id}`}
            className="group flex items-center justify-center min-w-[40px] min-h-[40px] rounded-md hover:bg-[#e6e8eb] dark:hover:bg-[#2f2f2f] dark:text-[gray] overflow-hidden p-1 group"
          >
            <div className="invisible group-hover:visible absolute text-primary mt-[-30px] ml-[-30px]">
              <EditIcon size={16} />
            </div>
            <ImageRender name={name} imageUrl={companyImageUrl} />
          </Link>
        ))}
      </div>
    </div>
  );
}