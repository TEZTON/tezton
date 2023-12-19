import * as Accordion from "@radix-ui/react-accordion";
import {
  PlusIcon,
  PenSquareIcon,
  TrashIcon,
  InfoIcon,
  Loader,
} from "lucide-react";

import Modal from "../modal";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ContextMenu } from "@/components/dropdownMenu";
import useDeliverables from "../deliverable/useDeliverables";

interface FunctionalityAccordionProps {
  name: string;
  functionalityId: string;
  productId: string;
  projectId: string;
  companyId: string;
}

export default function FunctionalityAccordion({
  name,
  functionalityId,
  companyId,
  productId,
  projectId,
}: FunctionalityAccordionProps) {

  const Deliverables = useDeliverables(functionalityId);

  const { functionalityId: pathFunctionalityId, deliverableId } = useParams();

  const deliverablesContexts = [
    {
      id: 1,
      label: "Editar",
      icon: PenSquareIcon,
      action: (id: any) => {
        const deliverable = Deliverables.list?.find((item) => item.id === id);
        if (deliverable) {
          Deliverables.update(deliverable);
        }
      },
    },
    {
      id: 2,
      label: "Apagar",
      icon: TrashIcon,
      action: (id: any) => {
        const deliverable = Deliverables.list?.find((item) => item.id === id);
        if (deliverable) {
          Deliverables.remove(deliverable);
        }
      },
    },
  ];

  const functionalityContexts = [
    {
      id: 0,
      label: "Criar entregável",
      icon: PlusIcon,
      action: Deliverables.create,
    },
    {
      id: 1,
      label: "Editar",
      icon: PenSquareIcon,
      action: (id: any) => {},
    },
    {
      id: 2,
      label: "Apagar",
      icon: TrashIcon,
      action: (id: any) => {
        setconfirmDeleteModal(true);
      },
    },
  ];

  return (
    <Accordion.Root
      className="bg-base-200 rounded-md"
      type="single"
      collapsible
      defaultValue={
        typeof pathFunctionalityId === "string" ? pathFunctionalityId : ""
      }
    >
      <Accordion.Item value={functionalityId}>
        <Accordion.AccordionTrigger
          onClick={(e) => e.stopPropagation()}
          className="px-1 py-2 w-full text-left flex justify-between hover:bg-gray-300"
        >
          {name}
          <ContextMenu itemId={functionalityId} items={functionalityContexts} />
        </Accordion.AccordionTrigger>
        <Accordion.AccordionContent className="pl-4 py-2 pr-1" forceMount={!Deliverables?.list?.length}>
          <div className="mt-2 flex gap-2 flex-col align-center p-1">
            {Deliverables?.list?.map(({ id, name }) => (
              <Link
                key={id}
                className={`p-1 cursor-pointer flex justify-between hover:bg-gray-300 ${
                  deliverableId === id && "bg-gray-300"
                }`}
                href={`/company/${companyId}/product/${productId}/project/${projectId}/functionality/${functionalityId}/deliverable/${id}`}
              >
                {name}
                <ContextMenu itemId={id} items={deliverablesContexts} />
              </Link>
            ))}
          </div>
          <Deliverables.Modal />
        </Accordion.AccordionContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}
