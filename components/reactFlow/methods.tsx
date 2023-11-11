import TextUpdaterNode from "../textUpdater";

const nodeTypes = {
  custom: TextUpdaterNode,
};
const edgeOptions = {
  animated: true,
  style: {
    stroke: "white",
  },
};

const connectionLineStyle = { stroke: "white" };

// let nodeId = 0;

export const Methods = ({ nodes }: any) => {
  // const { selectedFeature } = useContext(GlobalContext);

  // const { addNodes } = useReactFlow();

  // const handleAddNewNode = useCallback(
  //   async ({ text, color, status }: any) => {
  //     try {
  //       const id = `${++nodeId}`;
  //       const newNode = {
  //         id,
  //         type: "custom",
  //         status: "initialized",
  //         droggable: true,
  //         position: {
  //           x: Math.random() * 500,
  //           y: Math.random() * 500,
  //         },
  //         data: {
  //           text: text || "Etapa Teste",
  //           color: color || "blue",
  //           status: status || "initialized",
  //         },
  //       };

  //       addNodes(newNode);
  //       const { data } = await Api.put(
  //         `/environment/features/${currentFeature?._id}/ambients/${currentAmbient?._id}`,
  //         newNode
  //       );
  //       const idx = data.data[0].ambients.find(
  //         (prop: any) => prop._id === currentAmbient?._id
  //       );
  //       setCurrentAmbient(idx);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  //   [nodes, currentAmbient]
  // );

  const defaultNodes: any[] = [];
  const defaultEdges: any[] = [];

  var str: any = JSON.stringify(nodes);
  const valor = str && str.replaceAll(/\"_id\":/g, '"id":');
  const json = valor && JSON.parse(valor);

  return {
    defaultNodes,
    defaultEdges,
    // handleAddNewNode,
    nodeTypes,
    edgeOptions,
    connectionLineStyle,
    json,
  };
};
