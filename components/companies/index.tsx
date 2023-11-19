import * as Accordion from "@radix-ui/react-accordion";

import CompanyHeader from "./CompanyHeader";
import { useQuery } from "@tanstack/react-query";
import { COMPANY_KEYS, getAllowedCompanyApi } from "@/api/company";
import Link from "next/link";
import { Root, Indicator } from "@radix-ui/react-progress";
import { useRouter } from "next/navigation";
import ImageRender from "../ImageRender";

export const Companies = () => {
  const { data } = useQuery({
    queryKey: [COMPANY_KEYS.getAllowedCompanies],
    queryFn: getAllowedCompanyApi,
  });

  const { push } = useRouter();

  return (
    <div className="w-full">
      <Accordion.Root type="multiple" className="flex flex-col gap-2">
        {data?.map(({ name, id, products, companyImageUrl }) => (
          <Accordion.Item key={id} value={id}>
            <Accordion.Trigger
              className="w-full"
              onClick={() => {
                push(`/company/${id}`);
              }}
            >
              <CompanyHeader
                name={name}
                logo={name}
                products={products}
                imageUrl={companyImageUrl}
              />
            </Accordion.Trigger>

            <Accordion.Content className="p-4 h-max border border-t-0 -mt-1 rounded-md border-default dark:border-defaultdark text-sm leading-normal text-blue-gray-500/80">
              {products?.map(({ id, name }) => (
                <div key={id} className="flex w-full gap-3 mb-4">
                  <div className="flex flex-col justify-center w-[59%] gap-3">
                    <Link href={`company/${id}`}>
                      <div className="flex items-center gap-3 ">
                        <ImageRender name={name} />

                        <span className="text-sm">{name}</span>
                      </div>
                      <Root className="w-full border border-default dark:border-defaultdark rounded-md h-2 overflow-hidden">
                        <Indicator
                          style={{
                            transform: `translateX(-${80}%)`,
                          }}
                          className="w-full h-full bg-primary transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
                        />
                      </Root>
                    </Link>
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
