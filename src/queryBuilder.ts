import { TableRelation, TableSchema } from "./TableContext";

type NodeRelation = {
  relation: TableRelation;
  node: Node;
};

type Node = {
  table: TableSchema;
  relations: NodeRelation[];
};

export const queryBuilder = ({
  tables,
  relations,
  selectedColumns,
  selectedRelations,
}: {
  tables: TableSchema[];
  relations: TableRelation[];
  selectedColumns: string[];
  selectedRelations: string[];
}) => {
  /*
  Very basic query builder that is definitely not super efficient but proves the point.

  1. Build a graph of all linked tables.
  2. All selected columns' tables should be part of the same cluster. If not, we can't build
    this query.
  3. Build from statement by taking one selected table, and joining tables using relations
    and BFS (very naive approach)
  3. Select from the tables by using each column specifically

  Later when I actually deal with SQL — beware SQL injection! Properly reference things
  and gate users from dynamically inserting strings
  */

  const tableNameToNode: Map<string, Node> = new Map();
  tables.forEach((t) => {
    const tableNode: Node = {
      table: t,
      relations: [],
    };

    tableNameToNode.set(t.name, tableNode);
  });

  Array.from(tableNameToNode.entries()).forEach(([tableName, tableNode]) => {
    const tableRelations = relations.filter((r) => r.tableName === tableName);

    tableRelations.forEach((tableRelation) => {
      const foreignTableNode = tableNameToNode.get(
        tableRelation.foreignTableName
      )!;

      tableNode.relations.push({
        relation: tableRelation,
        node: foreignTableNode,
      });
    });
  });

  // Inefficient BFS to build the joins, but it should work for a small set since this is
  // just a prototype
  const tablesToExplore = 
  // const fromStatement = "FROM";
  // selectedColumns.forEach((column) => {
  //   const table = tables
  //     .filter((t) => t.columns.map((c) => c.name).includes(column))
  //     .pop();
  //   const;
  // });
};
