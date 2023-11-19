import { GetProductType } from "@/api/product";

import ImageRender from "../ImageRender";

interface CompanyHeaderProps {
  logo: string;
  name: string;
  products: GetProductType[];
  imageUrl?: string | null;
}

export default function CompanyHeader({
  logo,
  name,
  imageUrl,
}: CompanyHeaderProps) {
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
          <ImageRender name={logo} imageUrl={imageUrl} />
          <span className="text-base text-clip text-[#fff]">{name}</span>
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
}
