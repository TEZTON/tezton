import ReactFlow, { Background, Controls } from "reactflow";
import { Methods } from "./methods";

export const Board = () => {
  const nodes = [
    {
      data: {
        text: "Etapa final",
      },
      position: {
        x: 251.63649331421135,
        y: 402.41190171321483,
      },
      _id: "64441f5ef2524d4e5649d0f0",
      type: "custom",
      status: "initialized",
    },
    {
      data: {
        text: "Etapa Teste",
      },
      position: {
        x: 70.05524196715763,
        y: 104.33559683250782,
      },
      _id: "64442181791f191a368694f4",
      type: "custom",
      status: "initialized",
    },
    {
      data: {
        text: "Etapa Desenho",
      },
      position: {
        x: 431.4199129027572,
        y: 74.75970729677661,
      },
      _id: "644421f082d6b80f26d4d0be",
      type: "custom",
      status: "initialized",
    },
    {
      data: {
        text: "Etapa Teste",
        status: "initialized",
        color: "blue",
      },
      position: {
        x: 450.9970269127853,
        y: 244.97152647882749,
      },
      _id: "644422f7151ce068a32be7a0",
      type: "custom",
      status: "initialized",
    },
    {
      data: {
        text: "Etapa integração",
        status: "deleted",
        color: "rgb(255, 123, 0)",
      },
      position: {
        x: 70.05524196715763,
        y: 304.33559683250782,
      },
      _id: "64443a5001a0abb2b52717ff",
      type: "custom",
      status: "initialized",
    },
    {
      data: {
        text: "Etapa 2",
        status: "completed",
        color: "rgb(0, 21, 255)",
      },
      position: {
        x: 70.05524196715763,
        y: 204.33559683250782,
      },
      _id: "6449520ae3b044483795b798",
      type: "custom",
      status: "initialized",
    },
  ];

  const {
    json,
    // defaultEdges,
    nodeTypes,
    edgeOptions,
    // handleAddNewNode,
    connectionLineStyle,
  } = Methods({ nodes });

  return (
    <ReactFlow
      fitView
      draggable
      defaultEdgeOptions={edgeOptions}
      nodeTypes={nodeTypes}
      nodes={json}
      connectionLineStyle={connectionLineStyle}
    >
      <Controls className="ControlButton" />
      <Background />
    </ReactFlow>
  );
};
