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

      // TODO: gotta do two-way here
      tableNode.relations.push({
        relation: tableRelation,
        node: foreignTableNode,
      });
    });
  });

  // Inefficient BFS to build the joins, but it should work for a small set since this is
  // just a prototype
  //
  // Technically we can just use Dijkstra's and evaluate at every step, instead of the goal,
  // whether or not all the required tables have been hit. If we completely saturate the graph
  // with a starting node in it and we don't have all the required nodes (i.e. tables), this
  // FROM statement is impossible to generate
  //
  // Actually best algorithm is the one where you connect all the required tables to each other
  // inside a graph, and then you selectively include edges that are the shortest distance until
  // the graph is fully connected. That gives you the least amount of joins total.

  const requiredColumns: TableColumn[] = selectedColumns.map(
    (selectedColumn) => {
      return tables
        .flatMap((table) =>
          table.columns.filter(
            (tableColumn) => tableColumn.name === selectedColumn
          )
        )
        .pop()!;
    }
  );
  const tablesToExplore = new Set<string>(
    requiredColumns.map((column) => column.tableName)
  );
  const exploredTables = new Set<string>();

  const fromStatement = "FROM";
};
