import { FunctionComponent } from "react";
import { NodeProps } from "reactflow";

const BoundryNode: FunctionComponent<NodeProps> = ({ data }) => {
  return (
    <div className="flex flex-col">
      <div className="bg-white py-2 px-12 border border-black rounded-sm">
        <p className="text-xs">{data.label}</p>
      </div>
      <div className="divider divider-primary divider-horizontal !h-[350px] !m-auto"></div>
    </div>
  );
};

export default BoundryNode;
