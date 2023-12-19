import Modal from "../modal";
import { trpc } from "@/trpc";
import { useState } from "react";
import { Loader, InfoIcon, CheckCircleIcon, XCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  DeliverableSchemaType,
  UpsertDeliverableSchema,
  UpsertDeliverableSchemaType,
} from "@/schema/deliverable";

function useDeliverables(functionalityId: string) {
  const [loading, setLoading] = useState(false);
  const { deliverables, functionalities } = trpc.useUtils();
  const [deliverableModal, setDeliverableModal] = useState(false);
  const [deliverable, setDeliverable] = useState<DeliverableSchemaType>();
  const [deliverableModalStatus, setDeliverableModalStatus] = useState<{
    title?: string;
    message?: string;
  }>({});

  const create = trpc.deliverables.createDeliverable.useMutation();
  const update = trpc.deliverables.updateDeliverable.useMutation();
  const remove = trpc.deliverables.deleteDeliverable.useMutation();
  const { data } = trpc.deliverables.getDeliverables.useQuery({
    functionalityId,
  });

  const { companyId, productId, projectId } = useParams();
  const router = useRouter();

  enum contents {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS",
  }

  type ContentKeys = keyof typeof contents;

  const [currentContent, setCurrentContent] = useState<ContentKeys>(
    contents.CREATE
  );

  const upsert = async (data: UpsertDeliverableSchemaType) => {
    setLoading(true);
    try {
      if (deliverable?.id) {
        await update.mutateAsync({ ...data, deliverableId: deliverable.id });
        await deliverables.getDeliverables.invalidate({ functionalityId });
        setCurrentContent(contents.SUCCESS);
        setDeliverableModalStatus({
          title: "Sucesso!",
          message: "Entregavel Atualizado.",
        });
        router.refresh();
      }
      if (!deliverable?.id) {
        const createdItem = await create.mutateAsync({
          ...data,
          functionalityId,
        });
        const newDeliverableUri = `/company/${companyId}/product/${productId}/project/${projectId}/functionality/${functionalityId}/deliverable/${createdItem}`;
        router.push(newDeliverableUri);

        await deliverables.getDeliverables.invalidate();
        setCurrentContent(contents.SUCCESS);
        setDeliverableModalStatus({
          title: "Sucesso!",
          message: "Entregavel Criado.",
        });
        router.refresh();
      }
    } catch (error: any) {
      setCurrentContent(contents.ERROR);
      setDeliverableModalStatus({
        title: "Erro!",
        message: error.message,
      });
    }
    setLoading(false);
  };

  const deleteDeliverable = async () => {
    if (deliverable?.id) {
      try {
        setLoading(true);
        await remove.mutateAsync({
          functionalityId,
          deliverableId: deliverable.id,
        });
        await deliverables.getDeliverables.invalidate({ functionalityId });
        // await functionalities.getFunctionalities.invalidate();
        setLoading(false);
        setDeliverableModal(false);
        const newDeliverableUri = `/company/${companyId}/product/${productId}/project/${projectId}`;
        router.replace(newDeliverableUri);
      } catch (error: any) {
        setLoading(false);
        setCurrentContent(contents.ERROR);
        setDeliverableModalStatus({
          title: "Erro!",
          message: error.mesage,
        });
      }
    }
  };

  const Form = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<UpsertDeliverableSchemaType>({
      defaultValues: {
        name: deliverable?.name || "",
        functionalityId: functionalityId,
        description: deliverable?.description || "",
      },
      resolver: zodResolver(UpsertDeliverableSchema),
    });
    const getError = () => {
      return errors.name?.message || errors.root?.message;
    };
    return (
      <form
        className="w-full flex flex-col gap-5"
        onSubmit={handleSubmit(upsert)}
      >
        {getError() && <div className="text-error text-xs">{getError()}</div>}
        <input
          type="text"
          placeholder="Nome da entrega"
          {...register("name")}
          className="input input-sm input-bordered input-primary"
        />

        <input
          type="text"
          placeholder="Descrição "
          {...register("description")}
          className="input input-sm input-bordered input-primary"
        />

        <button
          disabled={loading}
          className={`btn btn-primary text-white`}
          type="submit"
        >
          Salvar {loading && <Loader />}
        </button>
      </form>
    );
  };

  const CreateContent = () => (
    <div className="bg-white p-6">
      <p className="font-bold mb-5">Adicionar Entregavel</p>
      <Form />
    </div>
  );

  const UpdateContent = () => (
    <div className="bg-white p-6">
      <p className="font-bold mb-5">Atualizar Entregavel</p>
      <Form />
    </div>
  );

  const DeleteContent = () => (
    <div className="bg-white p-10 align-center flex flex-col items-center">
      <InfoIcon className="" size={50} color="red" opacity={0.3} />
      <p className="font-bold mb-5">Excluir entregavel: {deliverable?.name}</p>
      <div className="flex flex-row gap-5">
        <button
          disabled={loading}
          className={`btn bg-rose-400 text-white hover:bg-rose-600 rounded-lg`}
          onClick={deleteDeliverable}
        >
          Excluir {loading && <Loader />}
        </button>
        <button
          className={`btn bg-sky-600 text-white hover:bg-sky-500 rounded-lg`}
          onClick={() => setDeliverableModal(false)}
        >
          Cancelar
        </button>
      </div>
    </div>
  );

  const ErrorContent = () => (
    <div className="bg-white p-6 flex flex-col justify-items-center">
      <XCircle size={100} color="#FF9999" className="self-center" />
      <p className="font-bold mb-5 mt-5 self-center">
        {deliverableModalStatus?.message}
      </p>
    </div>
  );

  const SuccessContent = () => (
    <div className="bg-white p-6 flex flex-col justify-items-center">
      <CheckCircleIcon size={100} color="#99FF99" className="self-center" />
      <p className="font-bold mb-5 mt-5 self-center">
        {deliverableModalStatus?.message}
      </p>
    </div>
  );

  const modalContents = {
    CREATE: CreateContent,
    UPDATE: UpdateContent,
    DELETE: DeleteContent,
    ERROR: ErrorContent,
    SUCCESS: SuccessContent,
  };

  const DeliverableModal = () => {
    const ModalContent = modalContents[currentContent];
    return (
      <Modal open={deliverableModal} setOpen={setDeliverableModal}>
        <ModalContent />
      </Modal>
    );
  };

  return {
    Modal: DeliverableModal,
    list: data,
    create: () => {
      setDeliverable({} as DeliverableSchemaType);
      setCurrentContent(contents.CREATE);
      setDeliverableModal(true);
    },
    update: (data: DeliverableSchemaType) => {
      setDeliverable(data);
      setCurrentContent(contents.UPDATE);
      setDeliverableModal(true);
    },
    remove: (data: DeliverableSchemaType) => {
      setDeliverable(data);
      setCurrentContent(contents.DELETE);
      setDeliverableModal(true);
    },
  };
}

export default useDeliverables;
