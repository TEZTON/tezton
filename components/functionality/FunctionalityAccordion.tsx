import * as Accordion from "@radix-ui/react-accordion";
import {
  PlusIcon,
  PenSquareIcon,
  TrashIcon,
  InfoIcon,
  Loader,
} from "lucide-react";
import { useState } from "react";
import { trpc } from "@/trpc";

import Modal from "../modal";
import Link from "next/link";
import { ContextMenu } from "@/components/dropdownMenu";
import UpsertDeliverable from "../forms/UpsertDeliverable";
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
  const [deliverableSelected, selectDeliverable] = useState<any>();
  const [confirmDeleteModal, setconfirmDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data } = trpc.deliverables.getDeliverables.useQuery({
    functionalityId,
  });

  const { functionalityId: pathFunctionalityId, deliverableId } = useParams();
  const { deliverables } = trpc.useUtils();
  const remove = trpc.deliverables.deleteDeliverable.useMutation();

  const createDeliverable = () => {
    selectDeliverable("");
    setDeliverableModal(!deliverableModal);
  };

  const deleteSelectedDeliverable = async () => {
    if (deliverableSelected) {
      try {
        setLoading(true);
        await remove.mutateAsync({
          functionalityId,
          deliverableId: deliverableSelected,
        });
        await deliverables.getDeliverables.invalidate({ functionalityId });
        setLoading(false);
        setconfirmDeleteModal(false);
      } catch (error) {
        setLoading(false);
        setconfirmDeleteModal(false);
        throw new Error("Erro!");
      }
    }
  };

  const deliverablesContexts = [
    {
      id: 1,
      label: "Editar",
      icon: PenSquareIcon,
      action: (id: any) => {
        const deliverable = data?.find((item) => item.id === id);
        selectDeliverable(deliverable);
        setDeliverableModal(true);
      },
    },
    {
      id: 2,
      label: "Apagar",
      icon: TrashIcon,
      action: (id: any) => {
        selectDeliverable(id);
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
            setOpen={createDeliverable}
          >
            <UpsertDeliverable
              functionalityId={functionalityId}
              deliverable={deliverableSelected}
              onSuccess={() => setDeliverableModal(false)}
            />
          </Modal>
          <Modal open={confirmDeleteModal} setOpen={setconfirmDeleteModal}>
            <div className="bg-white p-10 align-center flex flex-col items-center">
              <InfoIcon className="" size={50} color="red" opacity={0.3} />
              <p className="font-bold mb-5">
                Excluir Entregavel:{" "}
                {data?.find((item) => item.id === deliverableSelected)?.name}
              </p>
              <div className="flex flex-row gap-5">
                <button
                  disabled={loading}
                  className={`btn bg-rose-400 text-white hover:bg-rose-600 rounded-lg`}
                  onClick={deleteSelectedDeliverable}
                >
                  Excluir {loading && <Loader />}
                </button>
                <button
                  className={`btn bg-sky-600 text-white hover:bg-sky-500 rounded-lg`}
                  onClick={() => {
                    setconfirmDeleteModal(false);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </Modal>
          <div className="mt-2 flex gap-2 flex-col align-center">
            {data?.map(({ id, name }) => (
              <Link
                key={id}
                className={`cursor-pointer flex justify-between hover:bg-gray-300 ${
                  deliverableId === id && "bg-gray-300"
                }`}
                href={`/company/${companyId}/product/${productId}/project/${projectId}/functionality/${functionalityId}/deliverable/${id}`}
              >
                {name}
                <ContextMenu itemId={id} items={deliverablesContexts} />
              </Link>
            ))}
          </div>
        </Accordion.AccordionContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}
