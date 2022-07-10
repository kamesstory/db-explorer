import { FunctionComponent } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
} from "react-flow-renderer";
import { getTableNodes, getTableRelationNodes } from "./informationSchema";

const OverviewFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<{
    label: JSX.Element | string;
  }>(getTableNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    getTableRelationNodes()
  );
  const onConnect = (params: Connection) =>
    setEdges((eds) => addEdge(params, eds));

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={(reactFlowInstance) =>
        console.log("flow loaded:", reactFlowInstance)
      }
      fitView
      attributionPosition="top-right"
    >
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default OverviewFlow;
