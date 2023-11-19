import * as Accordion from "@radix-ui/react-accordion";
import Modal from "../modal";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import UpsertFunctionality from "../forms/UpsertFunctionality";
import FunctionalityAccordion from "../functionality/FunctionalityAccordion";
import { trpc } from "@/trpc";

interface ProjectAccordionProps {
  name: string;
  id: string;
}

export default function ProjectAccordion({ name, id }: ProjectAccordionProps) {
  const [functionalityModal, setFunctionalityModal] = useState(false);
  const { data } = trpc.functionalities.getFunctionalities.useQuery({
    projectId: id,
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
                Criar funcionalidade
              </button>
            }
            open={functionalityModal}
            setOpen={setFunctionalityModal}
          >
            <UpsertFunctionality
              projectId={id}
              onSuccess={() => setFunctionalityModal(false)}
            />
          </Modal>
          <div className="mt-2 flex gap-2 flex-col">
            {data?.map(({ id, name }) => (
              <FunctionalityAccordion key={id} id={id} name={name} />
            ))}
          </div>
        </Accordion.AccordionContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}
