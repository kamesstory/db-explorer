import {
  CSSProperties,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Handle, Position } from "react-flow-renderer";
import { TableColumn } from "../TableContext";

const RowNode: FunctionComponent<{ data: TableColumn }> = ({ data }) => {
  const [isHovered, setHovered] = useState(false);
  const [isSelected, setSelected] = useState(false);

  const handleStyle = useMemo<CSSProperties>(() => {
    const handleVisible = isHovered || isSelected;

    return { visibility: handleVisible ? "visible" : "hidden" };
  }, [isHovered, isSelected]);

  // We probably need a context to save and track the state of the values of each node that's being used here
  // The context should take in the column data and deterministically understand the state of the graph and
  // the node.
  //
  // We're not using React Flow to manage this type of state since React Flow should only govern the state
  // related to the graph (e.g. what's connected to what, relative positions, etc.)

  return (
    <div className="w-96">
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <div
        className={`flex flex-row space-x-4 px-3 ${
          (isHovered || isSelected) && "bg-slate-300"
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setSelected(!isSelected)}
      >
        <span className="flex-1 flex items-start">{data.name}</span>
        <span className="flex-1 flex items-start">{data.dataType}</span>
      </div>
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  );
};

export default RowNode;
