import { PlusIcon } from "lucide-react";
import Modal from "../modal";
import UpsertProject from "../forms/UpsertProject";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PROJECT_KEYS, getProjectsApi } from "@/api/project";

interface ProjectFunctionalityDeliverableAreaProps {
  productId: string;
}

export default function ProjectFunctionalityDeliverableArea({
  productId,
}: ProjectFunctionalityDeliverableAreaProps) {
  const [projectModal, setProjectModal] = useState(false);
  const { data } = useQuery({
    queryKey: [PROJECT_KEYS.getProjects],
    queryFn: () => getProjectsApi(productId),
  });
  return (
    <>
      <div className="min-w-[300px] py-2 px-4 border-r">
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
            productId={productId}
            onSuccess={() => setProjectModal(false)}
          />
        </Modal>

        <div>
          {data?.map(({ name, id }) => (
            <div key={id}>{name}</div>
          ))}
        </div>
      </div>
    </>
  );
}
