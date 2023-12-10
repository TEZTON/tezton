import { PlusIcon } from "lucide-react";
import Modal from "../modal";
import UpsertProject from "../project/UpsertProject";
import { useState } from "react";

import ProjectAccordion from "../project/ProjectAccordion";
import { trpc } from "@/trpc";

interface ProjectFunctionalityDeliverableAreaProps {
  productId: string;
  companyId: string;
}

export default function ProjectFunctionalityDeliverableArea({
  productId,
  companyId,
}: ProjectFunctionalityDeliverableAreaProps) {
  const [projectModal, setProjectModal] = useState(false);
  const { data } = trpc.projects.getProjects.useQuery({ productId });

  return (
    <>
      <div className="w-[300px] py-2 px-4 border-r">
        <Modal
          trigger={
            <button className="btn btn-xs">
              <PlusIcon size={16} />
              Criar Projeto
            </button>
          }
          open={projectModal}
          setOpen={setProjectModal}
        >
          <UpsertProject
            companyId={companyId}
            productId={productId}
            onSuccess={() => setProjectModal(false)}
          />
        </Modal>

        <div className="gap-2 flex flex-col mt-2">
          {data?.map(({ name, id }) => (
            <ProjectAccordion
              name={name}
              key={id}
              projectId={id}
              productId={productId}
              companyId={companyId}
            />
          ))}
        </div>
      </div>
    </>
  );
}
