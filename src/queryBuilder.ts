import { TableColumn, TableRelation, TableSchema } from "./TableContext";

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
}: // selectedRelations,
{
  tables: TableSchema[];
  relations: TableRelation[];
  selectedColumns: string[];
  // selectedRelations: string[];
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

  console.log(`table name to node`, tableNameToNode);

  Array.from(tableNameToNode.entries()).forEach(([tableName, tableNode]) => {
    const tableRelations = relations.filter((r) => r.tableName === tableName);

    tableRelations.forEach((tableRelation) => {
      const foreignTableNode = tableNameToNode.get(
        tableRelation.foreignTableName
      )!;

      // The edges have to be two way, so we copy into foreign table node as well.
      tableNode.relations.push({
        relation: tableRelation,
        node: foreignTableNode,
      });

      const foreignTableRelation: TableRelation = {
        tableName: tableRelation.foreignTableName,
        columnName: tableRelation.foreignColumnName,
        foreignTableName: tableRelation.tableName,
        foreignColumnName: tableRelation.columnName,
      };

      foreignTableNode.relations.push({
        relation: foreignTableRelation,
        node: tableNode,
      });
    });
  });

  // Inefficient BFS to build the joins, but it should work for a small set since this is
  // just a prototype and people are unlikely to do anything complicated anyways.
  //
  // Actually best algorithm is a clustering algorithm where you connect all the required tables
  // to each other inside a graph, and then you selectively include edges that are the shortest
  // distance until the graph is fully connected. That gives you the least amount of joins total.
  //
  // The main problem here is that the algorithm will double count tables that are already joined
  // but the solution here is to go into the graph and reduce the edge distances containing the
  // already joined tables, whenever you add an edge. This still isn't globally optimal since the
  // initial node picked might not be optimal, but it's a best guess for now.

  const requiredColumns: TableColumn[] = selectedColumns.flatMap(
    (selectedColumn) =>
      tables.flatMap((table) =>
        table.columns.filter(
          (tableColumn) => tableColumn.name === selectedColumn
        )
      )
  );

  console.log(`required columns`, requiredColumns);

  const requiredTables = new Set<string>(
    requiredColumns.map((column) => column.tableName)
  );

  console.log(`required tables`, requiredTables);

  const exploredTables = new Set<string>();
  const fromTable = Array.from(requiredTables).pop()!;
  const tablesToExplore: string[] = [fromTable];

  const joins: TableRelation[] = [];

  while (requiredTables.size > 0 && tablesToExplore.length > 0) {
    const tableName = tablesToExplore.pop()!;
    console.log(`Table to explore`, tableName);

    requiredTables.delete(tableName);
    exploredTables.add(tableName);

    const tableNode = tableNameToNode.get(tableName)!;
    tableNode.relations.forEach((relation) => {
      const { foreignTableName } = relation.relation;

      if (!exploredTables.has(foreignTableName)) {
        tablesToExplore.push(foreignTableName);

        joins.push(relation.relation);
      }
    });
  }

  // Initial (which just is the first table name)
  const sqlExpressionParts: string[] = ["SELECT"];

  sqlExpressionParts.push(
    requiredColumns
      .map((column) => `"${column.tableName}"."${column.name}"`)
      .join(", ")
  );

  sqlExpressionParts.push("FROM");
  sqlExpressionParts.push(fromTable);

  // Subsequent:
  //  source table, source column, foreign table, foreign column
  joins.forEach((join) => {
    sqlExpressionParts.push(
      `JOIN "${join.foreignTableName}" ON "${join.tableName}"."${join.columnName}" = "${join.foreignTableName}"."${join.foreignColumnName}"`
    );
  });

  const sqlExpression = sqlExpressionParts.join("\n");

  return sqlExpression;
};
