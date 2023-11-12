import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  EditIcon,
  HomeIcon,
  MoonIcon,
  Plus,
  PlusCircleIcon,
} from "lucide-react";

import { EditNameCompany } from "@/components/forms/EditCompany";
import { SubMenu } from "@/components/subMenu";
import { TopMenu } from "@/components/topMenu";
import { DeleteCompany } from "@/components/forms/DeleteCompany";
import { EditLogoCompany } from "@/components/forms/EditLogoCompany";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import { MOCK_USER } from "@/mocks/user";
import Link from "next/link";
import Image from "next/image";
import { Dialog } from "../dialog";
import { useParams } from "next/navigation";

export const AppTemplate = ({ children }: React.PropsWithChildren) => {
  const selectedCompany = useParams();
  const findSpecificCompany = MOCK_USER.companies.find(
    (company) => company.company_id === selectedCompany?.company_id
  );

  const { selectedCompany: hoverCompany } = useContext(GlobalContext);

  const FORMS = {
    edit_company: EditNameCompany,
    delete_company: DeleteCompany,
    edit_logo_company: EditLogoCompany,
  };

  return (
    <div
      className="w-screen h-screen bg-[#fff] dark:bg-[#1c1c1c] flex"
      style={{ height: "calc(0px + 100vh)", maxHeight: "calc(0px + 100vh)" }}
    >
      {/* MENU lateral esquerdo */}
      <div className="w-14 h-screen border-r bg-[#F8F9FF] dark:bg-[#1c1c1c] border-default dark:border-defaultdark flex flex-col justify-between">
        <div className="w-full flex flex-col">
          <Image
            alt="Image"
            src={findSpecificCompany?.company_logo || "/isotipo_png.png"}
            className="w-14 h-[58px] min-h-[54px] min-w-[54px] p-3 border-b border-default dark:border-defaultdark flex items-center justify-center"
            width={56}
            height={58}
          />
          <div className="w-full flex flex-col justify-center items-center gap-2 mt-3">
            <div className="w-full flex flex-col justify-center items-center gap-2 mt-3">
              <Link
                href="/"
                className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#e6e8eb] dark:hover:bg-[#2f2f2f] dark:text-[gray] overflow-hidden p-1"
              >
                <HomeIcon size={16} />
              </Link>
              <Dialog
                title={
                  selectedCompany.company_id
                    ? "Adicionar Produto"
                    : "Adicionar Empresa"
                }
                Trigger={
                  <button className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#e6e8eb] dark:hover:bg-[#2f2f2f] dark:text-[gray] overflow-hidden p-1">
                    <PlusCircleIcon size={16} />
                  </button>
                }
                Content={FORMS["edit_company"]}
              />
            </div>
            {findSpecificCompany?.company_products.map((product) => (
              <Link
                key={product.product_id}
                href={`product/${product.product_id}`}
                className="group flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#e6e8eb] dark:hover:bg-[#2f2f2f] dark:text-[gray] overflow-hidden p-1 group"
              >
                <div className="invisible group-hover:visible absolute text-primary mt-[-30px] ml-[-30px]">
                  <EditIcon size={16} />
                </div>
                <Image
                  src={product.product_logo}
                  alt={product.product_name}
                  width={30}
                  height={30}
                />
              </Link>
            )) ||
              MOCK_USER.companies.map((company) => (
                <Link
                  key={company.company_id}
                  href={`/company/${company.company_id}`}
                  className={`group flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#e6e8eb] dark:hover:bg-[#2f2f2f] dark:text-[gray] overflow-hidden p-1 group ${
                    company?.company_id === hoverCompany?.company_id &&
                    "bg-[#e6e8eb]"
                  }`}
                >
                  <div className="invisible group-hover:visible absolute text-primary mt-[-30px] ml-[-30px]">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <EditIcon size={16} />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content className="bg-foreground flex flex-col w-max max-w-[250px] gap-2 border border-default dark:border-defaultdark rounded-md overflow-hidden shadow-md drop-shadow-lg">
                        <DropdownMenu.Item className="w-full h-7 flex justify-between items-center gap-2 hover:bg-primary px-2 py-3">
                          <Plus size={20} />
                          <span className="flex justify-start w-full text-xs">
                            Criar
                          </span>
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                    {/* <Dialog
                  title={`Editar ${company.company_name}`}
                  description={`Edite a ${company.company_name}`}
                  Trigger={
                    <Settings
                    fill="rgb(150 162 242)"
                    stroke="#2f2f2f"
                    size={15}
                    />
                  }
                  Content={EditNameCompany}
                /> */}
                  </div>
                  {/* <ContextMenu /> */}
                  <Image
                    src={company.company_logo}
                    alt={company.company_name}
                    width={56}
                    height={56}
                  />
                </Link>
              ))}
          </div>
        </div>
      </div>
      {!!selectedCompany?.company_id && <SubMenu />}
      <div className="flex flex-col flex-1 w-full overflow-x-hidden">
        {/* MENU do TOPO */}
        <TopMenu />
        {/* CONTEUDO */}
        <div className="flex flex-col flex-1 w-full overflow-x-hidden p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
