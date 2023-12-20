import Modal from "../modal";
import { trpc } from "@/trpc";
import { useState } from "react";
import { Loader, InfoIcon, CheckCircleIcon, XCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  FunctionalitySchemaType,
  UpsertFunctionalitySchema,
  UpsertFunctionalitySchemaType,
} from "@/schema/functionality";

function useFunctionality(projectId: string) {
  const [loading, setLoading] = useState(false);
  const { functionalities } = trpc.useUtils();
  const [functionalityModal, setFunctionalityModal] = useState(false);
  const [functionality, setFunctionality] = useState<FunctionalitySchemaType>();
  const [functionalityModalStatus, setFunctionalityModalStatus] = useState<{
    title?: string;
    message?: string;
  }>({});

  const create = trpc.functionalities.createFunctionality.useMutation();
  const update = trpc.functionalities.updateFunctionality.useMutation();
  const remove = trpc.functionalities.deleteFunctionality.useMutation();
  const { data } = trpc.functionalities.getFunctionalities.useQuery({
    projectId,
  });

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

  const upsert = async (data: UpsertFunctionalitySchemaType) => {
    setLoading(true);
    try {
      if (functionality?.id) {
        await update.mutateAsync({
          ...data,
          functionalityId: functionality.id,
        });
        await functionalities.getFunctionalities.invalidate({ projectId });
        setCurrentContent(contents.SUCCESS);
        setFunctionalityModalStatus({
          title: "Sucesso!",
          message: "Funcionalidade Atualizada.",
        });
        router.refresh();
      }
      if (!functionality?.id) {
        const createdItem = await create.mutateAsync({
          ...data,
          projectId,
        });
        await functionalities.getFunctionalities.invalidate({ projectId });
        setCurrentContent(contents.SUCCESS);
        setFunctionalityModalStatus({
          title: "Sucesso!",
          message: "Funcionalidade Criada.",
        });
        router.refresh();
      }
    } catch (error: any) {
      setCurrentContent(contents.ERROR);
      setFunctionalityModalStatus({
        title: "Erro!",
        message: error.message,
      });
    }
    setLoading(false);
  };

  const deleteFunctionality = async () => {
    if (functionality?.id) {
      try {
        setLoading(true);

        await remove.mutateAsync({
          projectId,
          functionalityId: functionality.id,
        });
        await functionalities.getFunctionalities.invalidate({ projectId });
        setLoading(false);
        setFunctionalityModal(false);

        router.refresh();
      } catch (error: any) {
        setLoading(false);
        setCurrentContent(contents.ERROR);
        setFunctionalityModalStatus({
          title: "Erro!",
          message: error.message,
        });
      }
    }
  };

  const Form = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<UpsertFunctionalitySchemaType>({
      defaultValues: {
        projectId,
        name: functionality?.name || "",
        description: functionality?.description || "",
      },
      resolver: zodResolver(UpsertFunctionalitySchema),
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
          {...register("name")}
          placeholder="Nome da funcionalidade"
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
      <p className="font-bold mb-5">Adicionar Funcionalidade</p>
      <Form />
    </div>
  );

  const UpdateContent = () => (
    <div className="bg-white p-6">
      <p className="font-bold mb-5">Atualizar Funcionalidade</p>
      <Form />
    </div>
  );

  const DeleteContent = () => (
    <div className="bg-white p-10 align-center flex flex-col items-center">
      <InfoIcon className="" size={50} color="red" opacity={0.3} />
      <p className="font-bold mb-5">
        Excluir funcionalidade: {functionality?.name}
      </p>
      <div className="flex flex-row gap-5">
        <button
          disabled={loading}
          className={`btn bg-rose-400 text-white hover:bg-rose-600 rounded-lg`}
          onClick={deleteFunctionality}
        >
          Excluir {loading && <Loader />}
        </button>
        <button
          className={`btn bg-sky-600 text-white hover:bg-sky-500 rounded-lg`}
          onClick={() => setFunctionalityModal(false)}
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
        {functionalityModalStatus?.title}
      </p>
      <p className="font-regular mb-5 mt-5 self-center text-center">
        {functionalityModalStatus?.message}
      </p>
    </div>
  );

  const SuccessContent = () => (
    <div className="bg-white p-6 flex flex-col justify-items-center">
      <CheckCircleIcon size={100} color="#99FF99" className="self-center" />
      <p className="font-bold mb-5 mt-5 self-center">
        {functionalityModalStatus?.title}
      </p>
      <p className="font-regular mb-5 mt-5 self-center text-center">
        {functionalityModalStatus?.message}
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

  const FunctionalityModal = () => {
    const ModalContent = modalContents[currentContent];
    return (
      <Modal open={functionalityModal} setOpen={setFunctionalityModal}>
        <ModalContent />
      </Modal>
    );
  };

  return {
    Modal: FunctionalityModal,
    list: data,
    create: () => {
      setFunctionality({} as FunctionalitySchemaType);
      setCurrentContent(contents.CREATE);
      setFunctionalityModal(true);
    },
    update: (data: FunctionalitySchemaType) => {
      setFunctionality(data);
      setCurrentContent(contents.UPDATE);
      setFunctionalityModal(true);
    },
    remove: (data: FunctionalitySchemaType, hasDeliverables: boolean) => {
      if (hasDeliverables) {
        setFunctionalityModalStatus({
          title: "Erro!",
          message:
            "Não é possivel excluir funcionalidades que possuem entregaveis!",
        });
        setCurrentContent(contents.ERROR);
        setFunctionalityModal(true);
        return;
      }
      setFunctionality(data);
      setCurrentContent(contents.DELETE);
      setFunctionalityModal(true);
    },
  };
}

export default useFunctionality;
