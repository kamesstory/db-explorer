import { FunctionComponent, useMemo, useState } from "react";
import { Handle, Position } from "react-flow-renderer";
import { TableColumn } from "./informationSchema";

const handleStyle = { left: 10 };

const RowNode: FunctionComponent<{ data: TableColumn }> = ({ data }) => {
  const [isHovered, setHovered] = useState(false);
  const [isSelected, setSelected] = useState(false);

  const handleVisible = useMemo(
    () => isHovered || isSelected,
    [isHovered, isSelected]
  );

  const columnName = data.name;

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Left} />
      <div>
        <span>{data.name}</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default RowNode;
