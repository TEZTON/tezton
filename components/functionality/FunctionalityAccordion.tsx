import * as Accordion from "@radix-ui/react-accordion";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/trpc";

import Modal from "../modal";
import UpsertDeliverable from "../forms/UpsertDeliverable";
import Link from "next/link";
import { useParams } from "next/navigation";

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
  const [deliverableModal, setDeliverableModal] = useState(false);
  const { data } = trpc.deliverables.getDeliverables.useQuery({
    functionalityId,
  });

  const { functionalityId: pathFunctionalityId } = useParams();

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
        <Accordion.AccordionTrigger className="px-1 py-2 w-full text-left">
          {name}
        </Accordion.AccordionTrigger>
        <Accordion.AccordionContent className="pl-4 py-2 pr-1">
          <Modal
            trigger={
              <button className="btn btn-xs">
                <PlusIcon size={16} />
                Criar entregável
              </button>
            }
            open={deliverableModal}
            setOpen={setDeliverableModal}
          >
            <UpsertDeliverable
              functionalityId={functionalityId}
              onSuccess={() => setDeliverableModal(false)}
            />
          </Modal>
          <div className="mt-2 flex gap-2 flex-col">
            {data?.map(({ id, name }) => (
              <Link
                className="cursor-pointer"
                key={id}
                href={`/company/${companyId}/product/${productId}/project/${projectId}/functionality/${functionalityId}/deliverable/${id}`}
              >
                {name}
              </Link>
            ))}
          </div>
        </Accordion.AccordionContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}
