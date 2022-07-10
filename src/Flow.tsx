import { FunctionComponent, useContext, useEffect, useMemo } from "react";
import ReactFlow, {
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
} from "react-flow-renderer";
import {
  getTableNodes,
  getTableRelationNodes,
  TableContext,
} from "./TableContext";
import RowNode from "./nodes/RowNode";

const OverviewFlow = () => {
  const nodeTypes = useMemo(() => ({ rowNode: RowNode }), []);

  const { tables, relations } = useContext(TableContext);

  const [nodes, setNodes, onNodesChange] = useNodesState<{
    label: JSX.Element | string;
  }>([]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    // Probably should find a more sophisticated way to merge nodes and edges
    // from what's calculated from tables, and the edges that are manually added
    // via onConnect
    setNodes(getTableNodes(tables));
    setEdges(getTableRelationNodes(relations));
  }, [tables, relations]);

  const onConnect = (params: Connection) => setEdges((e) => addEdge(params, e));

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={(reactFlowInstance) =>
        console.log("Flow loaded:", reactFlowInstance)
      }
      fitView
      attributionPosition="top-right"
    >
      <Controls />
      <Background color="#000" gap={16} />
    </ReactFlow>
  );
};

export default OverviewFlow;
