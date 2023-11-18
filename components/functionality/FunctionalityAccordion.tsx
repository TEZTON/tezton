import * as Accordion from "@radix-ui/react-accordion";
import Modal from "../modal";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import UpsertFunctionality from "../forms/UpsertFunctionality";
import { useQuery } from "@tanstack/react-query";
import { DELIVERABLE_KEYS, getDeliverablesApi } from "@/api/deliverable";
import UpsertDeliverable from "../forms/UpsertDeliverable";

interface FunctionalityAccordionProps {
  name: string;
  id: string;
}

export default function FunctionalityAccordion({
  name,
  id,
}: FunctionalityAccordionProps) {
  const [deliverableModal, setDeliverableModal] = useState(false);
  const { data } = useQuery({
    queryKey: [DELIVERABLE_KEYS.getDeliverables, id],
    queryFn: () => getDeliverablesApi(id),
  });

  return (
    <Accordion.Root
      className="bg-base-200 rounded-md"
      type="single"
      collapsible
    >
      <Accordion.Item value="item-1">
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
              functionalityId={id}
              onSuccess={() => setDeliverableModal(false)}
            />
          </Modal>
          <div className="mt-2 flex gap-2 flex-col">
            {data?.map(({ id, name }) => (
              <div className="cursor-pointer" key={id}>
                {name}
              </div>
            ))}
          </div>
        </Accordion.AccordionContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}
