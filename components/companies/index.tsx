import * as Accordion from "@radix-ui/react-accordion";
import * as Progress from "@radix-ui/react-progress";
import { useContext, useState } from "react";

import { ResumeCompaniesHeader } from "./CompaniesHeader";
import { GlobalContext } from "@/contexts/GlobalContext";
import { MOCK_USER, extractFeatureStatus } from "@/mocks/user";
import Link from "next/link";
import Image from "next/image";

export const ResumeCompanies = ({ onSelectStatus }: any) => {
  const COMPANIES = MOCK_USER.companies;

  const { setSelectedCompany } = useContext(GlobalContext);

  const productsStatus: any = extractFeatureStatus(MOCK_USER);
  const [progress] = useState(13);

  return (
    <div className="w-full">
      <Accordion.Root type="multiple" className="flex flex-col gap-2">
        {COMPANIES.map((company, idx) => (
          <Accordion.Item
            key={company.company_id}
            value={company.company_id + idx}
          >
            <Accordion.Trigger
              onClick={() => setSelectedCompany(company)}
              className="w-full"
            >
              <ResumeCompaniesHeader
                company_name={company.company_name}
                company_logo={company.company_logo}
                products={company.company_products}
                idx={idx}
              />
            </Accordion.Trigger>

            <Accordion.Content className="p-4 h-max border border-t-0 -mt-1 rounded-md border-default dark:border-defaultdark text-sm leading-normal text-blue-gray-500/80">
              {company.company_products.map((product, product_idx) => (
                <div
                  key={product.product_id}
                  className="flex w-full gap-3 mb-4"
                >
                  <div className="flex flex-col justify-center w-[59%] gap-3">
                    <Link href={`company/${company.company_id}`}>
                      <div className="flex items-center gap-3 ">
                        <Image
                          className="bg-primary rounded-md"
                          src={product.product_logo}
                          alt={product.product_name}
                          width={40}
                          height={40}
                        />
                        <span className="text-sm">{product.product_name}</span>
                      </div>
                      <Progress.Root className="w-full border border-default dark:border-defaultdark rounded-md h-2 overflow-hidden">
                        <Progress.Indicator
                          style={{
                            transform: `translateX(-${100 - progress}%)`,
                          }}
                          className="w-full h-full bg-primary transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
                        />
                      </Progress.Root>
                    </Link>
                  </div>
                  <div className="w-[40%] flex items-center justify-between">
                    {productsStatus[product?.product_name]
                      ?.map((feature: { status: any[] }) =>
                        feature.status.map((statu: any) => statu)
                      )
                      [product_idx]?.map(
                        (statusName: {
                          status_name: string;
                          value: number;
                        }) => (
                          <div
                            key={statusName.status_name}
                            onClick={() =>
                              onSelectStatus({ ...statusName, ...product })
                            }
                            className="w-full flex items-center justify-center"
                          >
                            {statusName.value}
                          </div>
                        )
                      )}
                  </div>
                </div>
              ))}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
};
