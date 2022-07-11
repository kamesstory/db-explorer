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
  // just a prototype and people are unlikely to do anything complicated anyways. The main problem
  // is that the current BFS implementation over-joins tables.
  //
  // Best algorithm is a clustering algorithm where you strongly connect all the required tables
  // to each other inside a graph, and then you selectively include edges that are the shortest
  // distance until the graph is fully connected. That gives you the least amount of joins total.
  //
  // Since the algorithm will double count tables that are already joined within the path to other
  // tables, we should reduce the edge distances between all tables that contain in-path joined
  // tables by the distance the table would need to go to reach that in-path table. This still isn't
  // globally optimal since the initial edge picked might not be optimal, but it heuristically should
  // be close to global optimality.
  //
  // The algorithm:
  // 1. BFS from each node to all the others, calculating the distance of the shortest path from one
  // node to another (this is simply BFS since distance between any node to its direct relations is 1)
  // 2. Now that we have a strongly connected distance graph, eliminate any nodes that do not belong
  // to the required tables list (i.e. the tables that we are selecting columns from)
  // 3. The remaining graph should only include required tables and is still strongly connected.
  // Right now, we have not actually picked any edges yet.
  // 4. Start picking edges by choosing the smallest distances. Whenever you pick an edge, add all tables
  // that are a part of that edge / path into the list of tables that have already been joined. Then,
  // reduce the distances for any edge that has tables in its path, which have already been joined.
  // This is to stop double counting joined tables in edge distance calculations.
  // 5. Stop when you have all the required tables in the list of tables that have already been joined.

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
  const tablesToExplore: {
    tableName: string;
    pathToTable: TableRelation[];
  }[] = [{ tableName: fromTable, pathToTable: [] }];

  const joins: TableRelation[] = [];

  while (requiredTables.size > 0 && tablesToExplore.length > 0) {
    const { tableName, pathToTable } = tablesToExplore.pop()!;
    console.log(`Table to explore`, tableName);

    const tableIsRequired = requiredTables.delete(tableName);
    exploredTables.add(tableName);

    if (tableIsRequired) {
      // Since we stored the path to the table inside the queue, if we find
      // that this table is required, we automatically add all relations to
      // the joins. Then, we reset the path so that we don't add the same
      // relations back in.
      while (pathToTable.length > 0) {
        const relation = pathToTable.shift()!;
        joins.push(relation);
      }
    }

    const tableNode = tableNameToNode.get(tableName)!;
    tableNode.relations.forEach((relation) => {
      const { foreignTableName } = relation.relation;

      if (!exploredTables.has(foreignTableName)) {
        tablesToExplore.push({
          tableName: foreignTableName,
          pathToTable: [...pathToTable, relation.relation],
        });
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
