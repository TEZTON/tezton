import * as Accordion from "@radix-ui/react-accordion";
import { useContext } from "react";

import { GlobalContext } from "@/contexts/GlobalContext";

import { ContextMenu } from "../dropdownMenu";
import { MOCK_USER } from "@/mocks/user";
import { useParams, useRouter } from "next/navigation";

export const SubMenu = () => {
  const { setSelectedFeature }: any = useContext(GlobalContext);
  const { company_id, delivery_id } = useParams();

  const r = useRouter();

  const FIND_SPECIFIC_COMPANY = MOCK_USER.companies.find(
    (company) => company.company_id === company_id
  );
  const PROJECTS_OF_SPECIFIC_COMPANY = FIND_SPECIFIC_COMPANY?.company_products
    .map((products) => products.projects)
    .flat();

  // const find = FIND_SPECIFIC_COMPANY?.company_products.find(p => p.projects.includes())

  return (
    <div className="hide-scrollbar flex w-max min-w-[150px] max-w-[255px] flex-col border-r border-default dark:border-defaultdark bg-[#F8F9FF] dark:bg-[#1c1c1c]">
      <div className="w-full h-[58px] border-b-default border-b dark:border-b-defaultdark flex items-center justify-center">
        <span className="text-xs font-thin">Projetos</span>
      </div>
      <div className="flex w-full flex-col">
        <Accordion.Root type="multiple">
          {PROJECTS_OF_SPECIFIC_COMPANY?.map(
            (project) =>
              project && (
                <Accordion.AccordionItem
                  key={project.project_id}
                  value={`project-item-${project.project_id}`}
                >
                  <Accordion.AccordionTrigger className="bg-foreground text-[#000] dark:text-[#fff] dark:bg-darkForeground border-b border-default dark:border-defaultdark w-full h-12 flex items-center justify-between gap-1 p-2 hover:bg-primary">
                    <span className="text-sm w-[90%] flex justify-start gap-2 whitespace-nowrap truncate text-ellipsis overflow-hidden ml-1">
                      {project.project_name}
                    </span>
                    <ContextMenu />
                  </Accordion.AccordionTrigger>
                  {/* {console.log(
                    FIND_SPECIFIC_COMPANY?.company_products
                      .map((p) =>
                        p.projects.find(
                          (pr) => pr.project_id === project.project_id
                        )
                      )
                      .flat()
                  )} */}
                  <Accordion.AccordionContent>
                    {project.features?.map((feature) => (
                      <Accordion.AccordionItem
                        key={feature.feature_id}
                        value={`feature-item-${feature.feature_id}`}
                      >
                        <Accordion.Trigger
                          className="bg-foreground text-[#000] dark:text-[#fff] dark:bg-darkForeground border-b border-default dark:border-defaultdark h-12 flex items-center justify-between p-2 w-full pl-6 hover:bg-primary"
                          onClick={() => setSelectedFeature(feature)}
                        >
                          <span className="text-xs w-[90%] flex justify-start whitespace-nowrap truncate text-ellipsis overflow-hidden items-center gap-2">
                            {feature.feature_name}
                          </span>
                          <ContextMenu />
                        </Accordion.Trigger>
                        <Accordion.Content className="flex flex-col pl-1">
                          {feature.deliveries?.map((delivery) => (
                            <Accordion.Item
                              key={delivery.delivery_id}
                              value={`delivery-item-${delivery.delivery_id}`}
                            >
                              <Accordion.Trigger
                                onClick={() =>
                                  r.push(
                                    delivery_id
                                      ? ""
                                      : `delivery/${delivery.delivery_id}`
                                  )
                                }
                                className="bg-foreground text-[#000] dark:text-[#fff] dark:bg-darkForeground h-7 flex items-center justify-between p-2 w-full pl-5 rounded-sm hover:bg-primary mt-1 mb-1"
                              >
                                <span className="text-xs w-full flex justify-start whitespace-nowrap truncate text-ellipsis overflow-hidden">
                                  {delivery.delivery_name}
                                </span>
                                <ContextMenu />
                              </Accordion.Trigger>
                            </Accordion.Item>
                          ))}
                        </Accordion.Content>
                      </Accordion.AccordionItem>
                    ))}
                  </Accordion.AccordionContent>
                </Accordion.AccordionItem>
              )
          )}
        </Accordion.Root>
      </div>
    </div>
  );
};
