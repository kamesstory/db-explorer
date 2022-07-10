import { TableRelation, TableSchema } from "./TableContext";

export const getTables = (): TableSchema[] => {
  // Pretend this is an async call
  const userTable: TableSchema = {
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
    ].map((column) => ({
      ...column,
      tableName: "user",
    })),
  };

  const profileTable: TableSchema = {
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
    ].map((column) => ({
      ...column,
      tableName: "profile",
    })),
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
