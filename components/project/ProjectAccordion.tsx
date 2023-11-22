"use client";
import * as Accordion from "@radix-ui/react-accordion";
import Modal from "../modal";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import UpsertFunctionality from "../functionality/UpsertFunctionality";
import FunctionalityAccordion from "../functionality/FunctionalityAccordion";
import { trpc } from "@/trpc";
import { useParams, usePathname } from "next/navigation";

interface ProjectAccordionProps {
  name: string;
  projectId: string;
  companyId: string;
  productId: string;
}

export default function ProjectAccordion({
  name,
  projectId,
  companyId,
  productId,
}: ProjectAccordionProps) {
  const [functionalityModal, setFunctionalityModal] = useState(false);
  const { data } = trpc.functionalities.getFunctionalities.useQuery({
    projectId,
  });
  const { projectId: pathProjectId } = useParams();

  return (
    <Accordion.Root
      className="bg-base-200 rounded-md"
      type="single"
      collapsible
      defaultValue={typeof pathProjectId === "string" ? pathProjectId : ""}
    >
      <Accordion.Item value={projectId}>
        <Accordion.AccordionTrigger className="px-1 py-2 w-full text-left">
          {name}
        </Accordion.AccordionTrigger>
        <Accordion.AccordionContent className="pl-4 py-2 pr-1">
          <Modal
            trigger={
              <button className="btn btn-xs">
                <PlusIcon size={16} />
                Criar funcionalidade
              </button>
            }
            open={functionalityModal}
            setOpen={setFunctionalityModal}
          >
            <UpsertFunctionality
              projectId={projectId}
              onSuccess={() => setFunctionalityModal(false)}
            />
          </Modal>
          <div className="mt-2 flex gap-2 flex-col">
            {data?.map(({ id, name }) => (
              <FunctionalityAccordion
                key={id}
                functionalityId={id}
                name={name}
                companyId={companyId}
                productId={productId}
                projectId={projectId}
              />
            ))}
          </div>
        </Accordion.AccordionContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}
