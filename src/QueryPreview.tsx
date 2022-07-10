import "./App.css";
import "./tailwind.css";
import { FunctionComponent, useCallback, useContext } from "react";
import { TableContext } from "./TableContext";
import { queryBuilder } from "./queryBuilder";

const QueryPreview: FunctionComponent = () => {
  const { tables, relations, selectedColumns } = useContext(TableContext);

  const buildQuery = useCallback(() => {
    const sql = queryBuilder({ tables, relations, selectedColumns });

    console.log(`SQL = `, sql);
  }, [tables, relations, selectedColumns]);

  return (
    <div className="flex flex-col">
      <span>Yoyoyoyo</span>
      <button onClick={buildQuery}>Preview query</button>
    </div>
  );
};

export default QueryPreview;
