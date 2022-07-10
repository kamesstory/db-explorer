import {
  CSSProperties,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Handle, Position } from "react-flow-renderer";
import { TableColumn } from "../informationSchema";

const RowNode: FunctionComponent<{ data: TableColumn }> = ({ data }) => {
  const [isHovered, setHovered] = useState(false);
  const [isSelected, setSelected] = useState(false);

  const handleStyle = useMemo<CSSProperties>(() => {
    const handleVisible = isHovered || isSelected;

    return { visibility: handleVisible ? "visible" : "hidden" };
  }, [isHovered, isSelected]);

  const startHover = useCallback(() => {
    setHovered(true);
  }, []);

  const endHover = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <div className="w-96">
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <div
        className="flex flex-row space-x-4 px-3"
        onMouseEnter={startHover}
        onMouseLeave={endHover}
      >
        <span className="flex-1 flex items-start">{data.name}</span>
        <span className="flex-1 flex items-start">{data.dataType}</span>
      </div>
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  );
};

export default RowNode;
