import { EditIcon, HomeIcon, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/trpc";

import Dialog from "../modal";
import UpsertProduct from "./UpsertProduct";
import ImageRender from "../ImageRender";

interface AllProductsAsideProps {
  id: string;
  name: string;
  companyImageUrl?: string | null;
}

export default function AllProductsAside({
  name,
  id,
  companyImageUrl,
}: AllProductsAsideProps) {
  const [productModal, setProductModal] = useState(false);
  const { data } = trpc.products.getProducts.useQuery({ companyId: id });

  return (
    <div className="w-14 min-w-[56px] border-r flex flex-col overflow-auto">
      <div className="p-3 border-b">
        <ImageRender
          name={name}
          width={31}
          height={31}
          imageUrl={companyImageUrl}
        />
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-2 mt-3">
        <div className="w-full flex flex-col justify-center items-center gap-2">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#e6e8eb] overflow-hidden p-1"
          >
            <HomeIcon size={16} />
          </Link>
          <Dialog
            trigger={
              <button className="btn btn-xs cursor-pointer m-auto mt-2 flex w-9 h-9">
                <PlusCircleIcon size={16} />
              </button>
            }
            open={productModal}
            setOpen={setProductModal}
          >
            <UpsertProduct
              companyId={id}
              onSuccessCallback={() => {
                setProductModal(false);
              }}
            />
          </Dialog>
        </div>
        {data?.map(({ id: productId, name }) => (
          <Link
            key={productId}
            href={`/company/${id}/product/${productId}`}
            className="group flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#e6e8eb] dark:hover:bg-[#2f2f2f] dark:text-[gray] overflow-hidden p-1 group"
          >
            <div className="invisible group-hover:visible absolute text-primary mt-[-30px] ml-[-30px]">
              <EditIcon size={16} />
            </div>
            <ImageRender name={name} />
          </Link>
        ))}
      </div>
    </div>
  );
}
