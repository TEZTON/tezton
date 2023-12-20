import { MoreVertical, HomeIcon, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { ProductSchemaType } from "@/schema/product";
import Link from "next/link";
import { trpc } from "@/trpc";
import Dialog from "../modal";
import UpsertProduct from "./UpsertProduct";
import ImageRender from "../ImageRender";
import { AllProductsAsideProps } from "@/utils/types";
import Tooltip from "../Tooltip";
import { useParams } from "next/navigation";

const MIN_DIMENSION_CLASS = "min-w-[40px] min-h-[40px]";
export default function AllProductsAside({
  name,
  id,
  companyImageUrl,
}: AllProductsAsideProps) {
  const [productModal, setProductModal] = useState(false);
  const { data } = trpc.products.getProducts.useQuery({ companyId: id });
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);
  const [isOpenEdit, setOpenEdit] = useState(false);
  const [contextMenuId, setContextMenuId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductSchemaType>();
  const { productId: currentProduct } = useParams();

  const handleContextMenu = (id: any) => {
    setContextMenuId(id);
    setContextMenuOpen(true);

    const selectedItem = data?.find(
      (product: ProductSchemaType) => product.id === id
    ) as ProductSchemaType | undefined;
    setSelectedProduct(selectedItem);
  };
  const closeContextMenu = () => {
    setContextMenuId(null);
    setContextMenuOpen(false);
  };

  return (
    <div className="w-14 flex flex-col border-r">
      <Dialog open={isOpenEdit} setOpen={setOpenEdit}>
        <UpsertProduct
          initialData={{
            id: selectedProduct?.id ?? "",
            name: selectedProduct?.name ?? "",
            description: selectedProduct?.description ?? "",
          }}
          companyId={id}
          onSuccessCallback={() => {
            setOpenEdit(false);
          }}
        />
      </Dialog>
      <Tooltip title={name} place="left">
        <div className="p-3 border-b">
          <ImageRender
            name={name}
            width={31}
            height={31}
            imageUrl={companyImageUrl}
          />
        </div>
      </Tooltip>
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
      </div>
      <div className="w-full flex flex-col gap-2 pb-4">
        {data?.map(({ id: productId, name }) => (
          <Tooltip key={productId} title={name} place="left">
            {productId === currentProduct && (
              <div className="h-full bg-gray-800 w-1 absolute rounded-e" />
            )}
            <div
              className={`flex items-center justify-center ${MIN_DIMENSION_CLASS} rounded-md hover:bg-gray-300 dark:text-[gray] overflow-hidden p-1 group`}
              onMouseEnter={() => handleContextMenu(productId)}
              onMouseLeave={closeContextMenu}
            >
              {isContextMenuOpen && contextMenuId === productId && (
                <MoreVertical onClick={() => setOpenEdit(!isOpenEdit)} />
              )}
              <Link
                key={productId}
                href={`/company/${id}/product/${productId}`}
              >
                <ImageRender name={name} imageUrl={companyImageUrl} />
              </Link>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
