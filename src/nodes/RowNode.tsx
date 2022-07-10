import {
  CSSProperties,
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Handle, Position } from "react-flow-renderer";
import { TableColumn, TableContext } from "../TableContext";

const RowNode: FunctionComponent<{ data: TableColumn }> = ({ data }) => {
  const [isHovered, setHovered] = useState(false);

  const { selectedColumns, setSelectedColumns } = useContext(TableContext);

  const selectColumn = useCallback(() => {
    setSelectedColumns((columns) => {
      // TODO: need uniqueness of table schemas + names + column names
      console.log(`Adding ${data.name} to the list of selected columns.`);
      return [...columns, data.name];
    });
  }, []);

  // Feels inefficient
  const isSelected = useMemo(() => {
    console.log(
      `Recalculating isSelected for column ${data.name} with ${selectedColumns}.`
    );
    return selectedColumns.includes(data.name);
  }, [selectedColumns]);

  // We probably need a context to save and track the state of the values of each node that's being used here
  // The context should take in the column data and deterministically understand the state of the graph and
  // the node.
  //
  // We're not using React Flow to manage this type of state since React Flow should only govern the state
  // related to the graph (e.g. what's connected to what, relative positions, etc.)

  const handleStyle = useMemo<CSSProperties>(() => {
    const handleVisible = isHovered || isSelected;

    return { visibility: handleVisible ? "visible" : "hidden" };
  }, [isHovered, isSelected]);

  return (
    <div className="w-96">
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <div
        className={`flex flex-row space-x-4 px-3 ${
          (isHovered || isSelected) && "bg-slate-300"
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={selectColumn}
      >
        <span className="flex-1 flex items-start">{data.name}</span>
        <span className="flex-1 flex items-start">{data.dataType}</span>
      </div>
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  );
};

export default RowNode;
