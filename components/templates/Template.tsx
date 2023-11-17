import { EditIcon, HomeIcon, PlusCircleIcon } from "lucide-react";

import { EditNameCompany } from "@/components/forms/UpsertCompany";
import { SubMenu } from "@/components/subMenu";
import { TopMenu } from "@/components/topMenu";
import { DeleteCompany } from "@/components/forms/DeleteCompany";
import { EditLogoCompany } from "@/components/forms/EditLogoCompany";
import Link from "next/link";
import Image from "next/image";
import { Dialog } from "../dialog";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { COMPANY_KEYS, getAllCompanyApi } from "@/api/company";
import FakePicture from "../FakePicture";

export const AppTemplate = ({ children }: React.PropsWithChildren) => {
  const selectedCompany = useParams();
  const { data } = useQuery({
    queryKey: [COMPANY_KEYS.getAllCompanies],
    queryFn: getAllCompanyApi,
  });

  const FORMS = {
    edit_company: EditNameCompany,
    delete_company: DeleteCompany,
    edit_logo_company: EditLogoCompany,
  };

  return (
    <div className="bg-[#fff] dark:bg-[#1c1c1c] flex">
      <div className="w-14 border-r flex flex-col justify-between overflow-auto">
        <div className="w-full flex flex-col">
          <Image
            alt="Image"
            src="/isotipo_png.png"
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
      </div>

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
