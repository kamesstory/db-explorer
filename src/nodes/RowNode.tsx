import { CSSProperties, FunctionComponent, useMemo, useState } from "react";
import { Handle, Position } from "react-flow-renderer";
import { TableColumn } from "../informationSchema";
import "./RowNode.css";

const RowNode: FunctionComponent<{ data: TableColumn }> = ({ data }) => {
  const [isHovered, setHovered] = useState(false);
  const [isSelected, setSelected] = useState(false);

  const handleStyle = useMemo<CSSProperties>(() => {
    const handleVisible = isHovered || isSelected;

    return { visibility: handleVisible ? "visible" : "hidden" };
  }, [isHovered, isSelected]);

  return (
    <div className="row-node-container">
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <div className="row-node-row">
        <span className="row-node-name">{data.name}</span>
        <span className="row-node-data-type">{data.dataType}</span>
      </div>
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  );
};

export default RowNode;
