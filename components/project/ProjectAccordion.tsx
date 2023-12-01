"use client";
import * as Accordion from "@radix-ui/react-accordion";
import Modal from "../modal";
import {
  PlusIcon,
  PenSquareIcon,
  TrashIcon,
  InfoIcon,
  Loader
} from "lucide-react";
import { ContextMenu } from "@/components/dropdownMenu";
import { useState } from "react";
import UpsertFunctionality from "../functionality/UpsertFunctionality";
import FunctionalityAccordion from "../functionality/FunctionalityAccordion";
import { trpc } from "@/trpc";
import { useParams } from "next/navigation";
import UpsertProject from "./UpsertProject";
import { capitalizeFirstLetter } from "@/utils/hooks";

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
  productId
}: ProjectAccordionProps) {

  const { data } = trpc.projects.getProjects.useQuery({ productId });
  const { data: dataFunctionality } =
    trpc.functionalities.getFunctionalities.useQuery({
      projectId
    });
  const remove = trpc.projects.deleteProduct.useMutation();

  const { projectId: pathProjectId } = useParams();
  const { projects } = trpc.useUtils();
  const [projectModal, setProjectModal] = useState(false);
  const [confirmDeleteModal, setconfirmDeleteModal] = useState(false);
  const [functionalityModal, setFunctionalityModal] = useState(false);
  const [projectSelected, selectProject] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const projectsContexts = [
    {
      id: 1,
      label: "Editar",
      icon: PenSquareIcon,
      action: (id: any) => {
        const project = data?.find((item: any) => item.id === id);
        selectProject(project);
        setProjectModal(true);
      }
    },
    {
      id: 2,
      label: "Apagar",
      icon: TrashIcon,
      action: (id: any) => {
        selectProject(id);
        setconfirmDeleteModal(true);
      }
    }
  ];
  const deleteSelectedProject = async () => {
    if (projectSelected) {
      try {
        setLoading(true);
        await remove.mutateAsync({
          productId: productId,
          projectId: projectId
        });
        setLoading(false);
        setconfirmDeleteModal(false);

        await projects.getProjects.invalidate({ productId });
      } catch (error) {
        setLoading(false);
        setconfirmDeleteModal(false);
        throw new Error("Erro!");
      }
    }
  };
 const refreshPage = async () => {
    await projects.getProjects.invalidate({ productId });
    setProjectModal(false);
 };
  return (
    <Accordion.Root
      className="bg-base-200 rounded-md"
      type="single"
      collapsible
      defaultValue={typeof pathProjectId === "string" ? pathProjectId : ""}
    >
      <Modal open={projectModal} setOpen={setProjectModal}>
        <UpsertProject
          companyId={companyId}
          productId={productId}
          initialData={{ ...projectSelected }}
          onSuccess={refreshPage}
        />
      </Modal>
      <Modal open={confirmDeleteModal} setOpen={setconfirmDeleteModal}>
        <div className="bg-white p-10 align-center flex flex-col items-center">
          <InfoIcon className="" size={50} color="red" opacity={0.3} />
          <p className="font-bold mb-5">
            Excluir Projeto:{" "}
            {data?.find((item: any) => item.id === projectSelected)?.name}
          </p>
          <div className="flex flex-row gap-5">
            <button
              disabled={loading}
              className={`btn bg-rose-400 text-white hover:bg-rose-600 rounded-lg`}
              onClick={deleteSelectedProject}
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
      <Accordion.Item value={projectId}>
        <Accordion.AccordionTrigger
          className="px-1 py-2 w-full text-left flex justify-between items-center"
        >
          {capitalizeFirstLetter(name)}
          <div>
            <ContextMenu itemId={projectId} items={projectsContexts} />
          </div>
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
            {dataFunctionality?.map(({ id, name }: any) => (
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
