import { createContext, FunctionComponent, useEffect, useState } from "react";
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

  useEffect(() => {
    setTables(getTables());
    setRelations(getTableRelations());
  }, []);

  return (
    <TableContext.Provider
      value={{
        tables,
        relations,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const TableContext = createContext<{
  tables: TableSchema[];
  relations: TableRelation[];
}>({
  tables: [],
  relations: [],
});
