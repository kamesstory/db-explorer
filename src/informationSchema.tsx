import { Edge, Node, Position } from "react-flow-renderer";

type TableRelation = {
  tableName: string;
  columnName: string;
  foreignTableName: string;
  foreignColumnName: string;
};

type TableSchema = {
  name: string;
  columns: TableColumn[];
};

type TableColumn = {
  dataType: string; // Should be enum of some kind
  name: string;
  isNullable?: boolean;
};

export const getTables = (): TableSchema[] => {
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

export const getTableRelations = (): TableRelation[] => {
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

export const getTableNodes = (): Node[] => {
  const tables = getTables();

  const tableNodes = tables.flatMap<Node>((table, index) => {
    const tableNode: Node = {
      id: table.name,
      data: {
        label: table.name,
      },
      position: { x: (index + 1) * 300, y: 100 }, // TODO: calculate position in a better way,
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      style: {
        height: `${(table.columns.length + 1) * 40}px`,
        width: "500px",
      },
    };

    const columnNodes = table.columns.map<Node>((column, index) => ({
      id: `${table.name}.${column.name}`,
      data: {
        label: column.name,
      },
      position: { x: 25, y: (index + 1) * 40 },
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      style: {
        width: "450px",
      },
      parentNode: table.name,
      draggable: false,
    }));

    return [tableNode, ...columnNodes];
  });

  return tableNodes;
};

export const getTableRelationNodes = (): Edge[] => {
  const tableRelations = getTableRelations();

  const relationshipNodes = tableRelations.map<Edge>((relation) => ({
    id: `relation.${relation.tableName}.to.${relation.foreignTableName}`,
    source: relation.tableName,
    target: relation.foreignTableName,
    animated: true,
    label: "Default relationship",
  }));

  return relationshipNodes;
};
