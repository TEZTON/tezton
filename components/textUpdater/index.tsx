import {
  ActivitySquare,
  CheckCheckIcon,
  DeleteIcon,
  ListStartIcon,
  PanelTopInactive,
} from "lucide-react";
import { memo, useCallback, useState } from "react";

import { Handle, NodeProps, Position } from "reactflow";

function TextUpdaterNode({
  data,
  isConnectable,
  targetPosition = Position.Top,
}: // sourcePosition = Position.Bottom,
NodeProps) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  console.log(data);

  const status_icons = [
    { icon: <ActivitySquare size={13} />, value: "active" },
    { icon: <DeleteIcon size={13} />, value: "deleted" },
    { icon: <CheckCheckIcon size={13} />, value: "completed" },
    { icon: <ListStartIcon size={13} />, value: "initialized" },
    { icon: <PanelTopInactive size={13} />, value: "inactive" },
  ];

  let idx =
    data?.status &&
    status_icons.findIndex((icon) => icon.value === data?.status);

  const [currentIcon, setCurrentIcon] = useState(status_icons[idx || 0]);

  return (
    <>
      <Handle
        type="target"
        position={targetPosition}
        isConnectable={isConnectable}
        onChange={onChange}
      />
      <div className="w-[150px] h-16 rounded bg-[#fff] flex items-center justify-center">
        <div className="group hidden w-max justify-center items-center gap-[2%] rounded bg-foreground p-1 hover:flex">
          {status_icons.map((status) => (
            <button
              className="border-none bg-[transparent] w-max h-max p-[1px] cursor-pointer flex items-center justify-center hover:bg-primary"
              onClick={() => setCurrentIcon(status)}
              key={status.value}
            >
              {status.icon || "a"}
            </button>
          ))}
        </div>
        <div className="group-hover:visible absolute top-0 right-0 text-primary">
          {currentIcon?.icon || "b"}
        </div>
        <span className="text-xs text-[#000]">{data?.text}</span>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" />
    </>
  );
}

TextUpdaterNode.displayName = "CustomNode";

export default memo(TextUpdaterNode);
