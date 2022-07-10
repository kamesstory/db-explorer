import {
  createContext,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Edge, Node, Position } from "react-flow-renderer";
import { getTables, getTableRelations } from "./InitialElements";

export type TableRelation = {
  tableName: string;
  columnName: string;
  foreignTableName: string;
  foreignColumnName: string;
};

export type TableSchema = {
  name: string;
  columns: TableColumn[];
};

export type TableColumn = {
  dataType: string; // Should be enum of some kind
  name: string;
  isNullable?: boolean;
};

export const TableContextProvider: FunctionComponent<{
  children: JSX.Element;
}> = ({ children }) => {
  const [tables, setTables] = useState<TableSchema[]>([]);
  const [relations, setRelations] = useState<TableRelation[]>([]);

  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [createdRelations, setCreatedRelations] = useState<string[]>([]);

  useEffect(() => {
    setTables(getTables());
    setRelations(getTableRelations());
  }, []);

  return (
    <TableContext.Provider
      value={{
        tables,
        relations,
        selectedTables,
        setSelectedTables,
        selectedColumns,
        setSelectedColumns,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const TableContext = createContext<{
  tables: TableSchema[];
  relations: TableRelation[];
  selectedTables: string[];
  setSelectedTables: Dispatch<SetStateAction<string[]>>;
  selectedColumns: string[];
  setSelectedColumns: Dispatch<SetStateAction<string[]>>;
}>({
  tables: [],
  relations: [],
  selectedTables: [],
  setSelectedTables: () => {},
  selectedColumns: [],
  setSelectedColumns: () => {},
});
