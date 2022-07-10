import { createContext, FunctionComponent, useEffect, useState } from "react";
import { Edge, Node, Position } from "react-flow-renderer";

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

const getTables = (): TableSchema[] => {
  // Pretend this is an async call
  const userTable = {
    name: "user",
    columns: [
      {
        name: "id",
        dataType: "uuid",
      },
      {
        name: "slackId",
        dataType: "text",
      },
      {
        name: "name",
        dataType: "text",
      },
      {
        name: "deleted",
        dataType: "boolean",
      },
      {
        name: "realName",
        dataType: "text",
      },
      {
        name: "timezone",
        dataType: "text",
      },
      {
        name: "profileId",
        dataType: "uuid",
        isNullable: true,
      },
    ],
  };

  const profileTable = {
    name: "profile",
    columns: [
      {
        name: "id",
        dataType: "uuid",
      },
      {
        name: "statusText",
        dataType: "text",
      },
      {
        name: "statusEmoji",
        dataType: "text",
      },
      {
        name: "image512",
        dataType: "text",
      },
    ],
  };

  return [userTable, profileTable];
};

const getTableRelations = (): TableRelation[] => {
  // Pretend this is an async call
  return [
    {
      tableName: "user",
      columnName: "profileId",
      foreignTableName: "profile",
      foreignColumnName: "id",
    },
  ];
};

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