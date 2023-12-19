import { trpc } from "@/trpc";
import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  OnNodesChange,
  useNodesState,
  Node,
  NodeMouseHandler,
} from "reactflow";
import { useDebouncedCallback } from "use-debounce";

import Modal from "../modal";
import "reactflow/dist/style.css";
import UpsertDeliverableDiagramNode from "./UpsertDeliverableDiagramNode";
import UpsertDeliverableDiagramBoundry from "./UpsertDeliverableDiagramBoundry";
import BoundryNode from "./Boundry";
import { DeliverableDiagramNodeBoundrySchemaType } from "@/schema/diagrams";

interface DeliverableDiagramProps {
  deliverableId: string;
  onClick: (item: DeliverableDiagramNodeBoundrySchemaType) => void | undefined;
}

type TeztonNode = {
  type: TeztonNodeType;
};

enum TeztonNodeType {
  "NODE" = "NODE",
  "BOUNDRY" = "BOUNDRY",
}

const nodeTypes = { [TeztonNodeType.BOUNDRY]: BoundryNode };

export default function DeliverableDiagram({
  deliverableId,
  onClick,
}: DeliverableDiagramProps) {
  const [createNodeModal, setCreateNodeModal] = useState(false);
  const [createBroundyModal, setCreateBroundyModal] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<TeztonNode>([]);
  const { data: nodesData } = trpc.deliverableDiagrams.getNodes.useQuery({
    deliverableId,
  });

  const { data: boundriesData } =
    trpc.deliverableDiagrams.getBoundries.useQuery({
      deliverableId,
    });
  const updatePosition =
    trpc.deliverableDiagrams.updateNodePosition.useMutation();

  const updateBoundryPosition =
    trpc.deliverableDiagrams.updateBoundryPosition.useMutation();

  const debouncedUpdatePosition = useDebouncedCallback(
    async (value: Node<TeztonNode, string | undefined>) => {
      if (value.data.type === TeztonNodeType.NODE) {
        await updatePosition.mutateAsync({
          nodeId: value.id,
          positionX: value.positionAbsolute!.x,
          positionY: value.positionAbsolute!.y,
        });
      } else {
        await updateBoundryPosition.mutateAsync({
          nodeId: value.id,
          positionX: value.positionAbsolute!.x,
          positionY: value.positionAbsolute!.y,
        });
      }
    },
    250
  );

  const onNodeChangePosition: OnNodesChange = async (node) => {
    onNodesChange(node);

    if (node[0] && node[0].type === "position") {
      if (node[0].positionAbsolute) {
        const currentNode = node[0];
        const myNode = nodes.find((n) => n.id === currentNode.id)!;
        debouncedUpdatePosition({
          ...myNode,
          positionAbsolute: currentNode.positionAbsolute,
        });
      }
    }
  };

  useEffect(() => {
    if (nodesData && boundriesData) {
      const n = nodesData.map((node) => ({
        ...node,
        type: TeztonNodeType.NODE,
        data: { ...node.data, type: TeztonNodeType.NODE },
      }));
      const b = boundriesData.map((boundry) => ({
        ...boundry,
        type: TeztonNodeType.BOUNDRY,
        data: { ...boundry.data, type: TeztonNodeType.BOUNDRY },
      }));

      setNodes(n.concat(b));
    }
  }, [nodesData, setNodes, boundriesData, onClick]);

  const handleNodeClick = (_: MouseEvent, clickedNode: Node<TeztonNode, string | undefined>) => {
    const filteredNodes = nodes.filter((n) => n.id === clickedNode.id);
    const selectedNode = filteredNodes[0]
    onClick(selectedNode as unknown as DeliverableDiagramNodeBoundrySchemaType);
  };
  return (
    <div className="my-4 h-1/2">
      <div className="mb-4">
        <Modal
          className="!min-h-0"
          open={createNodeModal}
          setOpen={setCreateNodeModal}
          trigger={
            <button className="btn btn-xs btn-primary text-white mr-4">
              + Card
            </button>
          }
        >
          <UpsertDeliverableDiagramNode
            deliverableId={deliverableId}
            onSuccess={() => {
              setCreateNodeModal(false);
            }}
          />
        </Modal>
        <Modal
          className="!min-h-0"
          open={createBroundyModal}
          setOpen={setCreateBroundyModal}
          trigger={
            <button className="btn btn-xs btn-primary text-white mr-4">
              + Boundary
            </button>
          }
        >
          <UpsertDeliverableDiagramBoundry
            deliverableId={deliverableId}
            onSuccess={() => {
              setCreateBroundyModal(false);
            }}
          />
        </Modal>
      </div>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodeChangePosition}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick as unknown as NodeMouseHandler}
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}
