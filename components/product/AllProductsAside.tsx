import { MoreVertical, HomeIcon, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/trpc";
import Dialog from "../modal";
import UpsertProduct from "./UpsertProduct";
import ImageRender from "../ImageRender";
import { id } from "date-fns/locale";
interface AllProductsAsideProps {
  id: string;
  name: string;
  companyImageUrl?: string | null;
}
const MIN_DIMENSION_CLASS = "min-w-[40px] min-h-[40px]";
export default function AllProductsAside({
  name,
  id,
  companyImageUrl
}: AllProductsAsideProps) {
  const [productModal, setProductModal] = useState(false);
  const { data } = trpc.products.getProducts.useQuery({ companyId: id });
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);
  const [isOpenEdit, setOpenEdit] = useState(false);
  const [contextMenuId, setContextMenuId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleContextMenu = (id: any) => {
    setContextMenuId(id);
    setContextMenuOpen(true);

    const selectedItem = data?.find((product: any) => product.id === id);
    setSelectedProduct(selectedItem);
  };
  console.log(selectedProduct, "teste");
  const closeContextMenu = () => {
    setContextMenuId(null);
    setContextMenuOpen(false);
  };

  return (
    <div className="w-14 min-w-[56px] border-r flex flex-col overflow-auto">
      <Dialog open={isOpenEdit} setOpen={setOpenEdit}>
        <UpsertProduct
          initialData={{ ...selectedProduct }}
          companyId={id}
          onSuccessCallback={() => {
            setOpenEdit(false);
          }}
        />
      </Dialog>
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
        {data?.map(({ id, name }) => (
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
