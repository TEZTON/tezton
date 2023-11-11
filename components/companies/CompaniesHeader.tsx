import Image from "next/image";
import { Key } from "react";

export const ResumeCompaniesHeader = ({
  company_logo,
  company_name,
  products,
}: any) => {
  function getUsers() {
    let project: any = [];
    let users: any = [];
    products.map((product: { projects: any }) =>
      project.push(product.projects)
    );
    const flatted = project.flat();
    flatted.map((project: { working_users: any }) =>
      users.push(project.working_users)
    );

    return users.flat();
  }

  const STATUS = [
    { status_name: "Sucesso" },
    { status_name: "Falhas" },
    { status_name: "Bloqueios" },
    { status_name: "Cancelados" },
  ];

  return (
    <div className="w-full h-12 bg-primary flex items-center px-3 gap-2 rounded-lg">
      <div className="w-[60%] flex justify-between">
        <div className="w-[50%] flex justify-start items-center gap-2 whitespace-nowrap overflow-hidden">
          <Image src={company_logo} alt={company_name} width={30} height={30} />
          <span className="text-base text-clip text-[#fff]">
            {company_name}
          </span>
        </div>
        <div className="w-28 flex justify-end gap-2 items-center overflow-hidden">
          {getUsers().map(
            (user: {
              user_id: Key | null | undefined;
              user_photo: string | undefined;
              user_name: string | undefined;
            }) => (
              <Image
                key={user.user_id}
                src={user.user_photo!}
                alt={user.user_name!}
                width={22}
                height={22}
              />
            )
          )}
        </div>
      </div>
      <div className="w-[40%] flex items-center justify-between">
        {STATUS.map((status: { status_name: string }) => (
          <div
            key={status.status_name}
            className="w-full flex items-center justify-center text-xs text-[#fff]"
          >
            {status.status_name}
          </div>
        ))}
      </div>
    </div>
  );
};
