import { FunctionComponent, useContext, useEffect, useMemo } from "react";
import ReactFlow, {
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  Position,
  Edge,
} from "react-flow-renderer";
import { TableContext, TableRelation, TableSchema } from "./TableContext";
import RowNode from "./nodes/RowNode";

export const getTableNodes = (tables: TableSchema[]): Node[] => {
  const tableNodes = tables.flatMap<Node>((table, index) => {
    const tableNode: Node = {
      id: table.name,
      data: {
        label: table.name,
      },
      position: { x: (index + 1) * 700, y: 100 }, // TODO: calculate position in a better way,
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      style: {
        height: `${(table.columns.length + 1) * 40}px`,
        width: "500px",
      },
    };

    const columnNodes = table.columns.map<Node>((column, index) => ({
      id: `${table.name}.${column.name}`,
      type: "rowNode",
      data: column,
      position: { x: 25, y: (index + 1) * 40 },
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      parentNode: table.name,
      draggable: false,
    }));

    return [tableNode, ...columnNodes];
  });

  return tableNodes;
};

export const getTableRelationNodes = (
  tableRelations: TableRelation[]
): Edge[] => {
  const relationshipNodes = tableRelations.map<Edge>((relation) => ({
    id: `relation.${relation.tableName}.to.${relation.foreignTableName}`,
    source: relation.tableName,
    target: relation.foreignTableName,
    animated: true,
    label: "Default relationship",
    zIndex: 9999,
  }));

  return relationshipNodes;
};

const OverviewFlow = () => {
  const nodeTypes = useMemo(() => ({ rowNode: RowNode }), []);

  const { tables, relations } = useContext(TableContext);

  const [nodes, setNodes, onNodesChange] = useNodesState<{
    label: JSX.Element | string;
  }>([]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Probably should find a more sophisticated way to merge nodes and edges
  // from what's calculated from tables, and the edges that are manually added
  // via onConnect
  useEffect(() => {
    setNodes(getTableNodes(tables));
  }, [tables]);

  useEffect(() => {
    setEdges(getTableRelationNodes(relations));
  }, [relations]);

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
